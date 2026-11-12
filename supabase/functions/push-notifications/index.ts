import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type, x-kwg-webhook-secret","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,"Content-Type":"application/json"}});
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const vapidPublic=Deno.env.get("VAPID_PUBLIC_KEY"),vapidPrivate=Deno.env.get("VAPID_PRIVATE_KEY"),vapidSubject=Deno.env.get("VAPID_SUBJECT");
 if(!url||!anon||!service)return json({error:"Supabase function secrets are missing"},500);
 const admin=createClient(url,service,{auth:{persistSession:false}});
 let body;try{body=await req.json()}catch{return json({error:"Invalid JSON"},400)}
 if(body?.action==="subscribe"||body?.action==="unsubscribe"){
  const auth=req.headers.get("Authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!token)return json({error:"Sign in required"},401);
  const userClient=createClient(url,anon,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false}});
  const {data:{user},error:userError}=await userClient.auth.getUser(token);
  if(userError||!user)return json({error:"Invalid session"},401);
  const sub=body.subscription;
  if(body.action==="subscribe"){
   if(!sub?.endpoint||!sub?.keys?.p256dh||!sub?.keys?.auth)return json({error:"Invalid push subscription"},400);
   const {error}=await admin.from("push_subscriptions").upsert({user_id:user.id,endpoint:sub.endpoint,subscription:sub,updated_at:new Date().toISOString()},{onConflict:"endpoint"});
   if(error)return json({error:error.message},500);
   return json({ok:true});
  }
  if(!sub?.endpoint)return json({error:"Missing subscription endpoint"},400);
  const {error}=await admin.from("push_subscriptions").delete().eq("user_id",user.id).eq("endpoint",sub.endpoint);
  if(error)return json({error:error.message},500);
  return json({ok:true});
 }
 const secret=Deno.env.get("KWG_WEBHOOK_SECRET");
 if(!secret||req.headers.get("x-kwg-webhook-secret")!==secret)return json({error:"Unauthorized webhook"},401);
 if(!vapidPublic||!vapidPrivate||!vapidSubject)return json({error:"VAPID secrets are missing"},500);
 const record=body?.record||{};
 let title="KICKOFF WINS GIFTS",message="Kuna taarifa mpya za mashindano.";
 if(body.table==="tournaments"&&body.type==="INSERT"){
  title="Mashindano mapya";
  message=[record.title,record.game].filter(Boolean).join(" • ")||message;
 }else if(body.table==="tournament_results"&&body.type==="INSERT"){
  title="Matokeo mapya";
  message=[record.team_a,record.score_a+" - "+record.score_b,record.team_b].filter(Boolean).join(" ")||message;
 }else{return json({ok:true,skipped:true})}
 try{webpush.setVapidDetails(vapidSubject,vapidPublic,vapidPrivate)}catch(e){return json({error:"Invalid VAPID configuration: "+e.message},500)}
 const {data:subscriptions,error:loadError}=await admin.from("push_subscriptions").select("id,endpoint,subscription");
 if(loadError)return json({error:loadError.message},500);
 const payload=JSON.stringify({title,body:message,url:"./",tag:body.table+"-"+(record.id||Date.now())});
 const results=await Promise.allSettled((subscriptions||[]).map(async item=>{
  try{return await webpush.sendNotification(item.subscription,payload)}
  catch(e){if(e.statusCode===404||e.statusCode===410)await admin.from("push_subscriptions").delete().eq("id",item.id);throw e}
 }));
 const sent=results.filter(x=>x.status==="fulfilled").length;
 return json({ok:true,sent,failed:results.length-sent});
});
