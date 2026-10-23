import * as mock from './mock-data.js';
// Public guild API. Never put bot tokens here.
export const config={useMock:false,apiBaseUrl:'https://darkseagreen-armadillo-213676.hostingersite.com/oasis-api.php',discordInviteUrl:''};

async function request(path, fallback) {
    if (config.useMock) {
        return structuredClone(fallback());
    }

    const [endpoint, queryString = ""] =
        path.replace(/^\//, "").split("?");

    const url = new URL(config.apiBaseUrl);

    url.searchParams.set("endpoint", endpoint);

    const params = new URLSearchParams(queryString);

    for (const [key, value] of params) {
        url.searchParams.set(key, value);
    }

    const response = await fetch(url, {
        signal: AbortSignal.timeout(12000),
        headers: {
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`API error: HTTP ${response.status}`);
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
export async function getRelics(){
  const data=await request('/relics',()=>mock.relics);
  return list(data,'relics').map(relic=>({...relic,image:relic.image_url?new URL(relic.image_url,`${config.apiBaseUrl}/`).href:relic.image}));
}
