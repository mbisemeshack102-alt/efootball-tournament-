const SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY";
let db=null,user=null,profile=null;
const $=id=>document.getElementById(id);
const translations={
en:{
"TOURNAMENT HUB":"TOURNAMENT HUB","Play. Compete.":"Play. Compete.","Win together.":"Win together.","Mashindano ya Free Fire, PUBG Mobile, Call of Duty na michezo mingine.":"Tournaments for Free Fire, PUBG Mobile, Call of Duty and other games.",
"Ingia au jisajili":"Login or Register","Nenosiri":"Password","Ingia":"Login","Jisajili":"Register","Karibu kwenye mashindano":"Welcome to the tournaments","Akaunti mpya itahitaji kuthibitisha email. Admin dashboard inaonekana kwa akaunti yenye ruhusa ya admin pekee.":"New accounts must verify their email. The Admin dashboard is only available to authorized admins.",
"Muhtasari":"Overview","Mashindano":"Tournaments","Wachezaji":"Players","Admin":"Admin","Settings":"Settings","Home":"Home","Toka":"Logout","Logout":"Logout","DASHBOARD":"DASHBOARD","Karibu":"Welcome","Habari za mfumo":"System updates","Chagua Mashindano kujiunga, au fungua Wachezaji kuona washiriki waliosajiliwa.":"Choose Tournaments to join, or open Players to see registered participants.",
"Mashindano yanayopatikana":"Available tournaments","Orodha ya wachezaji":"Player list","Taarifa za email hazionyeshwi kwa wachezaji wengine.":"Email addresses are not shown to other players.","Admin Dashboard":"Admin Dashboard","Usimamizi wa mashindano na wachezaji. Akaunti yako lazima iwe na role = admin kwenye Supabase.":"Manage tournaments and players. Your account must have role = admin in Supabase.","Jina la mashindano":"Tournament name","Mchezo":"Game","+ Tengeneza mashindano":"+ Create tournament","Usimamizi wa washiriki":"Participant management","Saa Tanzania:":"Tanzania time:","Badili nenosiri":"Change password","Nenosiri jipya":"New password","Audio input/output":"Audio input/output","Ingiza sauti":"Voice input","Toa sauti":"Voice output","Ruhusu microphone.":"Allow microphone access.","footer":"© 2026 KICKOFF WINS GIFTS • Play fair, win big."
},
sw:{}
};
function applyLanguage(lang){
const dict=translations[lang]||translations.sw;
document.documentElement.lang=lang;
document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.getAttribute("data-i18n");if(dict[key])el.textContent=dict[key]});
const placeholders=lang==="en"?{"email":"Email address","password":"At least 6 characters","newTitle":"Example: Free Fire Weekend Cup","newPassword":"New password","voiceText":"Recognized speech"}:{"email":"jina@email.com","password":"Angalau herufi 6","newTitle":"Mfano: Free Fire Weekend Cup","newPassword":"Nenosiri jipya","voiceText":"Maneno yaliyotambuliwa"};
Object.entries(placeholders).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.placeholder=value});
document.querySelectorAll("[data-tab]").forEach(b=>{const key=b.dataset.tab;const names=lang==="en"?{overview:"Overview",tournaments:"Tournaments",players:"Players",gifts:"Gifts",voicechat:"Voice Chat",admin:"Admin",settings:"Settings"}:{overview:"Muhtasari",tournaments:"Mashindano",players:"Wachezaji",gifts:"Zawadi",voicechat:"Voice Chat",admin:"Admin",settings:"Settings"};if(b.dataset.tab!=="")b.textContent=names[key]||b.textContent});
try{localStorage.setItem("kwg-language",lang)}catch(e){}
}
function message(id,msg,error=false){const el=$(id);el.textContent=msg;el.classList.remove("hidden","error");if(error)el.classList.add("error")}
function ready(){return db&&SUPABASE_URL.startsWith("https://")&&!SUPABASE_ANON_KEY.startsWith("YOUR_")}
function setup(){if(!window.supabase){message("authMsg","Imeshindikana kupakia huduma ya login. Angalia intaneti.",true);return}if(!ready()){message("authMsg","Mmiliki wa mfumo: weka Supabase Project URL na Publishable Key ndani ya index.html kabla ya kutumia login.",true);return}db=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);db.auth.getSession().then(({data})=>{if(data.session)loadUser(data.session.user)});db.auth.onAuthStateChange((_event,session)=>{if(session)loadUser(session.user);else showLoggedOut()})}
function showLoggedOut(){$("welcome").classList.remove("hidden");$("app").classList.add("hidden");$("bottomNav").classList.add("hidden");$("topActions").innerHTML='<span class="muted">Gaming tournaments • Tanzania</span>';user=null;profile=null}
async function loadUser(u){user=u;const {data,error}=await db.from("profiles").select("id,display_name,role").eq("id",u.id).single();if(error){message("authMsg","Akaunti imeingia lakini profile haijapatikana. Hakikisha SQL schema imeendeshwa.",true);return}profile=data;$("welcome").classList.add("hidden");$("app").classList.remove("hidden");$("bottomNav").classList.remove("hidden");$("hello").textContent="Karibu, "+(data.display_name||u.email);$("roleTag").textContent=data.role.toUpperCase();$("adminTab").classList.toggle("hidden",data.role!=="admin");$("topActions").textContent="";await refresh()}
async function refresh(){await Promise.all([loadTournaments(),loadPlayers(),loadGifts()])}
async function loadTournaments(){const {data,error}=await db.from("tournaments").select("id,title,game,status,created_at").order("created_at",{ascending:false});if(error){$("tournamentList").textContent="Imeshindikana kupakia mashindano.";return}$("tCount").textContent=data.length;$("tournamentList").innerHTML=data.length?data.map(t=>'<div class="item"><div><b>'+esc(t.title)+'</b><div class="muted small">'+esc(t.game)+' • '+esc(t.status)+'</div></div><button data-join="'+t.id+'">Jiunge</button></div>').join():"Bado hakuna mashindano.";document.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>join(b.dataset.join));if(profile.role==="admin"){document.querySelectorAll("#tournamentList .item").forEach(el=>{const b=el.querySelector("[data-join]");if(b){const d=document.createElement("button");d.textContent="Futa";d.className="danger";d.onclick=async()=>{if(confirm("Futa mashindano haya?")){const {error}=await db.from("tournaments").delete().eq("id",b.dataset.join);if(error)alert(error.message);else loadTournaments()}};el.appendChild(d)}})}}
async function join(id){const {error}=await db.from("tournament_registrations").insert({tournament_id:id,player_id:user.id});alert(error?(error.code==="23505"?"Tayari umejiunga.":error.message):"Umejiunga na mashindano!")}
async function loadPlayers(){const {data,error}=await db.from("profiles").select("id,display_name,role,created_at").order("created_at",{ascending:false});if(error){$("playerList").textContent="Imeshindikana kupakia wachezaji.";return}$("pCount").textContent=data.length;$("playerList").innerHTML=data.map(p=>'<div class="item"><div><b>'+esc(p.display_name||"Mchezaji")+'</b><div class="muted small">'+esc(p.role)+'</div></div></div>').join("");$("adminPlayers").innerHTML=profile.role==="admin"?data.map(p=>'<div class="item"><div><b>'+esc(p.display_name||"Mchezaji")+'</b><div class="muted small">'+esc(p.role)+'</div></div><span class="tag">'+(p.id===user.id?"WEWE":"AKAUNTI")+'</span></div>').join(""):"Admin pekee."}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("loginBtn").onclick=async()=>{if(!ready())return;const {error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)message("authMsg",error.message,true)}
$("registerBtn").onclick=async()=>{if(!ready())return;const email=$("email").value.trim(),password=$("password").value;if(password.length<6){message("authMsg","Nenosiri liwe na angalau herufi 6.",true);return}const {data,error}=await db.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});if(error)message("authMsg",error.message,true);else message("authMsg",data.session?"Akaunti imetengenezwa.":"Tumetuma link ya kuthibitisha email. Angalia inbox yako.")}
$("logoutBtn").onclick=()=>db.auth.signOut();$("bottomLogout").onclick=()=>db.auth.signOut();
$("createTournament").onclick=async()=>{const title=$("newTitle").value.trim();if(!title)return message("adminMsg","Weka jina la mashindano.",true);const {error}=await db.from("tournaments").insert({title,game:$("newGame").value,created_by:user.id});if(error)message("adminMsg",error.message,true);else{message("adminMsg","Mashindano yametengenezwa.");$("newTitle").value="";await loadTournaments()}}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{if(b.dataset.tab==="admin"&&profile.role!=="admin")return;document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".tabView").forEach(x=>x.classList.toggle("hidden",x.id!==b.dataset.tab))});
$("passwordBtn")?.addEventListener("click",async()=>{const p=$("newPassword").value;if(p.length<6)return message("settingsMsg","Nenosiri liwe na herufi 6 au zaidi.",true);const {error}=await db.auth.updateUser({password:p});message("settingsMsg",error?error.message:"Nenosiri limebadilishwa.",!!error)});
$("voiceInput")?.addEventListener("click",()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$("audioStatus").textContent="Tumia microphone ya keyboard ya Android.";return}const rec=new SR();rec.lang="sw-TZ";rec.onresult=e=>$("voiceText").value=e.results[0][0].transcript;rec.onerror=e=>$("audioStatus").textContent=e.error;rec.start()});
$("voiceOutput")?.addEventListener("click",()=>{if(window.speechSynthesis)speechSynthesis.speak(new SpeechSynthesisUtterance("Karibu KICKOFF WINS GIFTS"));else $("audioStatus").textContent="Audio output haipatikani."});

async function loadGifts(){
 const {data,error}=await db.from("gifts").select("id,name,description,status").order("created_at",{ascending:false});
 if(error){$("giftList").textContent="Gift list unavailable: "+error.message;return}
 $("giftAdminPanel").classList.toggle("hidden",profile.role!=="admin");
 const {data:claims}=await db.from("gift_claims").select("id,gift_id,status").eq("player_id",user.id);const mine=claims||[];
 $("giftList").innerHTML=data.length?data.map(g=>{const c=mine.find(x=>x.gift_id===g.id);return '<div class="item"><div><b>'+esc(g.name)+'</b><div class="muted small">'+esc(g.description||"")+'</div><span class="tag">'+esc(c?c.status:g.status)+'</span></div>'+(profile.role==="admin"?'<button class="secondary" data-deliver="'+(c?c.id:"")+'" '+(!c||c.status==="delivered"?"disabled":"")+'>Mark delivered</button>':'<button data-claim="'+g.id+'" '+(c?"disabled":"")+'>'+(c?"Requested":"Claim gift")+'</button>')+'</div>'}).join(""):"Hakuna zawadi zilizowekwa bado.";
 document.querySelectorAll("[data-claim]").forEach(b=>b.onclick=async()=>{const {error}=await db.from("gift_claims").insert({gift_id:b.dataset.claim,player_id:user.id});if(error)alert(error.message);else loadGifts()});
 document.querySelectorAll("[data-deliver]").forEach(b=>b.onclick=async()=>{if(!b.dataset.deliver)return;const {error}=await db.from("gift_claims").update({status:"delivered"}).eq("id",b.dataset.deliver);if(error)alert(error.message);else loadGifts()});
}
$("addGift").onclick=async()=>{const name=$("giftName").value.trim(),description=$("giftValue").value.trim();if(!name)return message("giftAdminMsg","Weka jina la zawadi.",true);const {error}=await db.from("gifts").insert({name,description,created_by:user.id});if(error)message("giftAdminMsg",error.message,true);else{$("giftName").value="";$("giftValue").value="";message("giftAdminMsg","Zawadi imehifadhiwa.");loadGifts()}};
let voiceChannel=null,voiceStream=null,voicePeers={},voiceRoomKey="",voiceMuted=false;
const rtcConfig={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};
function vstatus(t,bad=false){$("voiceChatStatus").textContent=t;$("voiceChatStatus").classList.toggle("error",bad)}
function dropPeer(id){if(voicePeers[id]){voicePeers[id].close();delete voicePeers[id]}const a=$("audio-"+id);if(a)a.remove()}
async function peer(id,makeOffer){
 if(voicePeers[id]||!voiceStream)return;const pc=new RTCPeerConnection(rtcConfig);voicePeers[id]=pc;
 voiceStream.getTracks().forEach(t=>pc.addTrack(t,voiceStream));
 pc.onicecandidate=e=>{if(e.candidate)voiceChannel?.send({type:"broadcast",event:"signal",payload:{to:id,from:user.id,room:voiceRoomKey,candidate:e.candidate}})};
 pc.ontrack=e=>{let a=$("audio-"+id);if(!a){a=document.createElement("audio");a.id="audio-"+id;a.autoplay=true;a.playsInline=true;$("remoteAudios").appendChild(a)}a.srcObject=e.streams[0]};
 if(makeOffer){const offer=await pc.createOffer();await pc.setLocalDescription(offer);await voiceChannel.send({type:"broadcast",event:"signal",payload:{to:id,from:user.id,room:voiceRoomKey,description:pc.localDescription}})}
 return pc;
}
async function leaveVoice(){
 if(voiceChannel){try{await voiceChannel.untrack();await db.removeChannel(voiceChannel)}catch(e){}voiceChannel=null}
 Object.keys(voicePeers).forEach(dropPeer);if(voiceStream){voiceStream.getTracks().forEach(t=>t.stop());voiceStream=null}
 $("voiceJoin").disabled=false;$("voiceMute").disabled=true;$("voiceLeave").disabled=true;$("voiceMute").textContent="Mute";$("voiceParticipants").textContent="—";voiceMuted=false;vstatus("Umetoka kwenye voice chat.");
}
$("voiceJoin").onclick=async()=>{
 if(!db||!user)return vstatus("Ingia kwanza kwenye akaunti.",true);
 if(!navigator.mediaDevices?.getUserMedia)return vstatus("Microphone haipatikani. Fungua app kwa HTTPS na browser inayounga mkono audio.",true);
 try{
  voiceStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  voiceRoomKey="kwg-"+$("voiceGame").value.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+$("voiceRoom").value;
  voiceChannel=db.channel(voiceRoomKey,{config:{broadcast:{self:false},presence:{key:user.id}}});
  voiceChannel.on("broadcast",{event:"signal"},async({payload})=>{if(!payload||payload.to!==user.id||payload.room!==voiceRoomKey)return;try{const pc=voicePeers[payload.from]||await peer(payload.from,false);if(payload.description){await pc.setRemoteDescription(payload.description);if(payload.description.type==="offer"){const ans=await pc.createAnswer();await pc.setLocalDescription(ans);await voiceChannel.send({type:"broadcast",event:"signal",payload:{to:payload.from,from:user.id,room:voiceRoomKey,description:pc.localDescription}})}}if(payload.candidate)await pc.addIceCandidate(payload.candidate)}catch(e){console.warn("Voice signaling failed",e)}});
  voiceChannel.on("presence",{event:"sync"},async()=>{const ids=Object.keys(voiceChannel.presenceState()).filter(id=>id!==user.id);$("voiceParticipants").textContent=(ids.length+1)+" player(s)";for(const id of ids)if(user.id.localeCompare(id)<0)await peer(id,true)});
  voiceChannel.on("presence",{event:"join"},async({key})=>{if(key!==user.id&&user.id.localeCompare(key)<0)await peer(key,true)});
  const st=await voiceChannel.subscribe(async state=>{if(state==="SUBSCRIBED"){await voiceChannel.track({user_id:user.id,name:profile.display_name||"Player"});$("voiceJoin").disabled=true;$("voiceMute").disabled=false;$("voiceLeave").disabled=false;vstatus("Umeingia "+$("voiceGame").value+" / "+$("voiceRoom").value+". Ongea sasa.")}else if(state==="CHANNEL_ERROR"||state==="TIMED_OUT")vstatus("Voice channel connection failed.",true)});
 }catch(e){if(voiceStream){voiceStream.getTracks().forEach(t=>t.stop());voiceStream=null}vstatus("Voice chat error: "+e.message,true)}
};
$("voiceMute").onclick=()=>{if(!voiceStream)return;voiceMuted=!voiceMuted;voiceStream.getAudioTracks().forEach(t=>t.enabled=!voiceMuted);$("voiceMute").textContent=voiceMuted?"Unmute":"Mute";vstatus(voiceMuted?"Microphone muted.":"Microphone on.")};
$("voiceLeave").onclick=leaveVoice;

setInterval(()=>{const e=$("clock");if(e)e.textContent=new Intl.DateTimeFormat("sw-TZ",{timeZone:"Africa/Dar_es_Salaam",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date())},1000);
const langSelect=$("languageSelect");if(langSelect){const saved=(()=>{try{return localStorage.getItem("kwg-language")}catch(e){return null}})()||"sw";langSelect.value=saved;applyLanguage(saved);langSelect.addEventListener("change",()=>applyLanguage(langSelect.value))}setup();