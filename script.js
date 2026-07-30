const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
},{threshold:.12});
revealItems.forEach(el=>observer.observe(el));

const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuButton?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');document.body.style.overflow=''}));

const dot=document.querySelector('.cursor-dot');
const ring=document.querySelector('.cursor-ring');
let rx=0,ry=0,mx=0,my=0;
window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(dot)dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});
(function animateCursor(){if(!ring||matchMedia('(hover:none)').matches)return;rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(animateCursor)})();
if(ring&&!matchMedia('(hover:none)').matches)document.querySelectorAll('a,button,.project-card').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('active'));el.addEventListener('mouseleave',()=>ring.classList.remove('active'))});

const showcaseItems=[...document.querySelectorAll('.showcase-item')];
const showcaseStage=document.querySelector('.showcase-stage');
const showcaseDots=[...document.querySelectorAll('.showcase-dots button')];
const projectData=[
  {category:'01 / Direct Response',title:'Storytelling com retenção progressiva',description:'Montagem estruturada para conduzir a atenção entre depoimento e contexto visual, com legendas de alto contraste, ritmo crescente e cortes voltados para retenção.'},
  {category:'02 / Social Creative',title:'Composição dinâmica para mobile',description:'Criativo vertical com enquadramento pensado para feed, uso de elementos inesperados e construção visual que interrompe o padrão de rolagem nos primeiros segundos.'},
  {category:'03 / Visual Storytelling',title:'Estética orgânica com linguagem UGC',description:'Edição que combina textura documental, imagens em preto e branco e tipografia central para criar proximidade, autenticidade e rápida compreensão da mensagem.'},
  {category:'04 / Performance Ad',title:'Direção de arte orientada ao hook',description:'Tratamento visual marcante, recortes rápidos e presença de personagem para sustentar o argumento, criando uma abertura reconhecível e adaptada ao consumo vertical.'}
];
let soundEnabled=false;
let activeProject=1;
function setActiveProject(index,scroll=true){
  activeProject=(index+showcaseItems.length)%showcaseItems.length;
  showcaseItems.forEach((item,i)=>{
    item.classList.toggle('active',i===activeProject);
    item.classList.toggle('near',Math.abs(i-activeProject)===1);
    const video=item.querySelector('video');
    if(i===activeProject){ video.muted=!soundEnabled; video.play().catch(()=>{ video.muted=true; }); } else {video.pause();video.muted=true;video.currentTime=0;}
  });
  showcaseDots.forEach((dot,i)=>dot.classList.toggle('active',i===activeProject));
  document.getElementById('showcaseCategory').textContent=projectData[activeProject].category;
  document.getElementById('showcaseTitle').textContent=projectData[activeProject].title;
  document.getElementById('showcaseDescription').textContent=projectData[activeProject].description;
  if(scroll && window.innerWidth<=620) showcaseItems[activeProject].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
}
showcaseItems.forEach((item,i)=>item.addEventListener('click',()=>setActiveProject(i)));
showcaseDots.forEach((dot,i)=>dot.addEventListener('click',()=>setActiveProject(i)));
document.querySelector('.showcase-prev').addEventListener('click',()=>setActiveProject(activeProject-1));
document.querySelector('.showcase-next').addEventListener('click',()=>setActiveProject(activeProject+1));
let scrollTimer;
showcaseStage.addEventListener('scroll',()=>{if(window.innerWidth>620)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const center=showcaseStage.getBoundingClientRect().left+showcaseStage.clientWidth/2;let best=0,dist=Infinity;showcaseItems.forEach((item,i)=>{const r=item.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-center);if(d<dist){dist=d;best=i}});setActiveProject(best,false)},100)});
setActiveProject(activeProject,false);

const modal=document.querySelector('.video-modal');
const modalVideo=modal.querySelector('video');
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modalVideo.pause();modalVideo.removeAttribute('src')};
showcaseItems.forEach(item=>item.addEventListener('dblclick',()=>{
  const src=item.querySelector('source').src;modalVideo.src=src;modalVideo.muted=!soundEnabled;modal.classList.add('open');modal.setAttribute('aria-hidden','false');modalVideo.play().catch(()=>{});
}));
modal.querySelector('.modal-close').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(innerWidth>780){const g1=document.querySelector('.glow-one'),g2=document.querySelector('.glow-two');if(g1)g1.style.transform=`translate3d(0,${y*.08}px,0)`;if(g2)g2.style.transform=`translate3d(0,${y*.045}px,0)`;}
});


// Premium interaction pass
window.addEventListener('load',()=>{
  window.setTimeout(()=>document.querySelector('.page-loader')?.classList.add('done'),1050);
});
const header=document.querySelector('.site-header');
const ambient=document.querySelector('.ambient-light');
let ambientX=innerWidth*.5,ambientY=innerHeight*.5,targetX=ambientX,targetY=ambientY;
window.addEventListener('pointermove',e=>{
  targetX=e.clientX;targetY=e.clientY;
  document.documentElement.style.setProperty('--pointer-x',`${e.clientX}px`);
  document.documentElement.style.setProperty('--pointer-y',`${e.clientY}px`);
});
(function moveAmbient(){
  ambientX+=(targetX-ambientX)*.075;ambientY+=(targetY-ambientY)*.075;
  if(ambient) ambient.style.transform=`translate(${ambientX}px,${ambientY}px) translate(-50%,-50%)`;
  requestAnimationFrame(moveAmbient);
})();
const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>36);
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

document.querySelectorAll('.credential-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',`${e.clientX-r.left}px`);
    card.style.setProperty('--my',`${e.clientY-r.top}px`);
  });
});

// Add subtle 3D depth to active video
showcaseItems.forEach(item=>{
  item.addEventListener('pointermove',e=>{
    if(!item.classList.contains('active')) return;
    const r=item.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    item.querySelector('.phone-video').style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`;
  });
  item.addEventListener('pointerleave',()=>item.querySelector('.phone-video').style.transform='');
});

const oldSetActiveProject=setActiveProject;
setActiveProject=function(index,scroll=true){
  const copy=document.querySelector('.showcase-copy');
  copy?.classList.add('changing');
  window.setTimeout(()=>{oldSetActiveProject(index,scroll);copy?.classList.remove('changing')},150);
};


// Audio control: browser-safe, user initiated and limited to the active project.
const soundToggle=document.querySelector('.sound-toggle');
const soundLabel=soundToggle?.querySelector('.sound-label');
function syncProjectAudio(){
  showcaseItems.forEach((item,i)=>{
    const video=item.querySelector('video');
    video.muted=!(soundEnabled && i===activeProject);
    video.volume=.82;
  });
  if(modal?.classList.contains('open')){modalVideo.muted=!soundEnabled;modalVideo.volume=.82;}
  soundToggle?.setAttribute('aria-pressed',String(soundEnabled));
  soundToggle?.setAttribute('aria-label',soundEnabled?'Desativar som dos projetos':'Ativar som dos projetos');
  if(soundLabel)soundLabel.textContent=soundEnabled?'Som ativado':'Ativar som';
}
soundToggle?.addEventListener('click',()=>{
  soundEnabled=!soundEnabled;
  syncProjectAudio();
  const activeVideo=showcaseItems[activeProject]?.querySelector('video');
  if(soundEnabled) activeVideo?.play().catch(()=>{soundEnabled=false;syncProjectAudio()});
});
showcaseItems.forEach(item=>item.querySelector('video')?.addEventListener('volumechange',()=>{
  if(item.querySelector('video').muted && soundEnabled && item.classList.contains('active')){
    soundEnabled=false;syncProjectAudio();
  }
}));

// Lightweight depth particles. Fewer particles are used on mobile to preserve smoothness.
const depthCanvas=document.querySelector('.depth-canvas');
const depthCtx=depthCanvas?.getContext('2d');
let depthParticles=[];let depthW=0,depthH=0,depthDpr=1;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resizeDepth(){
  if(!depthCanvas||!depthCtx)return;
  depthDpr=Math.min(devicePixelRatio||1,1.6);depthW=innerWidth;depthH=innerHeight;
  depthCanvas.width=Math.round(depthW*depthDpr);depthCanvas.height=Math.round(depthH*depthDpr);
  depthCanvas.style.width=depthW+'px';depthCanvas.style.height=depthH+'px';
  depthCtx.setTransform(depthDpr,0,0,depthDpr,0,0);
  const count=innerWidth<780?26:62;
  depthParticles=Array.from({length:count},()=>({x:Math.random()*depthW,y:Math.random()*depthH,z:.25+Math.random()*.9,r:.35+Math.random()*1.35,vx:(Math.random()-.5)*.12,vy:-.05-Math.random()*.18,a:.12+Math.random()*.4}));
}
function drawDepth(){
  if(!depthCtx||reduceMotion)return;
  depthCtx.clearRect(0,0,depthW,depthH);
  const px=(targetX/depthW-.5)*22,py=(targetY/depthH-.5)*15;
  for(const p of depthParticles){
    p.x+=p.vx*p.z;p.y+=p.vy*p.z;
    if(p.y<-8){p.y=depthH+8;p.x=Math.random()*depthW}
    if(p.x<-8)p.x=depthW+8;if(p.x>depthW+8)p.x=-8;
    const x=p.x+px*p.z,y=p.y+py*p.z;
    const glow=depthCtx.createRadialGradient(x,y,0,x,y,p.r*7);
    glow.addColorStop(0,`rgba(255,145,92,${p.a})`);glow.addColorStop(.22,`rgba(255,70,25,${p.a*.55})`);glow.addColorStop(1,'rgba(255,40,12,0)');
    depthCtx.fillStyle=glow;depthCtx.beginPath();depthCtx.arc(x,y,p.r*7,0,Math.PI*2);depthCtx.fill();
  }
  requestAnimationFrame(drawDepth);
}
resizeDepth();addEventListener('resize',resizeDepth,{passive:true});if(!reduceMotion)drawDepth();

// Parallax the background layers without affecting content layout.
const depthOrbs=[...document.querySelectorAll('.depth-orb')];
window.addEventListener('pointermove',e=>{
  if(innerWidth<780)return;
  const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
  depthOrbs.forEach((orb,i)=>orb.style.translate=`${nx*(i+1)*-14}px ${ny*(i+1)*-10}px`);
},{passive:true});
