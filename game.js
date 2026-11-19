
let stage=0,chosen='',position=50,played=false;const screens=[...document.querySelectorAll('.screen')];function show(n){stage=n;screens.forEach((s,i)=>s.classList.toggle('active',i===n));document.getElementById('stepchip').textContent=`STAGE ${n+1} / 8`;document.getElementById('bar').style.width=((n+1)/8*100)+'%';window.scrollTo({top:0,behavior:'smooth'});}function next(){if(stage<7)show(stage+1)}function restart(){chosen='';played=false;position=50;document.getElementById('coin').classList.remove('drop');document.getElementById('insert').disabled=false;document.getElementById('chooseNext').disabled=true;document.querySelectorAll('.item').forEach(x=>x.classList.remove('selected'));document.getElementById('selection').textContent='상품을 하나 선택해 보세요.';document.getElementById('gameclaw').className='claw';document.getElementById('gameclaw').style.left='50%';document.getElementById('afterplay').disabled=true;document.getElementById('grab').disabled=false;document.getElementById('left').disabled=false;document.getElementById('right').disabled=false;document.getElementById('playstatus').textContent='집게 위치를 정한 뒤 내려보세요.';show(0)}
function ding(){try{const C=window.AudioContext||window.webkitAudioContext;const c=new C();const t=c.currentTime;[880,1175,1568].forEach((f,i)=>{let o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.1);g.gain.exponentialRampToValueAtTime(.12,t+i*.1+.01);g.gain.exponentialRampToValueAtTime(.0001,t+i*.1+.3);o.connect(g).connect(c.destination);o.start(t+i*.1);o.stop(t+i*.1+.31)});setTimeout(()=>c.close(),1100)}catch(e){}}
document.getElementById('insert').onclick=()=>{ding();document.getElementById('coin').classList.add('drop');document.getElementById('insert').disabled=true;setTimeout(()=>show(1),900)};const emojis={'양파':'🧅','당근':'🥕','컵라면':'🍜','빵':'🍞','통조림':'🥫','화장지':'🧻'};document.querySelectorAll('.item').forEach(b=>b.onclick=()=>{chosen=b.dataset.item;document.querySelectorAll('.item').forEach(x=>x.classList.toggle('selected',x===b));document.getElementById('selection').textContent=`선택한 상품: ${chosen}`;document.getElementById('chosenEmoji').textContent=emojis[chosen];document.getElementById('chooseNext').disabled=false});function move(d){if(played)return;position=Math.max(25,Math.min(75,position+d));document.getElementById('gameclaw').style.left=position+'%'}document.getElementById('left').onclick=()=>move(-12);document.getElementById('right').onclick=()=>move(12);document.getElementById('grab').onclick=()=>{if(played)return;played=true;document.getElementById('left').disabled=true;document.getElementById('right').disabled=true;document.getElementById('grab').disabled=true;document.getElementById('playstatus').textContent='집게가 내려갑니다…';document.getElementById('gameclaw').classList.add('clawmove');setTimeout(()=>{document.getElementById('gameclaw').classList.remove('clawmove');document.getElementById('gameclaw').classList.add('clawlift');document.getElementById('playstatus').textContent='모의 체험 완료! 실제 게임의 당첨 여부와는 무관합니다.';document.getElementById('afterplay').disabled=false;ding()},1300)};


(()=>{
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,scr=n=>document.querySelectorAll('.screen')[n];
let sound=true;const _ding=ding;ding=()=>{if(sound)_ding()};
$('soundbtn').onclick=e=>{sound=!sound;const b=e.currentTarget;b.setAttribute('aria-pressed',sound);b.textContent=sound?'🔊':'🔇';b.setAttribute('aria-label',sound?'효과음 끄기':'효과음 켜기')};
const pb=$('bar').parentElement;pb.setAttribute('role','progressbar');pb.setAttribute('aria-label','진행 상황');pb.setAttribute('aria-valuemin',1);pb.setAttribute('aria-valuemax',8);pb.setAttribute('aria-valuenow',1);
$('selection').setAttribute('aria-live','polite');$('playstatus').setAttribute('aria-live','polite');
const items=[...document.querySelectorAll('.item')],syncItems=()=>items.forEach(x=>x.setAttribute('aria-pressed',x.classList.contains('selected')));
items.forEach(b=>b.addEventListener('click',syncItems));syncItems();
function count(el){const raw=el.dataset.v||(el.dataset.v=el.textContent.trim()),m=raw.match(/^([+\-−]?)(\d+(?:\.\d+)?)(.*)$/);if(!m||reduce){el.textContent=raw;return}
const d=(m[2].split('.')[1]||'').length,to=+m[2],id=el._id=(el._id||0)+1,t0=performance.now();
(function f(t){if(el._id!==id)return;const p=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=m[1]+(to*e).toFixed(d)+m[3];if(p<1)requestAnimationFrame(f)})(t0)}
function burst(on){const h=document.querySelector('[data-stage="7"] .visual');h.querySelectorAll('.cf').forEach(x=>x.remove());if(!on||reduce)return;const c=['#ee5d9c','#8bdfca','#ffd36b','#b9a4f0','#ffffff'];
for(let i=0;i<34;i++){const e=document.createElement('i');e.className='cf';e.style.cssText=`left:${Math.random()*100}%;background:${c[i%5]};animation-delay:${Math.random()*1.2}s;animation-duration:${2.4+Math.random()*1.8}s;--r:${Math.random()*720-360}deg`;h.appendChild(e)}}
const _s=show;show=n=>{_s(n);pb.setAttribute('aria-valuenow',n+1);$('backbtn').hidden=n===0;
if(n===0){$('coin').classList.remove('drop');$('insert').disabled=false}
if(n===5)scr(5).querySelectorAll('.counter').forEach(count);
if(n===6)scr(6).querySelectorAll('.stat strong').forEach(count);
burst(n===7);const h=scr(n).querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}};
const _r=restart;restart=()=>{$('held').classList.remove('on');$('chosenEmoji').style.opacity='';_r();syncItems()};
window.prev=()=>{if(stage>0)show(stage-1)};
$('grab').addEventListener('click',()=>{$('gameclaw').style.left='50%';$('held').textContent=$('chosenEmoji').textContent;
setTimeout(()=>{$('held').classList.add('on');$('chosenEmoji').style.opacity='0'},1250);
setTimeout(()=>{$('playstatus').textContent=`찰칵! ${chosen} 상품을 집었어요. 모의 체험이며 실제 당첨 여부와는 무관합니다.`},1400)});
addEventListener('keydown',e=>{if(stage!==3||played)return;if(e.key==='ArrowLeft'){move(-12);e.preventDefault()}else if(e.key==='ArrowRight'){move(12);e.preventDefault()}});
})();
