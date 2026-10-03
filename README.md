# Sito del Consiglio Giovanile Bellunese ODV

**🔗 Sito online (indirizzo provvisorio): https://consiglio-giovanile-bellunese.github.io/site/**

Indirizzo definitivo, quando il dominio sarà collegato: https://www.consigliogiovanilebl.org/

Sito statico in HTML, CSS e JavaScript. Non serve installare niente né lanciare una build: i file in questa cartella **sono** il sito.

## Struttura

```
index.html                ← Home
chi-siamo.html
eventi-progetti.html
carriera-360.html         ┐
tandem-linguistici.html   │
abc-imprenditoria.html    │ pagine dei progetti
cena-con-delitto.html     │
reti-di-valore.html       │
base-dolomiti.html        ┘
supportaci.html
documenti.html
unisciti.html
404.html                  ← pagina "non trovata" (GitHub Pages la usa da sola)
sitemap.xml, robots.txt   ← per i motori di ricerca
.nojekyll                 ← dice a GitHub Pages di pubblicare i file così come sono
assets/
  style.css               ← tutti gli stili (colori del brand in cima, in :root)
  main.js                 ← menu mobile, carosello, galleria, copia IBAN, animazioni
  fonts/                  ← Montserrat (titoli) e Open Sans (testi)
  img/                    ← logo, favicon, foto
  docs/                   ← statuto e atto costitutivo (PDF)
```

## Vedere il sito sul computer

Doppio click su `index.html`. Funziona tutto. L'unica differenza: aprendo il file con il doppio click, Chrome non carica i font salvati nel sito (è una regola di sicurezza per i file locali), quindi vedrai un carattere simile. Online i font sono quelli giusti.

## Modificare i contenuti

- **Testi**: apri la pagina `.html` con un editor qualsiasi (consigliato [VS Code](https://code.visualstudio.com/)), cerca il testo e modificalo.
- **Menu e footer** sono ripetuti in ogni pagina: se cambi una voce, usa "Trova e sostituisci in tutti i file" (in VS Code: `Ctrl+Shift+H`).
- **Colori**: in cima a `assets/style.css`, nel blocco `:root`.
- **Foto**: metti il file in `assets/img/` (formato `.webp`, circa 1600 px di larghezza) e aggiorna `src` e `alt` nell'HTML.
- **Nuovo progetto**: duplica la pagina di un progetto (es. `cena-con-delitto.html`), cambia i testi, poi aggiungi la sua scheda in `index.html` ed `eventi-progetti.html` (cerca `project-card`) e il suo indirizzo in `sitemap.xml`.

Tutti i collegamenti sono **relativi** (`chi-siamo.html`, `assets/style.css`): non aggiungere una `/` all'inizio, altrimenti su GitHub Pages i collegamenti si rompono.

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub (es. `sito-cgb`) e carica **il contenuto di questa cartella** nella radice del repository.
2. Nel repository: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch `main`, cartella `/ (root)`, **Save**.
3. Dopo un minuto il sito è online su `https://<nome-utente>.github.io/<nome-repository>/`.

## Collegare il dominio www.consigliogiovanilebl.org

Da fare solo quando avete accesso al pannello del dominio.

1. Nel pannello DNS del dominio aggiungi:
   - un record **CNAME**: nome `www` → valore `<nome-utente>.github.io`
   - quattro record **A** per il dominio senza `www` (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. Su GitHub: **Settings → Pages → Custom domain**, scrivi `www.consigliogiovanilebl.org` e salva (GitHub crea da solo il file `CNAME` nel repository).
3. Quando il controllo DNS è verde, spunta **Enforce HTTPS**.

Indirizzi canonici, sitemap e anteprime per i social usano già `https://www.consigliogiovanilebl.org/`.
