# OAZĖ

Statinė lietuviška bendruomenės svetainė: HTML, CSS ir JavaScript ES moduliai. Jokių priklausomybių ar kompiliavimo.

## Paleidimas

Paleiskite vietinį HTTP serverį projekto aplanke, pavyzdžiui, `python -m http.server 8080`, ir atverkite `http://localhost:8080`. ES moduliams reikalingas HTTP serveris; neatverkite per `file://`.

## Hostinger

Įkelkite `index.html`, `css/`, `js/` ir `assets/` į domeno `public_html` aplanką. Išsaugokite aplankų struktūrą. Nereikia Node.js ar serverio kodo.

## Konfigūracija

`js/api.js` faile nustatykite `config.discordInviteUrl` į tikrą HTTPS Discord kvietimą. Kol reikšmė tuščia, mygtukai atveria informacinį langą.

Svetainė naudoja viešą API `http://95.81.82.16:10040/api/public/guilds/556379659994923009`. Endpointai: `/stats`, `/staff`, `/leaderboard?period=today|yesterday|week`, `/activity`, `/relics`. `js/api.js` pritaiko API atsakymus kortelėms, reitingams ir paskutinių 7 dienų diagramai. Serverio simbolis, viršelis, aprašymas ir kvietimas gaunami iš `/stats`; narių avatarai ir relikvijų paveikslai – iš atitinkamų endpointų. Demonstracijai nustatykite `useMock: true` ir redaguokite `js/mock-data.js`.

API turi leisti tikrą svetainės kilmę per CORS (`Access-Control-Allow-Origin`). HTTPS svetainėje reikalingas HTTPS API adresas arba serverio tarpininkas, nes naršyklės blokuoja HTTP užklausas iš HTTPS puslapio. Botų žetonus ir paslaptis laikykite tik serveryje.

Relikvijų paveikslus keiskite `assets/relics/` aplanke, o jų kelius — `mock-data.js`. Vietiniai SVG yra originalūs dekoratyviniai pakaitalai. Avatarai taip pat iliustraciniai. Visas matomas turinys yra lietuvių kalba. Prieš paskelbiant pakeiskite socialinio peržiūros paveikslo `og:image` reikšmę į absoliutų jūsų domeno PNG/JPG adresą (SVG palaikymas priklauso nuo platformos).

Svetainėje yra API krovimo, klaidos ir tuščios būsenos, klaviatūra valdomi dialogai, mobili navigacija ir sumažinto judesio palaikymas.
