export const stats = [
  {label:'Oazės gyventojai',value:2486,icon:'♧'}, {label:'Dabar prisijungę',value:342,icon:'◉'},
  {label:'Serverio pastiprinimai',value:28,icon:'ϟ'}, {label:'Žinutės šiandien',value:1847,icon:'▤'}, {label:'Žinutės šią savaitę',value:12963,icon:'⌁'}
];
export const staff = [
  {name:'Amunas',role:'Oazės įkūrėjas',description:'Vizija, subūrusi keliautojus po vienu dangumi.',avatar:'assets/images/avatar-1.svg'},
  {name:'Nefertitė',role:'Administratorė',description:'Šventyklos tvarka ir šiltas žodis kiekvienam.',avatar:'assets/images/avatar-2.svg'},
  {name:'Anubis',role:'Administratorius',description:'Oazės vartų ir bendruomenės ramybės sergėtojas.',avatar:'assets/images/avatar-3.svg'},
  {name:'Bastet',role:'Moderatorė',description:'Visada šalia, kai prireikia pagalbos ar patarimo.',avatar:'assets/images/avatar-4.svg'}
];
const names=['SmėlioVilkas','MėnulioDukra','Faraonas','KopųVėjas','SaulėsVaikas','NaktiesSakalas','Miražas','DykumųLapė','AuksinėAušra','TylusKeliautojas'];
export function topChatters(period){const offset=period==='yesterday'?3:period==='week'?1:0;return names.map((_,i)=>({name:names[(i+offset)%names.length],messages:Math.round((427-i*33)*(period==='week'?6.7:period==='yesterday'?.83:1)),avatar:`assets/images/avatar-${(i+offset)%4+1}.svg`}));}
const titles=['Dykumų kompasas','Oazės amuletas','Užmirštasis raktas','Oazės kristalas','Senovinis pergamentas','Smėlio laikrodis','Faraono urna','Prarastojo valdovo karūna','Amžinoji dykumos rožė','Oazės širdis'];
const descriptions=['Jis nerodo šiaurės. Jo auksinė rodyklė visada veda ten, kur keliautojas atras savo namus.','Turkio akmuo saugo šiltų pokalbių prisiminimus ir primena, kad niekas nekeliauja vienas.','Paslaptingas raktas, kurio duris dar turi atrasti. Sakoma, jos atsiveria tik smalsiems.','Kristalo gelmėse pulsuoja pirmojo oazės šaltinio šviesa.','Trapiame pergamente užrašytos istorijos tų, kurie keliavo prieš mus.','Kiekvienas smėlio grūdelis — kartu praleista akimirka. Kai kurios jų vertos amžinybės.','Senovinė urna saugo užmirštosios šventyklos paslaptis.','Karūna primena: tikroji valdovo galia slypi bendruomenės pasitikėjime.','Net ir atšiauriausioje dykumoje pražysta draugystė. Ši rožė niekada nenuvysta.','Rečiausia oazės relikvija. Jos šviesa gyva tol, kol čia skamba žmonių balsai.'];
export const relics=titles.map((name,i)=>({id:i+1,name,description:descriptions[i],image:`assets/relics/relic-${i+1}.svg`,rarity:i<3?'Paprastoji':i<6?'Retoji':i<8?'Epinė':'Mitinė'}));
export const activity={daily:[1230,1680,1430,2150,1810,2816,1847],days:['Pr','An','Tr','Kt','Pn','Št','Sk'],total:12963,trend:18,activeMembers:['SmėlioVilkas','MėnulioDukra','Faraonas'],milestones:[{date:'ŠIĄ SAVAITĘ',text:'Oazės istoriją jau kuria daugiau nei 2 400 keliautojų.'},{date:'ŠEŠTADIENĮ',text:'Bendras žaidimų vakaras subūrė 64 bendruomenės narius.'},{date:'ŠĮ MĖNESĮ',text:'Atverta nauja relikvijų kolekcija ir lobių skrynios.'}]};
