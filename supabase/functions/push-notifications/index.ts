import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders={
 "Access-Control-Allow-Origin":"*",
 "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type, x-kwg-webhook-secret",
 "Access-Control-Allow-Methods":"POST, OPTIONS"
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,"Content-Type":"application/json"}});
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);

 const url=Deno.env.get("SUPABASE_URL");
 const anon=Deno.env.get("SUPABASE_ANON_KEY");
 const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const vapidPublic=Deno.env.get("VAPID_PUBLIC_KEY");
 const vapidPrivate=Deno.env.get("VAPID_PRIVATE_KEY");
 const vapidSubject=Deno.env.get("VAPID_SUBJECT")||"mailto:admin@kickoffwinsgifts.app";
 if(!url||!anon||!service)return json({error:"Supabase function secrets are missing"},500);
 if(!vapidPublic||!vapidPrivate)return json({error:"VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are missing"},500);

 const admin=createClient(url,service,{auth:{persistSession:false}});
 let body:any;
 try{body=await req.json()}catch{return json({error:"Invalid JSON"},400)}

 const auth=req.headers.get("Authorization")||"";
 const token=auth.startsWith("Bearer ")?auth.slice(7):"";
 const requireUser=async()=>{
  if(!token)throw new Error("Sign in required");
  const userClient=createClient(url,anon,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false}});
  const {data:{user},error}=await userClient.auth.getUser(token);
  if(error||!user)throw new Error("Invalid session");
  return user;
 };
 const sendToSubscriptions=async(title:string,message:string,urlPath="./")=>{
  webpush.setVapidDetails(vapidSubject,vapidPublic,vapidPrivate);
  const {data:subscriptions,error}=await admin.from("push_subscriptions").select("id,endpoint,subscription");
  if(error)throw new Error(error.message);
  const rows=subscriptions||[];
  const results=await Promise.allSettled(rows.map(async item=>{
   try{return await webpush.sendNotification(item.subscription,JSON.stringify({title,body:message,url:urlPath,tag:"kwg-"+Date.now()}))}
   catch(e:any){
    if(e.statusCode===404||e.statusCode===410)await admin.from("push_subscriptions").delete().eq("id",item.id);
    throw e;
   }
  }));
  return {sent:results.filter(x=>x.status==="fulfilled").length,failed:results.filter(x=>x.status==="rejected").length,total:rows.length};
 };

 if(body?.action==="subscribe"||body?.action==="unsubscribe"){
  let user;
  try{user=await requireUser()}catch(e){return json({error:(e as Error).message},401)}
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

 if(body?.action==="send"){
  let user;
  try{user=await requireUser()}catch(e){return json({error:(e as Error).message},401)}
  const {data:profile,error:profileError}=await admin.from("profiles").select("role").eq("id",user.id).single();
  if(profileError||profile?.role!=="admin")return json({error:"Admin permission required"},403);
  const title=String(body.title||"").trim().slice(0,80);
  const message=String(body.body||"").trim().slice(0,240);
  if(!title||!message)return json({error:"Title and message are required"},400);
  try{return json({ok:true,...await sendToSubscriptions(title,message)})}
  catch(e){return json({error:(e as Error).message},500)}
 }

 const secret=Deno.env.get("KWG_WEBHOOK_SECRET");
 if(!secret||req.headers.get("x-kwg-webhook-secret")!==secret)return json({error:"Unauthorized webhook"},401);
 const record=body?.record||{};
 let title="KICKOFF WINS GIFTS";
 let message="Kuna taarifa mpya za mashindano.";
 if(body?.table==="tournaments"&&body?.type==="INSERT"){
  title="Mashindano mapya";
  message=[record.title,record.game].filter(Boolean).join(" • ")||message;
 }else if(body?.table==="tournament_results"&&body?.type==="INSERT"){
  title="Matokeo mapya";
  message=[record.team_a,record.score_a??"",record.score_b!==undefined?" - "+record.score_b:"",record.team_b].filter(Boolean).join(" ").trim()||message;
 }else{return json({ok:true,skipped:true,reason:"Unsupported webhook event"})}
 try{return json({ok:true,...await sendToSubscriptions(title,message)})}
 catch(e){return json({error:(e as Error).message},500)}
});
