document.addEventListener("DOMContentLoaded", () => {
  // Mostra il loading overlay
  const loadingOverlay = document.getElementById("loading-overlay");

  // Simuliamo un caricamento per mostrare l'animazione
  setTimeout(() => {
    initApp();
    // Nascondi il loading overlay con animazione
    loadingOverlay.classList.add("hidden-loader");
  }, 1500);
});

function initApp() {
  // Gestione della sidebar
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mainContent = document.querySelector('.main-content');

  // Migliora la navigazione mobile con hamburger menu
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('mobile-visible');
    mainContent.classList.toggle('expanded');
  });

  // Aggiungi un pulsante hamburger anche nell'header per mobile
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';

  const headerLeft = document.querySelector('.header-left');
  headerLeft.insertBefore(mobileMenuBtn, headerLeft.firstChild);

  // Mostra il pulsante hamburger solo su mobile
  function updateMobileMenuVisibility() {
    if (window.innerWidth <= 768) {
      mobileMenuBtn.style.display = 'block';
    } else {
      mobileMenuBtn.style.display = 'none';
    }
  }

  window.addEventListener('resize', updateMobileMenuVisibility);
  updateMobileMenuVisibility();

  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-visible');
  });

  // Gestione della navigazione
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const contentSections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('page-title');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);

      // Aggiorna la classe active nei link
      navLinks.forEach(navLink => {
        navLink.parentElement.classList.remove('active');
      });
      link.parentElement.classList.add('active');

      // Mostra la sezione corrispondente
      contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetId}-section`) {
          section.classList.add('active');
          pageTitle.textContent = section.querySelector('h2')?.textContent || 'Dashboard';
        }
      });

      // Chiudi la sidebar su mobile dopo il click
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-visible');
      }
    });
  });

  // Gestione del toggle anno
  const yearButtons = document.querySelectorAll('.year-btn');
  let currentYear = 1;

  yearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      yearButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentYear = parseInt(btn.dataset.year);
      updateDashboard(currentYear);
    });
  });

  // Caricamento dei dati
  loadData().then(data => {
    // Inizializza la dashboard con i dati
    initializeDashboard(data);

    // Inizializza la ricerca
    initializeSearch(data);

    // Aggiorna la dashboard con l'anno corrente
    updateDashboard(currentYear);

    // Aggiorna le medie totali per anno
    updateMediaTotalePerAnno(data);

    // Inizializza il grafico delle medie categorie per anni
    initializeMedieCategorieChart(data);
  });
}

// Funzione per caricare i dati
async function loadData() {
  try {
    const response = await fetch('dati.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
    return { 'categorie anno 1': [], 'categorie anno 2': [] };
  }
}

// Funzione per inizializzare la dashboard
function initializeDashboard(data) {
  // Inizializza le sezioni per anno 1 e anno 2
  initializeAnnoSection(data['categorie anno 1'], 1);

  // Inizializza l'anno 2 solo se esistono dati
  if (data['categorie anno 2'] && data['categorie anno 2'].length > 0) {
    initializeAnnoSection(data['categorie anno 2'], 2);
  } else {
    // Se non ci sono dati per l'anno 2, mostra un messaggio
    const container = document.getElementById('categorie-container-anno2');
    container.innerHTML = '<div class="no-data">Nessun dato disponibile per l\'Anno 2</div>';
  }

  // Inizializza la sezione di confronto
  initializeConfrontoSection(data);

  // Inizializza la sezione statistiche
  initializeStatisticheSection(data);

  // Inizializza la dashboard overview
  updateDashboardOverview(data, 1);
}

// Funzione per inizializzare una sezione anno
function initializeAnnoSection(categorie, anno) {
  const container = document.getElementById(`categorie-container-anno${anno}`);
  const toggleButtons = document.getElementById(`toggle-buttons-anno${anno}`);
  const mediaTotaleAnno = document.getElementById(`media-totale-anno${anno}`);

  // Svuota i container
  container.innerHTML = '';
  toggleButtons.innerHTML = '';

  // Calcola la media totale per questo anno
  let sommaVotiTotale = 0;
  let numVotiTotale = 0;

  // Crea i toggle button per le categorie
  categorie.forEach((categoria, index) => {
    // Crea il toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn active';
    toggleBtn.textContent = categoria.nome;
    toggleBtn.dataset.index = index;
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      const categoriaDiv = document.getElementById(`categoria-${anno}-${index}`);
      if (categoriaDiv) {
        categoriaDiv.style.display = toggleBtn.classList.contains('active') ? 'block' : 'none';
      }
    });
    toggleButtons.appendChild(toggleBtn);

    // Crea il div della categoria
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = 'categoria';
    categoriaDiv.id = `categoria-${anno}-${index}`;

    // Titolo categoria
    const titolo = document.createElement('h3');
    titolo.textContent = categoria.nome;
    categoriaDiv.appendChild(titolo);

    // Lista materie
    const lista = document.createElement('ul');
    lista.className = 'materia-container';

    let somma = 0;
    let contatore = 0;

    // Aggiungi le materie
    categoria.materie.forEach(materia => {
      const li = document.createElement('li');
      li.className = 'materia';

      const nomeSpan = document.createElement('span');
      nomeSpan.className = 'materia-nome';
      nomeSpan.textContent = materia.nome;

      const votoSpan = document.createElement('span');
      votoSpan.className = 'materia-voto';

      if (materia.voto !== null) {
        votoSpan.textContent = materia.voto;
        // Colora in base al voto
        if (materia.voto >= 80) {
          votoSpan.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
          votoSpan.style.color = '#15803d';
        } else if (materia.voto >= 70) {
          votoSpan.style.backgroundColor = 'rgba(251, 191, 36, 0.2)';
          votoSpan.style.color = '#b45309';
        } else {
          votoSpan.style.backgroundColor = 'rgba(248, 113, 113, 0.2)';
          votoSpan.style.color = '#b91c1c';
        }

        somma += materia.voto;
        contatore++;

        // Aggiorna i totali per la media dell'anno
        sommaVotiTotale += materia.voto;
        numVotiTotale++;
      } else {
        votoSpan.textContent = 'N/A';
        votoSpan.style.backgroundColor = 'rgba(100, 116, 139, 0.2)';
        votoSpan.style.color = '#475569';
      }

      li.appendChild(nomeSpan);
      li.appendChild(votoSpan);
      lista.appendChild(li);
    });

    categoriaDiv.appendChild(lista);

    // Media categoria
    const media = contatore > 0 ? (somma / contatore).toFixed(2) : 'N/A';
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'media-categoria';
    mediaDiv.textContent = `Media: ${media}`;
    categoriaDiv.appendChild(mediaDiv);

    container.appendChild(categoriaDiv);
  });

  // Aggiorna la media totale per questo anno
  const mediaTotale = numVotiTotale > 0 ? (sommaVotiTotale / numVotiTotale).toFixed(2) : 'N/A';
  if (mediaTotaleAnno) {
    mediaTotaleAnno.textContent = mediaTotale;
  }
}

// Funzione per aggiornare le medie totali per anno
function updateMediaTotalePerAnno(data) {
  const mediaAnno1Element = document.getElementById('media-anno1');
  const mediaAnno2Element = document.getElementById('media-anno2');

  // Calcola la media per l'anno 1
  const categorieAnno1 = data['categorie anno 1'];
  const mediaAnno1 = calcolaMediaGenerale(categorieAnno1);
  mediaAnno1Element.textContent = mediaAnno1 > 0 ? mediaAnno1.toFixed(2) : 'N/A';

  // Calcola la media per l'anno 2 se ci sono dati
  const categorieAnno2 = data['categorie anno 2'];
  if (categorieAnno2 && categorieAnno2.length > 0) {
    const mediaAnno2 = calcolaMediaGenerale(categorieAnno2);
    mediaAnno2Element.textContent = mediaAnno2 > 0 ? mediaAnno2.toFixed(2) : 'N/A';
  } else {
    mediaAnno2Element.textContent = 'N/A';
  }
}

// Funzione per inizializzare la ricerca
function initializeSearch(data) {
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Cerca in entrambi gli anni
    [1, 2].forEach(anno => {
      const categorie = data[`categorie anno ${anno}`];
      if (!categorie) return; // Salta se non ci sono dati per questo anno

      categorie.forEach((categoria, catIndex) => {
        const categoriaDiv = document.getElementById(`categoria-${anno}-${catIndex}`);
        if (!categoriaDiv) return;

        let categoriaVisible = false;

        // Controlla se il nome della categoria corrisponde
        if (categoria.nome.toLowerCase().includes(searchTerm)) {
          categoriaVisible = true;
        }

        // Controlla le materie
        const materieItems = categoriaDiv.querySelectorAll('.materia');
        materieItems.forEach((materiaItem, materiaIndex) => {
          const materiaName = categoria.materie[materiaIndex].nome.toLowerCase();
          const isVisible = materiaName.includes(searchTerm);

          materiaItem.style.display = isVisible || searchTerm === '' ? 'flex' : 'none';

          if (isVisible) {
            categoriaVisible = true;
          }
        });

        // Mostra/nascondi la categoria
        categoriaDiv.style.display = categoriaVisible || searchTerm === '' ? 'block' : 'none';
      });
    });
  });
}

// Funzione per aggiornare la dashboard in base all'anno selezionato
function updateDashboard(anno) {
  // Mostra la sezione corrispondente all'anno
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  if (anno === 1 || anno === 2) {
    const annoSection = document.getElementById(`anno${anno}-section`);
    if (annoSection) {
      annoSection.classList.add('active');
      document.getElementById('page-title').textContent = `Anno ${anno}`;

      // Aggiorna il messaggio di stato anno
      document.getElementById('stato-anno').textContent = `Anno ${anno} in corso`;
    }
  }

  // Aggiorna i dati nella dashboard overview
  loadData().then(data => {
    updateDashboardOverview(data, anno);
  });
}

// Funzione per aggiornare la dashboard overview
function updateDashboardOverview(data, anno) {
  const categorie = data[`categorie anno ${anno}`];

  // Se non ci sono dati per questo anno, mostra un messaggio
  if (!categorie || categorie.length === 0) {
    document.getElementById('media-generale').textContent = 'N/A';
    document.getElementById('miglior-categoria').textContent = 'N/A';
    document.getElementById('materie-completate').textContent = '0/0 (0%)';
    document.getElementById('progress-completamento').style.width = '0%';
    document.getElementById('stato-anno').textContent = 'Dati non disponibili';
    document.getElementById('trend-stato').innerHTML = '';
    return;
  }

  // Calcola la media generale
  let sommaVoti = 0;
  let numVoti = 0;

  categorie.forEach(cat => {
    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        sommaVoti += materia.voto;
        numVoti++;
      }
    });
  });

  const mediaGenerale = numVoti > 0 ? (sommaVoti / numVoti).toFixed(2) : 'N/A';
  document.getElementById('media-generale').textContent = mediaGenerale;

  // Trova la categoria con la media più alta
  let migliorCategoria = { nome: 'Nessuna', media: 0 };

  categorie.forEach(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    const media = count > 0 ? somma / count : 0;

    if (media > migliorCategoria.media) {
      migliorCategoria = { nome: cat.nome, media: media };
    }
  });

  document.getElementById('miglior-categoria').textContent =
    `${migliorCategoria.nome} (${migliorCategoria.media.toFixed(2)})`;

  // Calcola le materie completate
  const materieCompletate = categorie.reduce((acc, cat) => {
    return acc + cat.materie.filter(m => m.voto !== null).length;
  }, 0);

  const totalMaterie = categorie.reduce((acc, cat) => {
    return acc + cat.materie.length;
  }, 0);

  const percentualeCompletamento = Math.round((materieCompletate / totalMaterie) * 100);

  document.getElementById('materie-completate').textContent =
    `${materieCompletate}/${totalMaterie} (${percentualeCompletamento}%)`;

  document.getElementById('progress-completamento').style.width = `${percentualeCompletamento}%`;

  // Stato Anno
  document.getElementById('stato-anno').textContent = `Anno ${anno} in corso`;
  document.getElementById('trend-stato').innerHTML =
    '<i class="fas fa-circle-notch"></i> In corso';
  document.getElementById('trend-stato').className = 'trend';

  // Confronto tra anni
  if (anno === 1) {
    // Nessun confronto per l'anno 1
    document.getElementById('trend-media').innerHTML = '';
  } else {
    // Calcola la differenza tra le medie degli anni
    const categorieAnno1 = data['categorie anno 1'];
    const categorieAnno2 = data['categorie anno 2'];

    if (!categorieAnno1 || !categorieAnno2) {
      document.getElementById('trend-media').innerHTML = '';
      return;
    }

    let mediaAnno1 = calcolaMediaGenerale(categorieAnno1);
    let mediaAnno2 = calcolaMediaGenerale(categorieAnno2);

    const differenza = mediaAnno2 - mediaAnno1;

    if (differenza > 0) {
      document.getElementById('trend-media').innerHTML =
        `<i class="fas fa-arrow-up"></i> +${differenza.toFixed(2)} rispetto all'Anno 1`;
      document.getElementById('trend-media').className = 'trend up';
    } else if (differenza < 0) {
      document.getElementById('trend-media').innerHTML =
        `<i class="fas fa-arrow-down"></i> ${differenza.toFixed(2)} rispetto all'Anno 1`;
      document.getElementById('trend-media').className = 'trend down';
    } else {
      document.getElementById('trend-media').innerHTML =
        '<i class="fas fa-equals"></i> Stabile rispetto all\'Anno 1';
      document.getElementById('trend-media').className = 'trend';
    }
  }

  // Aggiorna i grafici
  updateCharts(data, anno);
}

// Funzione per calcolare la media generale
function calcolaMediaGenerale(categorie) {
  let sommaVoti = 0;
  let numVoti = 0;

  categorie.forEach(cat => {
    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        sommaVoti += materia.voto;
        numVoti++;
      }
    });
  });

  return numVoti > 0 ? sommaVoti / numVoti : 0;
}

// Funzione per aggiornare i grafici
function updateCharts(data, anno) {
  const categorieChart = document.getElementById('categorie-chart');
  const progressoChart = document.getElementById('progresso-chart');

  if (!categorieChart || !progressoChart) return;

  const categorieCtx = categorieChart.getContext('2d');
  const progressoCtx = progressoChart.getContext('2d');

  // Verifica se ci sono dati per questo anno
  const categorie = data[`categorie anno ${anno}`];
  if (!categorie || categorie.length === 0) {
    // Se non ci sono dati, pulisci i grafici
    if (window.categorieChartInstance) {
      window.categorieChartInstance.destroy();
    }
    if (window.progressoChartInstance) {
      window.progressoChartInstance.destroy();
    }
    return;
  }

  // Dati per il grafico delle categorie
  const etichette = categorie.map(cat => cat.nome);
  const medieCategorie = categorie.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  // Grafico delle categorie
  if (window.categorieChartInstance) {
    window.categorieChartInstance.destroy();
  }

  window.categorieChartInstance = new Chart(categorieCtx, {
    type: 'bar',
    data: {
      labels: etichette,
      datasets: [{
        label: `Media Categoria - Anno ${anno}`,
        data: medieCategorie,
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1,
        borderRadius: 5,
        maxBarThickness: 50
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `Media: ${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Grafico del progresso
  if (window.progressoChartInstance) {
    window.progressoChartInstance.destroy();
  }

  // Dati per il grafico del progresso
  const materieCompletate = categorie.map(cat => {
    return cat.materie.filter(m => m.voto !== null).length;
  });

  const materieTotali = categorie.map(cat => cat.materie.length);

  window.progressoChartInstance = new Chart(progressoCtx, {
    type: 'doughnut',
    data: {
      labels: ['Completate', 'Da completare'],
      datasets: [{
        data: [
          materieCompletate.reduce((a, b) => a + b, 0),
          materieTotali.reduce((a, b) => a + b, 0) - materieCompletate.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          'rgba(74, 222, 128, 0.7)',
          'rgba(226, 232, 240, 0.7)'
        ],
        borderColor: [
          'rgba(74, 222, 128, 1)',
          'rgba(226, 232, 240, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: false
        }
      }
    }
  });
}

// Funzione per inizializzare la sezione di confronto
function initializeConfrontoSection(data) {
  const confrontoChart = document.getElementById('confronto-chart');
  if (!confrontoChart) return;

  const confrontoCtx = confrontoChart.getContext('2d');
  const categorieAnno1 = data['categorie anno 1'];
  const categorieAnno2 = data['categorie anno 2'];

  // Verifica se ci sono dati per entrambi gli anni
  if (!categorieAnno1 || !categorieAnno2 || categorieAnno1.length === 0 || categorieAnno2.length === 0) {
    document.getElementById('miglioramento-generale').textContent = 'Dati non disponibili';
    document.getElementById('categoria-migliorata').textContent = 'Dati non disponibili';
    document.getElementById('materia-migliorata').textContent = 'Dati non disponibili';
    return;
  }

  // Calcola le medie per categoria per entrambi gli anni
  const etichette = categorieAnno1.map(cat => cat.nome);

  const medieAnno1 = categorieAnno1.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  const medieAnno2 = categorieAnno2.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  // Grafico di confronto
  if (window.confrontoChartInstance) {
    window.confrontoChartInstance.destroy();
  }

  window.confrontoChartInstance = new Chart(confrontoCtx, {
    type: 'radar',
    data: {
      labels: etichette,
      datasets: [
        {
          label: 'Anno 1',
          data: medieAnno1,
          backgroundColor: 'rgba(67, 97, 238, 0.2)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(67, 97, 238, 1)',
          pointRadius: 4
        },
        {
          label: 'Anno 2',
          data: medieAnno2,
          backgroundColor: 'rgba(76, 201, 240, 0.2)',
          borderColor: 'rgba(76, 201, 240, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(76, 201, 240, 1)',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: true
        }
      }
    }
  });

  // Calcola il miglioramento generale
  const mediaGeneraleAnno1 = calcolaMediaGenerale(categorieAnno1);
  const mediaGeneraleAnno2 = calcolaMediaGenerale(categorieAnno2);
  const differenzaGenerale = mediaGeneraleAnno2 - mediaGeneraleAnno1;

  document.getElementById('miglioramento-generale').textContent =
    `${differenzaGenerale > 0 ? '+' : ''}${differenzaGenerale.toFixed(2)} punti`;

  const trendMiglioramento = document.getElementById('trend-miglioramento');

  if (differenzaGenerale > 0) {
    trendMiglioramento.innerHTML = '<i class="fas fa-arrow-up"></i> Miglioramento';
    trendMiglioramento.className = 'trend up';
  } else if (differenzaGenerale < 0) {
    trendMiglioramento.innerHTML = '<i class="fas fa-arrow-down"></i> Peggioramento';
    trendMiglioramento.className = 'trend down';
  } else {
    trendMiglioramento.innerHTML = '<i class="fas fa-equals"></i> Stabile';
    trendMiglioramento.className = 'trend';
  }

  // Trova la categoria migliore
  let migliorCategoria = { nome: 'Nessuna', media: 0 };

  for (let i = 0; i < etichette.length; i++) {
    const mediaCategoria = medieAnno2[i];

    if (mediaCategoria > migliorCategoria.media) {
      migliorCategoria = {
        nome: etichette[i],
        media: mediaCategoria
      };
    }
  }

  document.getElementById('categoria-migliorata').textContent =
    `${migliorCategoria.nome} (${migliorCategoria.media.toFixed(2)})`;

  // Trova la materia migliore
  let migliorMateria = { nome: 'Nessuna', voto: 0 };

  for (let i = 0; i < categorieAnno2.length; i++) {
    const materieAnno2 = categorieAnno2[i].materie;

    for (let j = 0; j < materieAnno2.length; j++) {
      const votoAnno2 = materieAnno2[j].voto;

      if (votoAnno2 !== null && votoAnno2 > migliorMateria.voto) {
        migliorMateria = {
          nome: materieAnno2[j].nome,
          voto: votoAnno2
        };
      }
    }
  }

  document.getElementById('materia-migliorata').textContent =
    `${migliorMateria.nome} (${migliorMateria.voto})`;
}

// Funzione per inizializzare il grafico delle medie categorie per anni
function initializeMedieCategorieChart(data) {
  const medieCategorieChart = document.getElementById('medie-categorie-chart');
  if (!medieCategorieChart) return;

  const medieCategorieCtx = medieCategorieChart.getContext('2d');
  const categorieAnno1 = data['categorie anno 1'];
  const categorieAnno2 = data['categorie anno 2'];

  // Verifica se ci sono dati per entrambi gli anni
  if (!categorieAnno1 || !categorieAnno2 || categorieAnno1.length === 0 || categorieAnno2.length === 0) {
    return;
  }

  // Calcola le medie per categoria per entrambi gli anni
  const etichette = categorieAnno1.map(cat => cat.nome);

  const medieAnno1 = categorieAnno1.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  const medieAnno2 = categorieAnno2.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  // Grafico delle medie categorie per anni
  if (window.medieCategorieChartInstance) {
    window.medieCategorieChartInstance.destroy();
  }

  window.medieCategorieChartInstance = new Chart(medieCategorieCtx, {
    type: 'bar',
    data: {
      labels: etichette,
      datasets: [
        {
          label: 'Anno 1',
          data: medieAnno1,
          backgroundColor: 'rgba(67, 97, 238, 0.7)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 40
        },
        {
          label: 'Anno 2',
          data: medieAnno2,
          backgroundColor: 'rgba(76, 201, 240, 0.7)',
          borderColor: 'rgba(76, 201, 240, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return `Media: ${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Funzione per inizializzare la sezione statistiche
function initializeStatisticheSection(data) {
  const distribuzioneVotiChart = document.getElementById('distribuzione-voti-chart');
  const andamentoChart = document.getElementById('andamento-chart');
  const tabellaRiassuntiva = document.getElementById('tabella-riassuntiva');

  if (!distribuzioneVotiChart || !andamentoChart || !tabellaRiassuntiva) return;

  const distribuzioneVotiCtx = distribuzioneVotiChart.getContext('2d');
  const andamentoCtx = andamentoChart.getContext('2d');
  const tabellaBody = tabellaRiassuntiva.querySelector('tbody');

  const categorieAnno1 = data['categorie anno 1'];
  const categorieAnno2 = data['categorie anno 2'];

  // Verifica se ci sono dati per entrambi gli anni
  if (!categorieAnno1 || !categorieAnno2 || categorieAnno1.length === 0 || categorieAnno2.length === 0) {
    // Se non ci sono dati per uno degli anni, mostra un messaggio
    if (window.distribuzioneVotiChartInstance) {
      window.distribuzioneVotiChartInstance.destroy();
    }
    if (window.andamentoChartInstance) {
      window.andamentoChartInstance.destroy();
    }
    if (tabellaBody) {
      tabellaBody.innerHTML = '<tr><td colspan="4">Dati non disponibili</td></tr>';
    }
    return;
  }

  // Calcola la distribuzione dei voti
  const distribuzioneAnno1 = calcolaDistribuzioneVoti(categorieAnno1);
  const distribuzioneAnno2 = calcolaDistribuzioneVoti(categorieAnno2);

  // Grafico distribuzione voti
  if (window.distribuzioneVotiChartInstance) {
    window.distribuzioneVotiChartInstance.destroy();
  }

  window.distribuzioneVotiChartInstance = new Chart(distribuzioneVotiCtx, {
    type: 'bar',
    data: {
      labels: ['60-69', '70-79', '80-89', '90-100'],
      datasets: [
        {
          label: 'Anno 1',
          data: distribuzioneAnno1,
          backgroundColor: 'rgba(67, 97, 238, 0.7)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50
        },
        {
          label: 'Anno 2',
          data: distribuzioneAnno2,
          backgroundColor: 'rgba(76, 201, 240, 0.7)',
          borderColor: 'rgba(76, 201, 240, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Numero di materie'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Grafico andamento temporale
  if (window.andamentoChartInstance) {
    window.andamentoChartInstance.destroy();
  }

  // Calcola le medie per categoria per entrambi gli anni
  const etichette = categorieAnno1.map(cat => cat.nome);

  const medieAnno1 = categorieAnno1.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  const medieAnno2 = categorieAnno2.map(cat => {
    let somma = 0;
    let count = 0;

    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        somma += materia.voto;
        count++;
      }
    });

    return count > 0 ? somma / count : 0;
  });

  window.andamentoChartInstance = new Chart(andamentoCtx, {
    type: 'line',
    data: {
      labels: etichette,
      datasets: [
        {
          label: 'Anno 1',
          data: medieAnno1,
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(67, 97, 238, 1)',
          pointRadius: 4,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Anno 2',
          data: medieAnno2,
          backgroundColor: 'rgba(76, 201, 240, 0.1)',
          borderColor: 'rgba(76, 201, 240, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(76, 201, 240, 1)',
          pointRadius: 4,
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 15,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Tabella riassuntiva
  if (tabellaBody) {
    tabellaBody.innerHTML = '';

    for (let i = 0; i < etichette.length; i++) {
      const tr = document.createElement('tr');

      const tdCategoria = document.createElement('td');
      tdCategoria.textContent = etichette[i];

      const tdMediaAnno1 = document.createElement('td');
      tdMediaAnno1.textContent = medieAnno1[i].toFixed(2);

      const tdMediaAnno2 = document.createElement('td');
      tdMediaAnno2.textContent = medieAnno2[i].toFixed(2);

      const tdVariazione = document.createElement('td');
      const variazione = medieAnno2[i] - medieAnno1[i];
      tdVariazione.textContent = `${variazione > 0 ? '+' : ''}${variazione.toFixed(2)}`;

      if (variazione > 0) {
        tdVariazione.style.color = '#15803d';
      } else if (variazione < 0) {
        tdVariazione.style.color = '#b91c1c';
      }

      tr.appendChild(tdCategoria);
      tr.appendChild(tdMediaAnno1);
      tr.appendChild(tdMediaAnno2);
      tr.appendChild(tdVariazione);

      tabellaBody.appendChild(tr);
    }
  }
}

// Funzione per calcolare la distribuzione dei voti
function calcolaDistribuzioneVoti(categorie) {
  // Intervalli: [60-69, 70-79, 80-89, 90-100]
  const distribuzione = [0, 0, 0, 0];

  categorie.forEach(cat => {
    cat.materie.forEach(materia => {
      if (materia.voto !== null) {
        if (materia.voto >= 90) {
          distribuzione[3]++;
        } else if (materia.voto >= 80) {
          distribuzione[2]++;
        } else if (materia.voto >= 70) {
          distribuzione[1]++;
        } else {
          distribuzione[0]++;
        }
      }
    });
  });

  return distribuzione;
}