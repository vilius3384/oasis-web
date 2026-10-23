export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const number=value=>new Intl.NumberFormat('lt-LT').format(value);
export function safeImage(value){if(!value)return 'assets/icons/sun.svg';try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?escapeHTML(url.href):'assets/icons/sun.svg';}catch{return 'assets/icons/sun.svg';}}
export function renderServerDetails(data){
  if(!data)return;
  document.querySelectorAll('[data-server-name]').forEach(element=>element.textContent=data.name||'OAZĖ');
  if(data.description)document.querySelector('.hero-description').textContent=data.description;
  document.querySelectorAll('[data-server-icon]').forEach(element=>{
    element.innerHTML=`<img class="server-icon" src="${safeImage(data.icon_url||data.avatar_url)}" alt="${escapeHTML(data.name)} serverio simbolis" width="40" height="40">`;
    element.querySelector('img').addEventListener('error',()=>{element.textContent='☼';},{once:true});
  });
  if(data.banner_url||data.splash_url){
    const art=document.querySelector('.hero-art');
    art.innerHTML=`<img class="server-banner" src="${safeImage(data.banner_url||data.splash_url)}" alt="" fetchpriority="high">`;
    art.querySelector('img').addEventListener('error',event=>event.target.remove(),{once:true});
  }
  if(data.created_at){
    const year=new Date(data.created_at).getUTCFullYear();
    if(Number.isFinite(year))document.querySelector('.hero-coordinate').firstChild.textContent=`EST. ${year} `;
  }
  if(data.icon_url||data.avatar_url){const icon=document.querySelector('link[rel="icon"]');icon.href=data.icon_url||data.avatar_url;icon.removeAttribute('type');}
}
const avatar=person=>`<img class="avatar" src="${safeImage(person.avatar_url||person.avatar)}" alt="${escapeHTML(person.name)} avataras" loading="lazy" width="64" height="64">`;
const profileAvatar=(person,index)=>`<button type="button" class="profile-avatar" data-person="${index}" aria-label="Peržiūrėti ${escapeHTML(person.name)} profilį" aria-haspopup="dialog">${avatar(person)}</button>`;
const profileName=(person,index)=>`<button type="button" class="profile-name" data-person="${index}" aria-haspopup="dialog">${escapeHTML(person.name)}</button>`;
export function renderPersonDetail(person,{period,rank}={}){
  const periods={today:'Šiandien',yesterday:'Vakar',week:'Šią savaitę'};
  const roles=Array.isArray(person.roles)?person.roles.filter(role=>role.name?.replace(/[\s\u200b-\u200f]/g,'')):[];
  const profileUrl=/^\d+$/.test(person.id||'')?`https://discord.com/users/${person.id}`:null;
  return `<div class="person-detail">${avatar(person)}<p class="eyebrow">${period?'GARBĖS SALĖ':'VALDOVŲ TARYBA'}</p><h2>${escapeHTML(person.name)}</h2>${person.username?`<p class="profile-username">@${escapeHTML(person.username)}</p>`:''}${person.role?`<p class="staff-role">${escapeHTML(person.role)}</p>`:''}<p class="profile-description">${escapeHTML(person.description&&person.description!==`@${person.username}`?person.description:'Šio nario aprašymas nepateiktas.')}</p><dl class="profile-facts">${person.id?`<div><dt>Discord ID</dt><dd>${escapeHTML(person.id)}</dd></div>`:''}${period?`<div><dt>Laikotarpis</dt><dd>${escapeHTML(periods[period]||period)}</dd></div><div><dt>Vieta</dt><dd>#${number(rank)}</dd></div><div><dt>Žinutės</dt><dd>${number(person.messages)}</dd></div>`:''}${person.owner?'<div><dt>Serverio savininkas</dt><dd>Taip</dd></div>':''}${person.administrator?'<div><dt>Administratorius</dt><dd>Taip</dd></div>':''}</dl>${roles.length?`<h3 class="profile-roles-title">Serverio rolės</h3><ul class="profile-roles">${roles.map(role=>`<li>${role.icon_url?`<img src="${safeImage(role.icon_url)}" alt="" width="20" height="20" loading="lazy">`:''}${escapeHTML(role.name)}</li>`).join('')}</ul>`:''}${profileUrl?`<a class="button primary profile-link" href="${profileUrl}" target="_blank" rel="noopener noreferrer">Atverti Discord profilį ↗</a>`:''}</div>`;
}
export const renderStats=data=>data.map(item=>`<article class="stat"><span class="stat-icon" aria-hidden="true">${escapeHTML(item.icon)}</span><strong data-count="${Number(item.value)||0}">${number(item.value)}</strong><p>${escapeHTML(item.label)}</p></article>`).join('');
export const renderStaff=data=>data.map((person,i)=>`<article class="staff-card">${profileAvatar(person,i)}<h3>${profileName(person,i)}</h3><p class="staff-role">${escapeHTML(person.role)}</p><p>${escapeHTML(person.description)}</p></article>`).join('');
export function renderLeaderboard(data){return `<div class="podium">${data.slice(0,3).map((p,i)=>`<article><div class="rank-mark">◇ &nbsp; ${i+1} VIETA &nbsp; ◇</div>${profileAvatar(p,i)}<h3>${profileName(p,i)}</h3><p><b>${number(p.messages)}</b> žinutės</p><div class="progress"><span style="width:${Math.min(100,p.messages/Math.max(data[0].messages,1)*100)||0}%"></span></div></article>`).join('')}</div><div class="rank-list">${data.slice(3).map((p,i)=>`<div class="rank-row"><span class="rank-number">${String(i+4).padStart(2,'0')}</span>${profileAvatar(p,i+3)}<strong>${profileName(p,i+3)}</strong><span>${number(p.messages)} žin.</span></div>`).join('')}</div>`;}
export const renderRelics=data=>data.map((r,i)=>`<button class="relic" data-relic="${i}" aria-label="Atrasti: ${escapeHTML(r.name)}"><img src="${safeImage(r.image)}" alt="" loading="lazy" width="120" height="90"><small>${escapeHTML(r.rarity)}</small><span>${escapeHTML(r.name)}</span></button>`).join('');
export function renderActivity(data){
  const max=Math.max(...data.daily,1);
  const x=i=>data.daily.length===1?260:35+i*450/(data.daily.length-1);
  const points=data.daily.map((v,i)=>`${x(i)},${170-v/max*140}`);
  const trend=data.trend==null?'Nėra ankstesnio laikotarpio palyginimo':`${data.trend>0?'↑':data.trend<0?'↓':'→'} ${number(Math.abs(data.trend))} % nuo praėjusių 7 dienų`;
  return `<div class="chart-panel"><div class="chart-top"><div><h3>Pokalbiai, virtę istorijomis</h3><p>Žinučių aktyvumas per paskutines ${data.daily.length} d.</p></div><div><strong>${number(data.total)}</strong><p>${trend}</p></div></div><svg class="chart" viewBox="0 0 520 210" role="img" aria-label="Žinutės per savaitę: ${data.daily.map((v,i)=>`${escapeHTML(data.days[i])} ${number(v)}`).join(', ')}"><defs><linearGradient id="chart-fill" x2="0" y2="1"><stop stop-color="#38d8e8" stop-opacity=".22"/><stop offset="1" stop-color="#38d8e8" stop-opacity="0"/></linearGradient></defs>${[40,85,130,175].map(y=>`<path d="M25 ${y}H500" stroke="#d4af6718" stroke-dasharray="3 6"/>`).join('')}<path d="M${x(0)} 175 L${points.join(' L')} L${x(data.daily.length-1)} 175Z" fill="url(#chart-fill)"/><polyline points="${points.join(' ')}" fill="none" stroke="#63bdb8" stroke-width="2"/>${points.map((p,i)=>`<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3" fill="#d4af67"/><text x="${x(i)}" y="201" text-anchor="middle">${escapeHTML(data.days[i])}</text>`).join('')}</svg>${data.activeMembers.length?`<p>Aktyviausi: ${data.activeMembers.map(escapeHTML).join(' · ')}</p>`:''}</div><div class="milestones"><h3>Smėlyje likę pėdsakai</h3>${data.milestones.map(m=>`<p class="milestone"><b>${escapeHTML(m.date)}</b>${escapeHTML(m.text)}</p>`).join('')}</div>`;
}
