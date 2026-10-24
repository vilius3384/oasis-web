import {config,getServerDetails,getServerStats,getStaffMembers,getTopChatters,getServerActivity,getRelics} from './api.js';
import {renderPersonDetail,renderServerDetails,renderStats,renderStaff,renderLeaderboard,renderRelics,renderActivity,escapeHTML,safeImage} from './components.js';
import {initializeAnimations,observeCounters,animateText,initializeCardTilt} from './animations.js';
const dialog=document.querySelector('#detail');
function openDetail(html,label="Oazės informacija",staffDetail=false){dialog.classList.toggle("staff-detail",staffDetail);dialog.setAttribute("aria-label",label);const content=document.querySelector('#detail-content');content.innerHTML=html;content.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.src='assets/icons/sun.svg';},{once:true}));dialog.showModal();}
function bindProfiles(data,root,period){
  root.querySelectorAll('[data-person]').forEach(button=>button.addEventListener('click',()=>{
    const index=Number(button.dataset.person),person=data[index];
    if(person)openDetail(renderPersonDetail(person,{period,rank:person.rank||index+1}),person.name,root.id==='staff');
  }));
}
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
document.querySelectorAll('[data-join]').forEach(button=>button.addEventListener('click',()=>{let url;try{url=new URL(config.getDiscordInvite);}catch{}if(url?.protocol==='https:'){window.open(url.href,'_blank','noopener,noreferrer');return;}openDetail('<p class="eyebrow">OAZĖS VARTAI</p><h2>Kelionė netrukus prasidės.</h2><p>Kvietimo nuoroda dar ruošiama. Sugrįžk vėliau — tavo vieta prie oazės laukia.</p><p class="dialog-note">Demonstracinė svetainė · kvietimas nesukonfigūruotas</p>');}));
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('nav');function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Atverti meniu');}menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Uždaryti meniu':'Atverti meniu');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
addEventListener('scroll',()=>document.querySelector('.header').classList.toggle('scrolled',scrollY>80),{passive:true});
document.querySelector('#year').textContent=new Date().getFullYear();
if(!config.useMock)document.querySelectorAll('.demo-label').forEach(el=>el.textContent='◇ Bendruomenės duomenys');
async function populate(id,fetcher,renderer,after){const root=document.getElementById(id);root.setAttribute('aria-busy','true');root.innerHTML='<p class="state">Skaitomi šventyklos įrašai…</p>';try{const data=await fetcher();if(data==null||(Array.isArray(data)&&!data.length)){root.innerHTML='<p class="state">Šie metraščiai dar neužrašyti. Sugrįžk vėliau.</p>';return;}root.innerHTML=renderer(data);root.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.src='assets/icons/sun.svg';},{once:true}));after?.(data,root);}catch{root.innerHTML='<p class="state">Šiuo metu įrašų pasiekti nepavyko. <button type="button">Bandyti dar kartą</button></p>';root.querySelector('button').addEventListener('click',()=>populate(id,fetcher,renderer,after));}finally{root.setAttribute('aria-busy','false');}}
let leaderboardRequest=0;async function loadLeaderboard(period){const version=++leaderboardRequest;document.querySelectorAll('[data-period]').forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed',String(b.dataset.period===period));});await populate('leaderboard',async()=>{const data=await getTopChatters(period);if(version!==leaderboardRequest)throw new Error('Pasenę duomenys');return data;},renderLeaderboard,(data,root)=>{bindProfiles(data,root,period);initializeCardTilt(root);});document.querySelectorAll('[data-period]').forEach(b=>b.disabled=false);}
document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>loadLeaderboard(b.dataset.period)));
initializeAnimations();
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main section[id]').forEach(s=>sectionObserver.observe(s));
await Promise.allSettled([
getServerDetails().then(data=>{renderServerDetails(data);animateText();if(data?.invite_url)config.discordInviteUrl=data.invite_url;}).catch(()=>{}),
populate('stats',getServerStats,renderStats,(_,root)=>observeCounters(root)),
populate('staff',getStaffMembers,renderStaff,(data,root)=>{bindProfiles(data,root);initializeCardTilt(root);}),loadLeaderboard('today'),
populate('relics',getRelics,renderRelics,(data,root)=>root.querySelectorAll('[data-relic]').forEach(button=>button.addEventListener('click',()=>{const relic=data[Number(button.dataset.relic)];openDetail(`<img src="${safeImage(relic.image)}" alt="${escapeHTML(relic.name)}"><p class="eyebrow">${escapeHTML(relic.rarity)} RELIKVIJA</p><h2>${escapeHTML(relic.name)}</h2><p>${escapeHTML(relic.description)}</p><p class="dialog-note">${config.useMock?'Demonstracinė relikvijų kolekcija':'Oazės relikvijų kolekcija'}</p>`);}))),
populate('activity',getServerActivity,renderActivity)
]);
