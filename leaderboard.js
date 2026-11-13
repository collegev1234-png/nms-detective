(() => {
'use strict';
const cfg=window.DETECTIVE_CONFIG||{};
const url=String(cfg.supabaseUrl||'').replace(/\/$/,'');
const key=String(cfg.supabaseAnonKey||'');
const configured=/^https:\/\/[^/]+\.supabase\.co$/.test(url)&&key.length>20&&!key.startsWith('PASTE_');
const endpoint=url+'/rest/v1/detective_scores';
const headers=()=>({...{'apikey':key},...(key.startsWith('eyJ')?{Authorization:'Bearer '+key}:{})});
let interval=null,display=false;
const $=id=>document.getElementById(id);
const local=()=>{try{return JSON.parse(localStorage.getItem('aarkay_detective_scores_v1')||'[]')}catch{return []}};
function draw(scores,label){const body=$('boardRows');body.replaceChildren();if(!scores.length){const row=body.insertRow();const c=row.insertCell();c.colSpan=5;c.textContent='No detectives yet. Be the first!'}for(const [i,r] of scores.entries()){const row=body.insertRow();for(const value of [i+1,r.nickname,Number(r.score).toLocaleString('en-IN'),`${r.completed}/${r.total}`,new Date(r.created_at).toLocaleString('en-IN')]){const c=row.insertCell();c.textContent=String(value)}}$('boardSync').textContent=label+' · Updated '+new Date().toLocaleTimeString('en-IN')}
async function load(){if(!configured){draw(local().sort((a,b)=>b.score-a.score).slice(0,50),'Local only');$('boardMessage').textContent='Shared database not configured. Add your public Supabase project URL and publishable key in config.js.';return}try{const params=new URLSearchParams({select:'nickname,score,completed,total,created_at',event_id:'eq.'+String(cfg.eventId||'bts-2026'),order:'score.desc,completed.desc,created_at.asc',limit:'50'});const r=await fetch(endpoint+'?'+params,{headers:headers(),cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status+' '+(await r.text()).slice(0,120));draw(await r.json(),'Shared Supabase');$('boardMessage').textContent='Top 50 players across all devices · auto-refresh every 15 seconds.'}catch(e){draw(local().sort((a,b)=>b.score-a.score).slice(0,50),'Local backup');$('boardMessage').textContent='Shared leaderboard unavailable: '+e.message}}
async function submit(entry){if(!configured)return 'Saved on this device. Configure Supabase for shared rankings.';try{const payload={event_id:String(cfg.eventId||'bts-2026'),nickname:entry.nickname,score:entry.score,completed:entry.completed,total:5};const r=await fetch(endpoint,{method:'POST',headers:{...headers(),'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)});if(!r.ok)throw Error('HTTP '+r.status+' '+(await r.text()).slice(0,140));return '✓ Score submitted to the shared leaderboard!'}catch(e){return 'Saved locally; shared upload failed: '+e.message}}
function open(isDisplay=false){display=isDisplay;$('leaderboardOverlay').classList.add('show');$('closeBoard').style.display=display?'none':'';load();if(interval)clearInterval(interval);interval=setInterval(load,15000)}
function close(){if(display)return;$('leaderboardOverlay').classList.remove('show');if(interval)clearInterval(interval);interval=null}
window.SummitBoard={open,close,load,submit};
})();
