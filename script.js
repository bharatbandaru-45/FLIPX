const $ = id => document.getElementById(id);
const STORE = "flipx-ultimate-v2";
const today = () => new Date().toLocaleDateString("en-CA");
const defaults = {history:[],heads:0,tails:0,wins:0,streak:0,bestStreak:0,challengeDate:today(),challengeCount:0,sound:true,theme:"dark",coin:"gold",leaderboard:[],twoPlayer:false,scores:[0,0],activePlayer:0};
let data = load();
let choice = "Heads", busy = false, toastTimer;
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return {...defaults}}}
function save(){localStorage.setItem(STORE,JSON.stringify(data))}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function notify(message){const t=$("toast");t.textContent=message;t.classList.remove("show");void t.offsetWidth;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2100)}
function render(){
 const total=data.heads+data.tails, headsPct=total?Math.round(data.heads/total*100):50, tailsPct=total?100-headsPct:50;
 $("totalFlips").textContent=String(total).padStart(2,"0");$("headsCount").textContent=data.heads;$("tailsCount").textContent=data.tails;
 $("winRate").innerHTML=`${total?Math.round(data.wins/total*100):0}<span>%</span>`;$("streak").innerHTML=`${data.streak} <small>IN A ROW</small>`;
 $("headsMeter").style.width=headsPct+"%";$("tailsMeter").style.width=tailsPct+"%";$("headsPercent").textContent=headsPct+"%";$("tailsPercent").textContent=tailsPct+"%";
 $("challengeCount").textContent=`${Math.min(data.challengeCount,10)} / 10`;$("challengeProgress").style.width=Math.min(data.challengeCount,10)*10+"%";$("challengeStatus").textContent=data.challengeCount>=10?"QUEST COMPLETE":"QUEST IN PROGRESS";
 $("history").innerHTML=data.history.length?data.history.slice(0,14).map(x=>`<li><span>${escapeHTML(x.time)}</span><span class="history-result ${x.result.toLowerCase()}">${x.result.toUpperCase()}</span><span>${x.won?"✦ WIN":"— MISS"}</span></li>`).join(""):'<li class="empty-state">Your flips will show up here.</li>';
 $("leaderboard").innerHTML=data.leaderboard.length?data.leaderboard.slice(0,5).map((x,i)=>`<li><span>${["01","02","03","04","05"][i]} / ${escapeHTML(x.name)}</span><strong>${x.score} STREAK</strong></li>`).join(""):'<li class="empty-state">Your name belongs up here.</li>';
 $("soundToggle").textContent=data.sound?"♫":"♪";$("themeToggle").textContent=data.theme==="dark"?"◐":"☼";document.body.classList.toggle("light",data.theme==="light");
 $("coin").className=`coin coin-${data.coin}`;document.querySelectorAll(".swatch").forEach(b=>b.classList.toggle("active",b.dataset.coin===data.coin));
 $("twoPlayer").checked=data.twoPlayer;$("playersBox").classList.toggle("hidden",!data.twoPlayer);$("playerOneScore").textContent=data.scores[0];$("playerTwoScore").textContent=data.scores[1];$("turnLabel").textContent=`PLAYER 0${data.activePlayer+1}'S TURN`;
}
function setChoice(value){choice=value;document.querySelectorAll(".choice").forEach(b=>b.classList.toggle("active",b.dataset.choice===value))}
document.querySelectorAll(".choice").forEach(b=>b.addEventListener("click",()=>setChoice(b.dataset.choice)));
document.querySelectorAll(".swatch").forEach(b=>b.addEventListener("click",()=>{data.coin=b.dataset.coin;save();render();notify(`${b.dataset.coin.toUpperCase()} COIN SELECTED`)}));
function sound(){
 if(!data.sound)return;
 try{const C=window.AudioContext||window.webkitAudioContext,ctx=new C();[560,760,920,1120].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,ctx.currentTime+i*.075);g.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+i*.075+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.075+.11);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+i*.075);o.stop(ctx.currentTime+i*.075+.12)});setTimeout(()=>ctx.close(),650)}catch{}
}
function updateBoard(){const name=data.twoPlayer?`PLAYER 0${data.activePlayer+1}`:"YOU";let item=data.leaderboard.find(x=>x.name===name);if(item)item.score=Math.max(item.score,data.bestStreak);else data.leaderboard.push({name,score:data.bestStreak});data.leaderboard.sort((a,b)=>b.score-a.score);data.leaderboard=data.leaderboard.slice(0,5)}
function flip(){
 if(busy)return;busy=true;$("flipBtn").disabled=true;$("result").className="result";$("result").innerHTML='<span class="result-dot"></span> THE MOMENT OF TRUTH';
 const result=Math.random()<.5?"Heads":"Tails",coin=$("coin"),base=Number(coin.dataset.rotation||0);
 const turns=8+(Math.floor(Math.random()*3)),target=base+turns*360+(result==="Tails"?180:0);
 coin.style.animation="none";coin.style.transform=`rotateY(${target}deg)`;coin.dataset.rotation=target;
 setTimeout(()=>{
  const won=result===choice;if(result==="Heads")data.heads++;else data.tails++;
  if(won){data.wins++;data.streak++;data.bestStreak=Math.max(data.bestStreak,data.streak)}else data.streak=0;
  if(data.challengeDate!==today()){data.challengeDate=today();data.challengeCount=0}data.challengeCount++;
  if(data.twoPlayer&&won)data.scores[data.activePlayer]++;
  data.history.unshift({result,won,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});data.history=data.history.slice(0,60);
  updateBoard();save();render();$("result").className=`result ${won?"win":"lose"}`;$("result").innerHTML=`<span class="result-dot"></span> ${result.toUpperCase()} · ${won?"YOU CALLED IT":"NOT THIS TIME"}`;
  coin.style.animation="coinIdle 4s ease-in-out infinite";coin.setAttribute("aria-label",`Coin showing ${result.toLowerCase()}`);sound();notify(won?"NICE CALL — YOU GOT IT!":`${result.toUpperCase()} — NEXT FLIP?`);
  busy=false;$("flipBtn").disabled=false;if(data.twoPlayer){data.activePlayer=1-data.activePlayer;save();render()}
 },1850);
}
$("flipBtn").addEventListener("click",flip);
$("soundToggle").addEventListener("click",()=>{data.sound=!data.sound;save();render();notify(data.sound?"SOUND ON":"SOUND OFF")});
$("themeToggle").addEventListener("click",()=>{data.theme=data.theme==="dark"?"light":"dark";save();render()});
$("twoPlayer").addEventListener("change",e=>{data.twoPlayer=e.target.checked;data.activePlayer=0;save();render();notify(data.twoPlayer?"TWO-PLAYER MODE ON":"TWO-PLAYER MODE OFF")});
$("resetPlayers").addEventListener("click",()=>{data.scores=[0,0];data.activePlayer=0;save();render();notify("MATCH RESET")});
$("clearHistory").addEventListener("click",()=>{data.history=[];save();render();notify("HISTORY CLEARED")});
document.addEventListener("keydown",e=>{if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;if(e.code==="Space"){e.preventDefault();flip()}if(e.key.toLowerCase()==="h")setChoice("Heads");if(e.key.toLowerCase()==="t")setChoice("Tails");if(e.key.toLowerCase()==="m"){$("themeToggle").click()}if(e.key.toLowerCase()==="s"){$("soundToggle").click()}});
$("year").textContent=new Date().getFullYear();if(data.challengeDate!==today()){data.challengeDate=today();data.challengeCount=0;save()}render();
