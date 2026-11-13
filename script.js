const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const reasons = [
"Your smile deserves its own fan club.","You have a heart that deserves the world.","You make ordinary moments memorable.","Your determination is something to admire.","You have your own special kind of charm.","Your silly side is one of my favourites.","You deserve every good thing coming your way.","You make people feel special.","Your little habits are unforgettable.","You are capable of achieving incredible things.","Your laugh is contagious.","You have so much potential.","You make even simple conversations interesting.","You deserve to be celebrated loudly.","Your dreams are worth chasing.","You are stronger than you sometimes realise.","You have a personality nobody could replace.","You deserve endless happiness.","You make life more interesting.","You are growing into someone amazing.","The world is lucky to have you.","Simply because there is only one YOU!"
];
const reasonGrid = $("#reason-grid");
reasons.forEach((reason,i)=>{
  const card=document.createElement("button"); card.className="reason-card"; card.type="button";
  card.setAttribute("aria-label",`Reveal birthday compliment ${i+1}`);
  card.innerHTML=`<span class="reason-inner"><span class="reason-front">${String(i+1).padStart(2,"0")}<small>TAP TO REVEAL ♡</small></span><span class="reason-back">${reason}</span></span>`;
  card.addEventListener("click",()=>card.classList.toggle("flipped")); reasonGrid.append(card);
});

// Birthday countdown uses India Standard Time.
function updateCountdown(){
  const target=new Date("2026-11-14T00:00:00+05:30").getTime();
  const now=Date.now(), diff=target-now;
  if(diff<=0){$("#count-title").textContent="IT'S YOUR DAY, BIRTHDAY BOY!";["days","hours","minutes","seconds"].forEach(id=>$("#"+id).textContent="00");return;}
  const vals={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
  Object.entries(vals).forEach(([id,v])=>$("#"+id).textContent=String(v).padStart(2,"0"));
}
updateCountdown();setInterval(updateCountdown,1000);

// Profile photo and gallery uploads: local browser only, with editable captions.
function readImage(file,callback){if(!file||!file.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>callback(reader.result);reader.readAsDataURL(file);}
$("#profile-upload").addEventListener("change",e=>{readImage(e.target.files[0],src=>{const el=$("#profile-photo");el.style.backgroundImage=`url("${src}")`;el.innerHTML="";localStorage.setItem("birthday-profile-photo",src);});});
try{const saved=localStorage.getItem("birthday-profile-photo");if(saved){$("#profile-photo").style.backgroundImage=`url("${saved}")`;$("#profile-photo").innerHTML="";}}catch(e){}
const captions=["A face worth taking a million pictures of.","Main character moment.","One for the memories.","Certified birthday boy.","A little dose of happiness.","This smile, always.","Forever photogenic.","The birthday star.","A moment worth keeping.","Just being you.","Picture perfect.","My favourite human."];
const defaultPhotos = [
 {src:"6122938801069344894.jpg",caption:captions[0]},
 {src:"6181424818142954167.jpg",caption:captions[1]},
 {src:"6246567385989059491.jpg",caption:captions[2]},
 {src:"6246567385989059514.jpg",caption:captions[3]},
 {src:"6246567385989059525.jpg",caption:captions[4]},
 {src:"6318866146735627132.jpg",caption:captions[5]},
 {src:"6318866146735627133.jpg",caption:captions[6]},
 {src:"6318866146735627134.jpg",caption:captions[7]}
];
let photos=defaultPhotos;
try{
 const saved=JSON.parse(localStorage.getItem("birthday-gallery")||"null");
 if(Array.isArray(saved)&&saved.length){
  photos=defaultPhotos.map((item,i)=>({...item,caption:saved[i]?.caption||item.caption}));
 }
}catch(e){}
const gallery=$("#gallery-grid");
function saveGallery(){try{localStorage.setItem("birthday-gallery",JSON.stringify(photos));}catch(e){alert("Your browser storage is full. Try adding fewer or smaller photos.");}}
function renderGallery(){
 gallery.innerHTML="";
 if(!photos.length){gallery.innerHTML='<p class="empty-gallery">Your Polaroid wall is waiting for your favourite photos. Add some above ♡</p>';return;}
 photos.forEach((item,i)=>{
  const card=document.createElement("div");card.className="polaroid";card.style.setProperty("--tilt",((i%2?1:-1)*(i%3+1))+"deg");
  const img=document.createElement("img");img.src=item.src;img.alt="Birthday photo "+(i+1);
  const caption=document.createElement("p");caption.textContent=item.caption;
  const actions=document.createElement("div");actions.className="photo-actions";
  const edit=document.createElement("button");edit.textContent="Edit caption";edit.onclick=()=>{const next=prompt("Write a caption for this photo:",item.caption);if(next!==null&&next.trim()){photos[i].caption=next.trim();saveGallery();renderGallery();}};
  const remove=document.createElement("button");remove.textContent="Remove";remove.onclick=()=>{photos.splice(i,1);saveGallery();renderGallery();};
  actions.append(edit,remove);card.append(img,caption,actions);gallery.append(card);
 });
}
renderGallery();
$("#gallery-upload").addEventListener("change",e=>{
 const files=[...e.target.files].filter(f=>f.type.startsWith("image/")).slice(0,12-photos.length);
 if(!files.length)return;
 let remaining=files.length;
 files.forEach(file=>readImage(file,src=>{photos.push({src,caption:captions[(photos.length)%captions.length]});remaining--;if(!remaining){saveGallery();renderGallery();}}));
 e.target.value="";
});

// Envelope.
$("#open-letter").addEventListener("click",()=>{
 const env=$(".envelope");env.classList.toggle("open");
 const letter=$("#letter-paper");letter.hidden=!letter.hidden;
 $("#open-letter").querySelector(".script").textContent=letter.hidden?"Tap to unseal your note":"A little note, just for you ♡";
 if(!letter.hidden)setTimeout(()=>letter.scrollIntoView({behavior:"smooth",block:"center"}),250);
});

// Cake with 22 individual candles.
const candles=$("#candles");
for(let i=0;i<22;i++){const c=document.createElement("span");c.className="candle";const flame=document.createElement("i");flame.className="flame";c.append(flame);candles.append(c);}
function confetti(){
 const layer=$("#confetti");const colors=["#c98291","#f2c5cf","#e9d8c8","#fff8ef","#702f43"];
 for(let i=0;i<75;i++){const p=document.createElement("i");p.className="confetti-piece";p.style.left=Math.random()*100+"%";p.style.background=colors[i%colors.length];p.style.animationDelay=Math.random()*.9+"s";p.style.animationDuration=(2+Math.random()*2)+"s";p.style.transform=`rotate(${Math.random()*360}deg)`;layer.append(p);setTimeout(()=>p.remove(),4500);}
}
$("#blow-candles").addEventListener("click",()=>{
 if(candles.classList.contains("out")){candles.classList.remove("out");$("#wish-message").textContent="22 candles, one birthday boy, and a million wishes waiting to come true.";$("#blow-candles").textContent="BLOW OUT YOUR CANDLES ✨";}
 else{candles.classList.add("out");$("#wish-message").textContent="Your wish is on its way! May this year be your best chapter yet. ♡";$("#blow-candles").textContent="LIGHT THE CANDLES AGAIN";confetti();}
});

// Surprise gift.
function openGift(){const gift=$("#open-gift");gift.classList.add("open");$("#surprise-message").hidden=false;$("#gift-cta").textContent="A SURPRISE JUST FOR YOU ♡";confetti();}
$("#open-gift").addEventListener("click",openGift);$("#gift-cta").addEventListener("click",openGift);

// Music is provided through the official YouTube player embedded in the page.
// Mobile navigation and utility buttons.
$("#menu").addEventListener("click",()=>$("#nav").classList.toggle("show"));
$("#nav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#nav").classList.remove("show");});
const backTop=$("#back-top");
window.addEventListener("scroll",()=>{backTop.style.display=window.scrollY>500?"block":"none";});
backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
