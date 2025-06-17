### Guida Completa - Dashboard Scolastica EduTech

## Indice dei Contenuti c

1. [Introduzione](#introduzione)
2. [Requisiti Tecnici](#requisiti-tecnici)
3. [Accesso e Installazione](#accesso-e-installazione)
4. [Interfaccia Utente](#interfaccia-utente)
5. [Sezione Dashboard](#sezione-dashboard)
6. [Sezione Anno 1](#sezione-anno-1)
7. [Sezione Anno 2](#sezione-anno-2)
8. [Sezione Confronto](#sezione-confronto)
9. [Sezione Statistiche](#sezione-statistiche)
10. [Funzionalità Aggiuntive](#funzionalità-aggiuntive)
11. [Personalizzazione](#personalizzazione)
12. [Gestione dei Dati](#gestione-dei-dati)
13. [Risoluzione Problemi](#risoluzione-problemi)

## Introduzione

La Dashboard Scolastica EduTech è uno strumento avanzato progettato per studenti e docenti che desiderano monitorare, analizzare e ottimizzare il rendimento accademico. Questa piattaforma interattiva offre una visualizzazione completa dei dati relativi al percorso di studio, permettendo di identificare punti di forza, aree di miglioramento e tendenze nel tempo.

### Caratteristiche Principali

- **Visualizzazione Intuitiva**: Grafici e statistiche facili da interpretare
- **Analisi Comparative**: Confronto dettagliato tra diversi anni accademici
- **Monitoraggio del Progresso**: Tracciamento continuo dell'avanzamento negli studi
- **Statistiche Personalizzate**: Analisi approfondite basate sui dati individuali
- **Design Responsive**: Accessibilità da qualsiasi dispositivo
- **Interfaccia Moderna**: Esperienza utente fluida e piacevole

## Requisiti Tecnici

Per utilizzare la Dashboard Scolastica EduTech sono necessari:

- **Browser Web**: Chrome, Firefox, Safari o Edge (versioni aggiornate)
- **Connessione Internet**: Per il caricamento dei dati e l'aggiornamento delle statistiche
- **Risoluzione Schermo**: Minimo 1280x720 per un'esperienza ottimale
- **JavaScript**: Abilitato nel browser
- **Cookie**: Abilitati per il salvataggio delle preferenze

## Accesso e Installazione

### Accesso Online

1. Apri il browser e naviga all'indirizzo della Dashboard EduTech

### Installazione Locale

Per installare la dashboard sul tuo server locale:

1. Scarica i file dal repository ufficiale
2. Estrai i file in una cartella sul tuo server web
3. Configura il file `dati.json` con i tuoi dati personali
4. Apri il file `index.html` nel tuo browser

### Configurazione Iniziale

Al primo accesso, ti consigliamo di:

1. Verificare che i dati visualizzati siano corretti
2. Personalizzare le impostazioni di visualizzazione
3. Esplorare tutte le sezioni per familiarizzare con l'interfaccia

## Interfaccia Utente

L'interfaccia della Dashboard EduTech è stata progettata per essere intuitiva e facile da navigare.

### Layout Principale

L'interfaccia è composta da:

1. **Sidebar**: Menu di navigazione principale
2. **Header**: Barra superiore con strumenti di ricerca e selezione anno
3. **Area Contenuti**: Sezione principale dove vengono visualizzati grafici e dati
4. **Footer**: Informazioni sul copyright e versione

### Sidebar

La sidebar contiene i link per navigare tra le diverse sezioni:

- **Dashboard**: Icona grafico a linee
- **Anno 1**: Icona numero 1
- **Anno 2**: Icona numero 2
- **Confronto**: Icona frecce bidirezionali
- **Statistiche**: Icona grafico a torta

Puoi comprimere la sidebar cliccando sull'icona hamburger nell'header per avere più spazio per i contenuti.

### Header

L'header contiene:

- **Titolo della Pagina**: Mostra la sezione corrente
- **Barra di Ricerca**: Per cercare materie specifiche
- **Toggle Anno**: Pulsanti per passare rapidamente tra Anno 1 e Anno 2
- **Menu Mobile**: Icona hamburger per dispositivi mobili

## Sezione Dashboard

La sezione Dashboard è la pagina principale che offre una panoramica completa del tuo rendimento accademico.

### Statistiche Principali

Questa sezione mostra quattro card con informazioni chiave:

1. **Media Generale**

1. Valore numerico della media complessiva
1. Indicatore di tendenza (in aumento, in diminuzione o stabile)
1. Confronto con il periodo precedente

1. **Miglior Categoria**

1. Nome della categoria con la media più alta
1. Valore della media per questa categoria
1. Icona rappresentativa della categoria

1. **Completamento**

1. Percentuale di materie completate
1. Numero di materie completate rispetto al totale
1. Barra di progresso visiva

1. **Stato Anno**

1. Stato corrente dell'anno accademico
1. Indicatore di avanzamento
1. Giorni rimanenti alla fine del periodo

### Media Totale per Anno

Questa sezione presenta:

- **Media Generale Complessiva**: La media di tutti i voti di tutti gli anni
- **Media Anno 1**: La media specifica del primo anno
- **Media Anno 2**: La media specifica del secondo anno (se disponibile)

I valori sono presentati in formato numerico con due decimali e sono calcolati considerando solo le materie con voti disponibili.

### Grafici Principali

La dashboard include due grafici principali:

1. **Media per Categoria**

1. Grafico a barre che mostra la media per ogni categoria
1. Colori distintivi per ogni barra
1. Etichette chiare per ogni categoria

1. **Progresso Annuale**

1. Grafico a ciambella che mostra la percentuale di completamento
1. Sezione verde per le materie completate
1. Sezione grigia per le materie da completare
1. Percentuale di completamento al centro

## Sezione Anno 1

La sezione Anno 1 fornisce un'analisi dettagliata del primo anno accademico.

### Filtri per Categoria

Nella parte superiore della pagina trovi i pulsanti di filtro:

- Ogni pulsante rappresenta una categoria
- Cliccando su un pulsante puoi mostrare/nascondere la categoria corrispondente
- I pulsanti attivi sono evidenziati in blu
- Puoi attivare/disattivare più categorie contemporaneamente

### Medie per Categoria in Linea

Questa sezione mostra:

- Box colorati per ogni categoria
- Nome della categoria
- Media numerica della categoria
- Disposizione orizzontale per una facile comparazione

### Dettaglio Categorie

Per ogni categoria viene mostrata una scheda che include:

1. **Intestazione**

1. Nome della categoria
1. Bordo inferiore per separare dall'area contenuti

1. **Grafico a Torta**

1. Rappresentazione visiva delle materie e dei relativi voti
1. Colori diversi per ogni materia
1. Legenda con i nomi delle materie

1. **Elenco Materie**

1. Nome di ogni materia
1. Voto corrispondente (se disponibile)
1. Indicazione "N/A" per materie senza voto
1. Colorazione del voto in base al punteggio:

1. Verde: ≥ 80
1. Giallo: ≥ 70
1. Rosso: < 70

1. **Media Categoria**

1. Media numerica della categoria
1. Posizionata sotto l'elenco delle materie
1. Evidenziata con sfondo colorato

### Media Totale Anno 1

In fondo alla pagina è presente un box che mostra la media totale dell'Anno 1, calcolata considerando tutte le materie con voto disponibile.

## Sezione Anno 2

La sezione Anno 2 ha la stessa struttura della sezione Anno 1, ma si riferisce al secondo anno accademico.

### Nota sulla Disponibilità dei Dati

Se non sono disponibili dati per l'Anno 2, verrà mostrato un messaggio "Nessun dato disponibile per l'Anno 2" e alcune sezioni potrebbero essere nascoste.

## Sezione Confronto

La sezione Confronto permette di analizzare le differenze di rendimento tra l'Anno 1 e l'Anno 2.

### Grafico Radar

Il grafico radar mostra:

- Assi per ogni categoria di studio
- Linea blu per l'Anno 1
- Linea azzurra per l'Anno 2
- Area colorata per evidenziare le differenze
- Scala da 0 a 100 per i voti

Questo grafico permette di identificare rapidamente:

- Categorie in cui c'è stato un miglioramento
- Categorie in cui c'è stato un peggioramento
- Pattern generali di rendimento

### Statistiche di Confronto

Questa sezione include tre card informative:

1. **Miglioramento Generale**

1. Differenza numerica tra la media dell'Anno 2 e dell'Anno 1
1. Indicatore visivo (freccia su/giù) per mostrare la direzione del cambiamento
1. Colorazione verde per miglioramento, rossa per peggioramento

1. **Categoria Migliore**

1. Nome della categoria con la media più alta nell'Anno 2
1. Valore della media per questa categoria
1. Utile per identificare i punti di forza

1. **Materia Migliore**

1. Nome della materia con il voto più alto nell'Anno 2
1. Valore del voto per questa materia
1. Utile per riconoscere i successi specifici

### Grafico Medie Categorie per Anni

Questo grafico a barre mostra:

- Barre affiancate per Anno 1 e Anno 2 per ogni categoria
- Colori diversi per distinguere i due anni
- Scala da 0 a 100 per i voti
- Etichette chiare per ogni categoria

Permette di confrontare direttamente le performance nelle stesse categorie tra i due anni.

## Sezione Statistiche

La sezione Statistiche offre analisi dettagliate e approfondite sul rendimento complessivo.

### Distribuzione Voti

Questo grafico a barre mostra:

- Distribuzione dei voti per fasce (60-69, 70-79, 80-89, 90-100)
- Barre per Anno 1 e Anno 2 affiancate per ogni fascia
- Numero di materie per ogni fascia di voto
- Colori diversi per distinguere i due anni

Utile per comprendere la distribuzione generale dei voti e identificare pattern.

### Andamento Temporale

Questo grafico a linee mostra:

- Andamento delle medie per categoria nel tempo
- Linea per Anno 1 e linea per Anno 2
- Area colorata sotto le linee per evidenziare le differenze
- Etichette per ogni categoria sull'asse X

Permette di visualizzare l'evoluzione del rendimento nel tempo per ogni categoria.

### Tabella Riassuntiva

La tabella riassuntiva include:

- **Colonna Categoria**: Nome di ogni categoria
- **Colonna Media Anno 1**: Media per la categoria nell'Anno 1
- **Colonna Media Anno 2**: Media per la categoria nell'Anno 2
- **Colonna Variazione**: Differenza tra Anno 2 e Anno 1

- Valori positivi in verde (miglioramento)
- Valori negativi in rosso (peggioramento)

Questa tabella offre una visione strutturata e completa delle performance comparative.

## Funzionalità Aggiuntive

### Ricerca

La barra di ricerca nell'header permette di:

1. Cercare materie specifiche digitando il nome
2. Filtrare in tempo reale mentre si digita
3. Visualizzare solo le materie che corrispondono alla ricerca
4. Resettare la ricerca cancellando il testo

### Toggle Anno

I pulsanti di toggle nell'header permettono di:

1. Passare rapidamente tra Anno 1 e Anno 2
2. Visualizzare i dati specifici dell'anno selezionato
3. Aggiornare automaticamente tutti i grafici e le statistiche

### Responsive Design

La dashboard è completamente responsive e si adatta a diversi dispositivi:

- **Desktop**: Visualizzazione completa con sidebar espansa
- **Tablet**: Layout adattato con sidebar comprimibile
- **Smartphone**: Layout verticale con menu hamburger

- Sidebar nascosta per default
- Grafici ridimensionati per la visualizzazione mobile
- Scroll verticale ottimizzato

### Animazioni e Transizioni

La dashboard include diverse animazioni per migliorare l'esperienza utente:

- Transizioni fluide tra le sezioni
- Animazioni di caricamento per i grafici
- Effetti hover sulle card e i pulsanti
- Fade-in per gli elementi al caricamento della pagina

## Personalizzazione

### Tema Colori

La dashboard utilizza un tema di colori predefinito, ma è possibile personalizzarlo modificando le variabili CSS nel file `style.css`:

```css
:root {
  --primary-color: #4361ee;
  --secondary-color: #3a0ca3;
  --accent-color: #4cc9f0;
  /* altre variabili di colore */
}
```

### Layout

È possibile modificare alcuni aspetti del layout:

- Larghezza della sidebar: `--sidebar-width`
- Altezza dell'header: `--header-height`
- Raggio dei bordi: `--border-radius`
- Velocità delle transizioni: `--transition-speed`

### Visualizzazione Grafici

Per personalizzare i grafici, puoi modificare le opzioni nel file `script.js`:

- Tipi di grafico (barre, linee, torta, radar)
- Colori e stili
- Scale e assi
- Etichette e tooltip

## Gestione dei Dati

### Struttura dei Dati

I dati della dashboard sono memorizzati nel file `dati.json` con la seguente struttura:

```json
{
  "categorie anno 1": [
    {
      "nome": "NOME_CATEGORIA",
      "materie": [
        { "nome": "NOME_MATERIA", "voto": VALORE_NUMERICO },
        { "nome": "ALTRA_MATERIA", "voto": null }
      ]
    }
  ],
  "categorie anno 2": [
    // struttura simile all'anno 1
  ]
}
```

### Aggiornamento dei Dati

Per aggiornare i dati:

1. Apri il file `dati.json` con un editor di testo
2. Modifica i valori esistenti o aggiungi nuove categorie/materie
3. Salva il file
4. Ricarica la dashboard nel browser

### Aggiunta di un Nuovo Anno

Per aggiungere un terzo anno:

1. Aggiungi una nuova sezione "categorie anno 3" nel file `dati.json`
2. Modifica il file `index.html` per aggiungere la nuova sezione
3. Aggiorna il file `script.js` per gestire il nuovo anno

### Backup dei Dati

Si consiglia di:

1. Effettuare regolarmente backup del file `dati.json`
2. Conservare copie in luoghi diversi
3. Utilizzare un sistema di controllo versione come Git

## Risoluzione Problemi

### Problemi Comuni e Soluzioni

| Problema                 | Possibile Causa         | Soluzione                                       |
| ------------------------ | ----------------------- | ----------------------------------------------- |
| Grafici non visualizzati | JavaScript disabilitato | Abilitare JavaScript nel browser                |
| Dati non aggiornati      | Cache del browser       | Forzare il ricaricamento della pagina (Ctrl+F5) |
| Layout non responsive    | Zoom del browser        | Ripristinare lo zoom al 100%                    |
| Errori di caricamento    | File JSON malformato    | Verificare la sintassi del file dati.json       |
| Sidebar non visibile     | Schermo troppo piccolo  | Utilizzare il pulsante hamburger per aprirla    |

### Errori di Console

Se riscontri errori nella console del browser:

1. Apri gli strumenti di sviluppo (F12 o Ctrl+Shift+I)
2. Vai alla scheda "Console"
3. Verifica eventuali messaggi di errore
4. Cerca la soluzione corrispondente nella tabella sopra

### Ripristino delle Impostazioni

Per ripristinare la dashboard alle impostazioni predefinite:

1. Cancella la cache del browser
2. Ricarica la pagina
3. Se necessario, ripristina una versione precedente del file `dati.json`

## FAQ

### Domande Generali

**D: La dashboard funziona offline?**
R: Sì, una volta caricata completamente, la dashboard può funzionare offline. Tuttavia, alcune funzionalità potrebbero essere limitate.

**D: Posso utilizzare la dashboard su dispositivi mobili?**
R: Sì, la dashboard è completamente responsive e si adatta a schermi di diverse dimensioni.

**D: È possibile esportare i dati?**
R: Attualmente non è disponibile una funzione di esportazione integrata, ma è possibile salvare il file `dati.json` come backup.

### Domande sui Dati

**D: Come vengono calcolate le medie?**
R: Le medie sono calcolate considerando solo le materie con voti disponibili (non null). La formula è: somma dei voti diviso il numero di materie con voto.

**D: Cosa significa "N/A" accanto ad alcune materie?**
R: "N/A" (Not Available) indica che non è disponibile un voto per quella materia.

**D: Posso aggiungere più di due anni accademici?**
R: Sì, è possibile modificare il codice per supportare più anni, ma richiede competenze di programmazione.

### Domande Tecniche

**D: Quali tecnologie sono utilizzate per la dashboard?**
R: La dashboard utilizza HTML5, CSS3, JavaScript e Chart.js per i grafici.

**D: Posso integrare la dashboard con altri sistemi?**
R: La dashboard è progettata come applicazione standalone, ma può essere integrata in altri sistemi con le opportune modifiche.

**D: È possibile aggiungere nuove funzionalità?**
R: Sì, il codice è estensibile e può essere modificato per aggiungere nuove funzionalità.

## Conclusione

La Dashboard Scolastica EduTech è uno strumento potente per monitorare e analizzare il rendimento accademico. Seguendo questa guida, sarai in grado di sfruttare al massimo tutte le sue funzionalità e ottenere preziose informazioni sul tuo percorso di apprendimento.

Ti auguriamo un'ottima esperienza con la Dashboard EduTech!

---
