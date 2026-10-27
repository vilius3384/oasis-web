import * as mock from './mock-data.js';
// Public guild API. Never put bot tokens here.
export const config={useMock:false,apiBaseUrl:'https://darkseagreen-armadillo-213676.hostingersite.com/oasis-api.php',discordInviteUrl:''};
export async function getDiscordInvite() {
    if (config.discordInviteUrl) {
        return config.discordInviteUrl;
    }

    const data = await request('/invite', () => ({
        url: ''
    }));

    const invite = data?.url || data?.invite_url || data?.invite;

    if (typeof invite !== 'string') {
        throw new Error('Discord invite URL not found.');
    }

    const parsed = new URL(invite);

    if (
        parsed.protocol !== 'https:' ||
        !['discord.gg', 'discord.com'].includes(parsed.hostname)
    ) {
        throw new Error('Invalid Discord invite URL.');
    }

    return parsed.href;
}
async function request(path, fallback) {
    if (config.useMock) {
        return structuredClone(fallback());
    }

    const url = new URL(config.apiBaseUrl);

    const parsed = new URL(
        path.replace(/^\//, ''),
        'https://example.invalid/'
    );

    const endpoint = parsed.pathname.replace(/^\//, '');

    url.searchParams.set('endpoint', endpoint);

    for (const [key, value] of parsed.searchParams) {
        url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(12000),
        headers: {
            Accept: 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    return response.json();
}
let serverDetails;
export function getServerDetails(){
  if(!serverDetails)serverDetails=request('/stats',()=>null).catch(error=>{serverDetails=null;throw error;});
  return serverDetails;
}
const list=(data,key)=>Array.isArray(data)?data:(Array.isArray(data?.[key])?data[key]:[]);
const count=value=>Math.max(0,Number(value)||0);
const person=data=>({...data,name:data.name||data.username||'Oazės narys',avatar:data.avatar_url||data.avatar,messages:count(data.messages)});
export async function getServerStats(){
  if(config.useMock)return structuredClone(mock.stats);
  const data=await getServerDetails();
  return [
    {label:'Oazės gyventojai',value:data.members,icon:'♧'},
    {label:'Dabar prisijungę',value:data.online,icon:'◉'},
    {label:'Serverio stiprinimai',value:data.boosts,icon:'ϟ'},
    {label:'Balso kanaluose',value:data.voice,icon:'♫'},
    {label:'Bendruomenės botai',value:data.bots,icon:'◇'}
  ].filter(item=>item.value!=null).map(item=>({...item,value:count(item.value)}));
}
export async function getStaffMembers(){
  const data=await request('/staff',()=>mock.staff);
  return list(data,'staff').map(member=>({...person(member),role:member.role||(member.owner?'Savininkas':member.administrator?'Administratorius':member.roles?.find(role=>/moderator/i.test(role.name))?.name||'Komandos narys'),description:member.description||(member.username?`@${member.username}`:'')}));
}
export async function getTopChatters(period='today'){
  const data=await request(`/leaderboard?period=${encodeURIComponent(period)}`,()=>mock.topChatters(period));
  return list(data,'leaderboard').map(person);
}
// Inspect the complete weekly payload, including each day's leaderboard.
if(!config.useMock){
  request('/leaderboard?period=week',()=>null)
    .then(data=>console.log('Weekly leaderboard API response:',data))
    .catch(error=>console.error('Failed to fetch weekly leaderboard:',error));
}
export async function getServerActivity(){
  const data=await request('/activity',()=>mock.activity);
  if(config.useMock)return data;
  const entries=list(data,'activity').slice().sort((a,b)=>a.date.localeCompare(b.date));
  if(!entries.length)return null;
  const recent=entries.slice(-7),previous=entries.slice(-14,-7);
  const total=recent.reduce((sum,day)=>sum+count(day.messages),0);
  const prior=previous.reduce((sum,day)=>sum+count(day.messages),0);
  return {
    daily:recent.map(day=>count(day.messages)),
    days:recent.map(day=>new Intl.DateTimeFormat('lt-LT',{month:'2-digit',day:'2-digit',timeZone:'Europe/Vilnius'}).format(new Date(`${day.date}T12:00:00Z`))),
    total,trend:previous.length===7&&prior>0?Math.round((total-prior)/prior*100):null,
    activeMembers:[],
    milestones:recent.slice().reverse().map(day=>({date:day.date,text:`${count(day.messages)} žinutės · ${count(day.active_members)} aktyvūs nariai`}))
  };
}
export async function getRelics() {
    const data = await request('/relics', () => mock.relics);

    const imageBase = new URL('../assets/relics/', import.meta.url);

    const imageFiles = {
        compass: 'desert_compass.png',
        amulet: 'oasis_amulet.png',
        key: 'forgotten_key.png',
        crystal: 'oasis_crystal.png',
        scroll: 'ancient_scroll.png',
        sand: 'sand_clock.png',
        urn: 'pharaon_urn.png',
        crown: 'lost_crown.png',
        rose: 'desert_rose.png',
        heart: 'oasis_heart.png'
    };

    return list(data, 'relics').map(relic => {
        const imagePath = relic.image_url || relic.image || '';
        const relicId = imagePath.split('/').pop()?.split('?')[0];

        const filename = imageFiles[relicId];

        return {
            ...relic,
            image: filename
                ? new URL(filename, imageBase).href
                : ''
        };
    });
}
