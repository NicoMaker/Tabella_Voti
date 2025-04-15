document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  initApp();
  
  // Set current date
  setCurrentDate();
  
  // Add event listeners
  setupEventListeners();
  
  // Load data from JSON
  loadDashboardData();
});

function initApp() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('.theme-toggle i').textContent = 'light_mode';
  }
}

function setCurrentDate() {
  const dateElement = document.getElementById('current-date');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('it-IT', options);
  dateElement.textContent = today;
}

function setupEventListeners() {
  // Menu toggle for mobile
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle.addEventListener('click', function() {
    document.body.classList.toggle('sidebar-open');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    if (document.body.classList.contains('sidebar-open') && 
        !event.target.closest('.sidebar') && 
        !event.target.closest('.menu-toggle')) {
      document.body.classList.remove('sidebar-open');
    }
  });
  
  // Navigation
  const navItems = document.querySelectorAll('.sidebar-nav li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      navigateTo(page);
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-open');
      }
    });
  });
  
  // Aggiungi swipe per mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const swipeThreshold = 100;
    
    // Swipe right to open sidebar
    if (touchEndX - touchStartX > swipeThreshold && !document.body.classList.contains('sidebar-open')) {
      document.body.classList.add('sidebar-open');
    }
    
    // Swipe left to close sidebar
    if (touchStartX - touchEndX > swipeThreshold && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
    }
  }
  
  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    // Update icon
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
      icon.textContent = 'light_mode';
      localStorage.setItem('theme', 'dark');
    } else {
      icon.textContent = 'dark_mode';
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Categoria filter
  const categoriaFilter = document.getElementById('categoria-filter');
  if (categoriaFilter) {
    categoriaFilter.addEventListener('change', function() {
      const selectedCategoria = this.value;
      filterGradesByCategoria(selectedCategoria);
    });
  }
  
  // Modal
  const notificationButton = document.querySelector('.top-bar-actions .icon-button');
  notificationButton.addEventListener('click', function() {
    const modal = document.getElementById('notification-modal');
    modal.classList.add('active');
    loadNotifications();
  });
  
  const closeModalButtons = document.querySelectorAll('.close-modal');
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.classList.remove('active');
    });
  });
  
  // Close modal when clicking outside
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === this) {
        this.classList.remove('active');
      }
    });
  });
}

// Aggiungi funzione per adattare il layout in base alla dimensione dello schermo
function adjustLayoutForScreenSize() {
  const width = window.innerWidth;
  
  if (width <= 576) {
    // Su schermi molto piccoli, mostra descrizioni più brevi
    const descriptions = document.querySelectorAll('.materia-nome');
    descriptions.forEach(desc => {
      if (desc.textContent.length > 20) {
        desc.title = desc.textContent;
        desc.textContent = desc.textContent.substring(0, 20) + '...';
      }
    });
  }
}

// Chiama la funzione al caricamento e al ridimensionamento della finestra
window.addEventListener('DOMContentLoaded', adjustLayoutForScreenSize);
window.addEventListener('resize', adjustLayoutForScreenSize);

function navigateTo(page) {
  // Update active navigation item
  document.querySelectorAll('.sidebar-nav li').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`.sidebar-nav li[data-page="${page}"]`).classList.add('active');
  
  // Show selected page
  document.querySelectorAll('.page').forEach(pageEl => {
    pageEl.classList.remove('active');
  });
  document.getElementById(`${page}-page`).classList.add('active');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');
  
  // Set message and icon
  toastMessage.textContent = message;
  
  if (type === 'success') {
    toastIcon.textContent = 'check_circle';
    toastIcon.style.color = 'var(--secondary-color)';
  } else if (type === 'error') {
    toastIcon.textContent = 'error';
    toastIcon.style.color = 'var(--danger-color)';
  } else if (type === 'warning') {
    toastIcon.textContent = 'warning';
    toastIcon.style.color = 'var(--accent-color)';
  } else if (type === 'info') {
    toastIcon.textContent = 'info';
    toastIcon.style.color = 'var(--primary-color)';
  }
  
  // Show toast
  toast.classList.add('active');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
  
  // Close toast on click
  const toastClose = toast.querySelector('.toast-close');
  toastClose.addEventListener('click', () => {
    toast.classList.remove('active');
  });
}

async function loadDashboardData() {
  try {
    // Fetch data from JSON file
    const response = await fetch('dati.json');
    if (!response.ok) {
      throw new Error('Errore nel caricamento dei dati');
    }
    
    const data = await response.json();
    
    // Process data
    processGradesData(data);
    
  } catch (error) {
    console.error('Errore:', error);
    showToast('Errore nel caricamento dei dati', 'error');
  }
}

function processGradesData(data) {
  const categorie = data.categorie;
  
  // Calculate statistics
  let totalVoti = 0;
  let countVoti = 0;
  let materieCompletate = 0;
  let materieRimanenti = 0;
  let votoMigliore = 0;
  let materiaMigliore = '';
  
  categorie.forEach(categoria => {
    categoria.materie.forEach(materia => {
      if (materia.voto !== null) {
        totalVoti += materia.voto;
        countVoti++;
        materieCompletate++;
        
        if (materia.voto > votoMigliore) {
          votoMigliore = materia.voto;
          materiaMigliore = materia.nome;
        }
      } else {
        materieRimanenti++;
      }
    });
  });
  
  const mediaVoti = countVoti > 0 ? (totalVoti / countVoti).toFixed(1) : 'N/A';
  
  // Update dashboard stats
  document.getElementById('media-voti').textContent = mediaVoti;
  document.getElementById('materie-completate').textContent = materieCompletate;
  document.getElementById('materie-rimanenti').textContent = materieRimanenti;
  document.getElementById('voto-migliore').textContent = votoMigliore > 0 ? votoMigliore : 'N/A';
  
  // Render latest grades
  renderLatestGrades(categorie);
  
  // Render category progress
  renderCategoryProgress(categorie);
  
  // Render grades page
  renderGradesPage(categorie);
  
  // Populate categoria filter
  populateCategoriaFilter(categorie);
}

function renderLatestGrades(categorie) {
  const ultiVotiList = document.getElementById('ultimi-voti-list');
  ultiVotiList.innerHTML = '';
  
  // Get all materie with votes
  const materieConVoti = [];
  categorie.forEach(categoria => {
    categoria.materie.forEach(materia => {
      if (materia.voto !== null) {
        materieConVoti.push({
          nome: materia.nome,
          voto: materia.voto,
          categoria: categoria.nome
        });
      }
    });
  });
  
  // Sort by vote (highest first)
  materieConVoti.sort((a, b) => b.voto - a.voto);
  
  // Take top 5
  const topMaterie = materieConVoti.slice(0, 5);
  
  if (topMaterie.length === 0) {
    ultiVotiList.innerHTML = '<p>Nessun voto disponibile</p>';
    return;
  }
  
  topMaterie.forEach(materia => {
    const votoClass = getVotoClass(materia.voto);
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-icon ${votoClass}" style="background-color: ${getVotoBackgroundColor(materia.voto)};">
        <i class="material-icons" style="color: ${getVotoColor(materia.voto)};">${getVotoIcon(materia.voto)}</i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${materia.nome}</div>
        <div class="activity-subtitle">${materia.categoria}</div>
        <div class="activity-time">Voto: ${materia.voto}</div>
      </div>
    `;
    ultiVotiList.appendChild(activityItem);
  });
}

function renderCategoryProgress(categorie) {
  const categorieProgress = document.getElementById('categorie-progress');
  categorieProgress.innerHTML = '';
  
  categorie.forEach(categoria => {
    const materieCompletate = categoria.materie.filter(m => m.voto !== null).length;
    const totalMaterie = categoria.materie.length;
    const percentuale = totalMaterie > 0 ? Math.round((materieCompletate / totalMaterie) * 100) : 0;
    
    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';
    progressItem.innerHTML = `
      <div class="progress-header">
        <div class="progress-title">${categoria.nome}</div>
        <div class="progress-value">${materieCompletate}/${totalMaterie} (${percentuale}%)</div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentuale}%"></div>
      </div>
    `;
    categorieProgress.appendChild(progressItem);
  });
}

function renderGradesPage(categorie) {
  const gradesContainer = document.getElementById('grades-container');
  gradesContainer.innerHTML = '';
  
  categorie.forEach(categoria => {
    const categoriaCard = document.createElement('div');
    categoriaCard.className = 'categoria-card';
    categoriaCard.setAttribute('data-categoria', categoria.nome);
    
    const materieCompletate = categoria.materie.filter(m => m.voto !== null).length;
    const totalMaterie = categoria.materie.length;
    const percentuale = totalMaterie > 0 ? Math.round((materieCompletate / totalMaterie) * 100) : 0;
    
    categoriaCard.innerHTML = `
      <div class="categoria-header">
        <div class="categoria-title">${categoria.nome}</div>
        <div class="categoria-progress">${materieCompletate}/${totalMaterie} (${percentuale}%)</div>
      </div>
      <div class="materie-list">
        ${renderMaterieList(categoria.materie)}
      </div>
    `;
    
    gradesContainer.appendChild(categoriaCard);
  });
  
  // Render prossimi esami (placeholder)
  renderProssimiEsami();
}

function renderMaterieList(materie) {
  let html = '';
  
  materie.forEach(materia => {
    const votoClass = materia.voto !== null ? getVotoClass(materia.voto) : 'voto-pending';
    const votoDisplay = materia.voto !== null ? materia.voto : 'In attesa';
    
    html += `
      <div class="materia-item">
        <div class="materia-nome">${materia.nome}</div>
        <div class="materia-voto ${votoClass}">${votoDisplay}</div>
      </div>
    `;
  });
  
  return html;
}

function populateCategoriaFilter(categorie) {
  const categoriaFilter = document.getElementById('categoria-filter');
  if (!categoriaFilter) return;
  
  // Clear existing options except the first one
  while (categoriaFilter.options.length > 1) {
    categoriaFilter.remove(1);
  }
  
  // Add options for each categoria
  categorie.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.nome;
    option.textContent = categoria.nome;
    categoriaFilter.appendChild(option);
  });
}

function filterGradesByCategoria(categoriaName) {
  const categoriaCards = document.querySelectorAll('.categoria-card');
  
  categoriaCards.forEach(card => {
    if (categoriaName === 'all' || card.getAttribute('data-categoria') === categoriaName) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function getVotoClass(voto) {
  if (voto >= 85) {
    return 'voto-alto';
  } else if (voto >= 70) {
    return 'voto-medio';
  } else {
    return 'voto-basso';
  }
}

function getVotoColor(voto) {
  if (voto >= 85) {
    return '#34A853';
  } else if (voto >= 70) {
    return '#FBBC05';
  } else {
    return '#EA4335';
  }
}

function getVotoBackgroundColor(voto) {
  if (voto >= 85) {
    return 'rgba(52, 168, 83, 0.1)';
  } else if (voto >= 70) {
    return 'rgba(251, 188, 5, 0.1)';
  } else {
    return 'rgba(234, 67, 53, 0.1)';
  }
}

function getVotoIcon(voto) {
  if (voto >= 85) {
    return 'emoji_events';
  } else if (voto >= 70) {
    return 'thumb_up';
  } else {
    return 'trending_down';
  }
}

function renderProssimiEsami() {
  const prossimiEsamiList = document.getElementById('prossimi-esami-list');
  if (!prossimiEsamiList) return;
  
  // Placeholder data for upcoming exams
  const prossimiEsami = [
    {
      materia: 'Inglese Tecnico',
      data: '15 Maggio 2025',
      priority: 'high'
    },
    {
      materia: 'Soft Skills 1',
      data: '20 Maggio 2025',
      priority: 'medium'
    },
    {
      materia: 'Sistemi Operativi Windows',
      data: '25 Maggio 2025',
      priority: 'medium'
    },
    {
      materia: 'Cybersecurity',
      data: '1 Giugno 2025',
      priority: 'high'
    }
  ];
  
  prossimiEsamiList.innerHTML = '';
  
  prossimiEsami.forEach(esame => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <div class="task-content">
        <div class="task-title">${esame.materia}</div>
        <div class="task-due">
          ${esame.data}
          <span class="task-priority priority-${esame.priority}">${esame.priority === 'high' ? 'Alta' : esame.priority === 'medium' ? 'Media' : 'Bassa'}</span>
        </div>
      </div>
    `;
    prossimiEsamiList.appendChild(taskItem);
  });
}

function loadNotifications() {
  // Simulate loading notifications
  const notificationList = document.getElementById('notification-list');
  notificationList.innerHTML = '';
  
  // Placeholder notifications
  const notifications = [
    {
      id: 1,
      title: 'Nuovo Voto',
      message: 'È stato inserito un nuovo voto per Networking',
      time: '10 minuti fa',
      icon: 'school',
      iconColor: '#4285F4',
      iconBg: 'rgba(66, 133, 244, 0.1)',
      unread: true
    },
    {
      id: 2,
      title: 'Promemoria Esame',
      message: 'L\'esame di Inglese Tecnico è tra 3 giorni',
      time: '30 minuti fa',
      icon: 'event',
      iconColor: '#FBBC05',
      iconBg: 'rgba(251, 188, 5, 0.1)',
      unread: true
    },
    {
      id: 3,
      title: 'Aggiornamento Corso',
      message: 'Il corso di Linux è stato aggiornato con nuovi materiali',
      time: '2 ore fa',
      icon: 'update',
      iconColor: '#34A853',
      iconBg: 'rgba(52, 168, 83, 0.1)',
      unread: false
    },
    {
      id: 4,
      title: 'Messaggio dal Docente',
      message: 'Il prof. Bianchi ha inviato un messaggio',
      time: '1 giorno fa',
      icon: 'message',
      iconColor: '#4285F4',
      iconBg: 'rgba(66, 133, 244, 0.1)',
      unread: false
    }
  ];
  
  notifications.forEach(notification => {
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item ${notification.unread ? 'notification-unread' : ''}`;
    notificationItem.innerHTML = `
      <div class="notification-icon" style="background-color: ${notification.iconBg};">
        <i class="material-icons" style="color: ${notification.iconColor};">${notification.icon}</i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${notification.time}</div>
      </div>
    `;
    notificationList.appendChild(notificationItem);
  });
  
  // Update badge count
  const unreadCount = notifications.filter(n => n.unread).length;
  const badges = document.querySelectorAll('.top-bar-actions .icon-button .badge');
  badges[0].textContent = unreadCount;
}

// Handle clicks outside of components
document.addEventListener('click', function(event) {
  // Close toast when clicking outside
  const toast = document.getElementById('toast');
  if (toast.classList.contains('active') && !toast.contains(event.target)) {
    toast.classList.remove('active');
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    document.body.classList.remove('sidebar-open');
  }
  
  // Adjust layout for screen size
  adjustLayoutForScreenSize();
});

// Accessibility: Add keyboard navigation
document.addEventListener('keydown', function(event) {
  // Close modals with Escape key
  if (event.key === 'Escape') {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
      modal.classList.remove('active');
    });
    
    // Close toast
    const toast = document.getElementById('toast');
    if (toast.classList.contains('active')) {
      toast.classList.remove('active');
    }
  }
});
