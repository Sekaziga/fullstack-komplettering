# Komplettering – Avancerad fullstackutveckling

Vad du ska göra för att uppfylla kraven för **Godkänt (G)**: bygga och driftsätta en fullstack-app (minst frontend + backend) med Docker och CI/CD. Du får använda **valfri molntjänst** (t.ex. Docker Hub + Render, Railway, Fly.io, Netlify, Vercel). Azure är inte krav.

**Utgångspunkt:** Du kan **klona detta projekt** och utgå från mappen **startkod** (minimal API + React-frontend). Vill du hellre **skapa ett eget projekt** eller **använda ett befintligt** du redan har går det lika bra – då gäller samma steg och krav nedan.

**Sitter du fast på ett steg?** I [uppgiftsdokumentet (Google Docs)](https://docs.google.com/document/d/1_NtPv6DK0t9qTHsP3yxNwMRPvawFJOco-kbUXuB5Q1w/edit?tab=t.jir9y9kfblgv#heading=h.eaqjobi3vv2) finns kursens uppgifter samlade med mer beskrivning och guider – använd det som stöd om du behöver mer hjälp att lösa något.

---

## Om du använder startkoden

Mappen **startkod** innehåller en minimal fullstack-app (API + frontend) att utgå från. Fokus ligger på DevOps-flödet – inte på applogik.

**Innehåll:** `api/` (Express, en route `GET /`), `frontend/` (Vite + React som anropar API), `.env.example`.

**Kör lokalt utan Docker** (två terminaler):

```bash
# Terminal 1 – API
cd startkod/api && npm install && npm start

# Terminal 2 – Frontend
cd startkod/frontend && npm install && npm run dev
```

Frontend: http://localhost:5173 · API: http://localhost:3000

**Det som inte ingår** – du ska lägga till själv: Docker (Dockerfile(s) och docker-compose), automatiserade tester, health check-endpoint.

---

## Steg 1: Docker och mikrotjänster

**Mål:** Appen ska köras lokalt med Docker Compose som minst två tjänster.

- Skapa en Dockerfile för backend (API). Bygg och kör den lokalt med `docker build` och `docker run` så att API:et svarar.
- Skapa en Dockerfile för frontend. Bygg och kör den så att frontend kan anropas i webbläsaren.
- Skapa en `docker-compose.yml` i projektets rot. Lägg till båda tjänsterna under `services`. Se till att frontend kan anropa backend (använd tjänstnamnet som host, t.ex. `http://api:3000`).
- Använd en `.env`-fil för känslig konfiguration (t.ex. databas-URL, port). Referera till variablerna i `docker-compose.yml` med `${VARIABELNAMN}`. Lägg inte `.env` i Git.
- Kör `docker-compose up` och verifiera att både frontend och backend fungerar lokalt.

---

## Steg 2: Automatiserade tester

**Mål:** Minst ett test för frontend och ett för backend som pipelinen kan köra.

- I backend: Lägg till ett enhetstest (t.ex. med Jest) som körs med `npm test`. Se till att `package.json` har scriptet `"test": "..."`.
- I frontend: Lägg till minst ett test (t.ex. för en komponent) som körs med `npm test`.
- Kör båda testerna lokalt och se till att de går igenom.

---

## Steg 3: CI/CD-pipeline

**Mål:** Automatisk build, test och deployment; deploy ska bara ske om alla tester godkänns.

- Skapa en workflow-fil (t.ex. `.github/workflows/ci.yml`) som triggas vid push till `main` (eller din huvudbranch).
- I pipelinen: Checka ut koden, installera beroenden för frontend och backend, kör `npm test` för båda. Lägg till steg som bygger projektet (t.ex. `npm run build` där det finns).
- Se till att deployment-steget **endast** körs om alla tidigare steg lyckas. Om ett test faller ska inget deployas.
- (Valfritt) Låt samma pipeline även köras vid Pull Request mot `main` så att man ser att allt är grönt innan merge.
- Pusha och kontrollera under Actions att pipelinen körs och att den blir röd om du medvetet får ett test att falla.

---

## Steg 4: Driftsättning i molnet

**Mål:** Appen ska vara tillgänglig via en publik URL.

- Välj en molntjänst för backend (t.ex. Render, Railway, Fly.io). Skapa ett konto och en tjänst som kan köra en Docker-container eller bygga från repo.
- Koppla ditt GitHub-repo till tjänsten så att den byggs och deployas vid push (eller använd din egen pipeline för att pusha image och trigga deploy). Sätt nödvändiga miljövariabler (databas-URL, port) i tjänstens inställningar.
- För frontend: använd valfri hosting (t.ex. Netlify, Vercel, samma leverantör) och koppla till samma repo eller till frontend-mappen. Konfigurera så att frontend anropar backend-URL:en (miljövariabel).
- Verifiera att den driftsatta appen fungerar: öppna frontend-URL:en och kontrollera att anrop till backend går igenom.

---

## Steg 5: Loggning och övervakning

**Mål:** Kunna felsöka med loggar.

- I backend: Lägg till tydliga loggutskrifter (t.ex. vid start, vid fel). Använd `process.env.PORT` (och vid behov `0.0.0.0`) så att appen lyssnar korrekt i molnet.
- (Valfritt) Lägg till en enkel hälsokontroll-endpoint, t.ex. `GET /health`, som returnerar 200.
- Beskriv i README hur du använder hostingens loggvisning (eller loggar från pipelinen) för att felsöka om något går fel.

---

## Steg 6: Prestanda

**Mål:** Visa minst en enkel prestandaåtgärd.

- Jag har lagt till caching av `node_modules` i GitHub Actions-workflowen med `actions/cache` för både backend och frontend. Detta gör att installationen av beroenden går snabbare vid varje build.

- Du kan även välja att implementera någon av de andra alternativen: **Caching i appen** (t.ex. HTTP cache-header på en endpoint, eller enkel in-memory/Redis-cache), **färre renderingar i frontend** (t.ex. `React.memo` eller lazy loading).

---

## Steg 7: AI-verktyg i pipelinen

**Mål:** Ett automatiserat verktyg för kodgranskning eller säkerhet i pipelinen.

- Jag har lagt till **CodeQL** (GitHub Actions) i CI-workflowen. CodeQL analyserar koden automatiskt vid varje push och pull request för att hitta sårbarheter och säkerhetsproblem.

---

## Steg 8: Automatiserad API-dokumentation


**Mål:** API-dokumentation genereras och publiceras via pipelinen.

- Jag har lagt till automatiserad OpenAPI/Swagger-dokumentation i backend med swagger-jsdoc och swagger-ui-express. Dokumentationen finns på `/api-docs` och exporteras som `openapi.json`.
- Pipelinen genererar automatiskt `openapi.json` och laddar upp den som artefakt vid varje build, så dokumentationen är alltid uppdaterad.

---

## Steg 9: README och reflektion

**README:** Uppdatera README med hur man kör projektet lokalt (`docker-compose up`), vilka tjänster som finns, vilka URL:er som gäller för driftsatt app, och kort beskrivning av pipelinen (triggers, steg, var deploy sker).

**Reflektion (1–2 sidor):** Besvara kort dessa punkter med egna ord:

1. Varför använder du Docker och docker-compose till denna app? Vad vinner du på att ha två tjänster (t.ex. frontend + API) istället för en?
2. Vad händer i din CI/CD-pipeline när du pushar kod? Varför ska deploy bara ske om testerna är gröna?
3. Hur har du använt loggning eller övervakning för att felsöka (eller hur skulle du göra det)?
4. Vilken prestandaåtgärd valde du (caching, färre renderingar eller workflow-cache) och varför just den?
5. Vilket AI- eller säkerhetsverktyg har du i pipelinen och vad gör det? Någon nackdel eller begränsning du märkt?
6. Varför är det bra att API-dokumentationen genereras och publiceras automatiskt i pipelinen istället för att skriva den för hand?

---

## Inlämning

- **Repo:** Länk till GitHub-repo med README, Dockerfile(s), `docker-compose.yml`, pipeline-filer och kod. Inga lösenord eller API-nycklar i koden – använd secrets/miljövariabler.
- **Reflektion:** Lämna in enligt vad utbildaren anger (t.ex. fil i repo eller i lärplattformen).

---

## 🪵 How to View Logs & Debug

### Backend Logs (Render)
1. Go to [render.com](https://render.com) and log in
2. Click on your service **fullstack-komplettering**
3. Click **"Logs"** in the left sidebar
4. You will see all `console.log()` outputs in real time

Common things to look for:
- `API lyssnar på 0.0.0.0:10000` → server started correctly ✅
- Red error messages → copy and Google the error

### Frontend Logs (Vercel)
1. Go to [vercel.com](https://vercel.com) and log in
2. Click your project **fullstack-komplettering**
3. Click **"Deployments"** tab
4. Click the latest deployment → **"Build Logs"**

### Browser DevTools (fastest way to debug)
1. Open your Vercel URL in Chrome
2. Press `Cmd + Option + I` (Mac) or `F12` (Windows)
3. **Console tab** → shows frontend errors
4. **Network tab** → shows if API calls are failing

### Common Issues & Fixes

| Problem | Where to look | Fix |
|---|---|---|
| App not loading | Render logs | Check PORT environment variable |
| API not responding | Render logs | Look for red error messages |
| Frontend blank page | Vercel build logs | Check build command and output directory |
| CORS error | Browser Console | Add Vercel URL to CORS in backend |