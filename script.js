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
  fetch("dati.json")
    .then((response) => response.json())
    .then((data) => {
      const app = document.getElementById("app"),
        container = document.getElementById("categorie-container"),
        toggleButtons = document.getElementById("toggle-buttons"),
        chartCanvas = document
          .getElementById("categorie-chart")
          .getContext("2d"),
        searchInput = document.getElementById("search-input");

      let totalCategorie = 0,
        sommaCategorie = 0;

      // Array per tenere traccia di tutte le materie
      let tutteLeMaterie = [];

      // Calcolo media per ciascuna categoria
      data.categorie.forEach((categoria, index) => {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "categoria animate__animated animate__fadeIn";
        categoriaDiv.style.animationDelay = `${index * 0.1}s`;
        categoriaDiv.id = `categoria-${index}`;

        const titolo = document.createElement("h3");
        titolo.textContent = categoria.nome;
        categoriaDiv.appendChild(titolo);

        const lista = document.createElement("ul");
        lista.classList.add("materia-container");
        let somma = 0,
          contatore = 0;

        // Aggiungiamo le materie con un ritardo per l'animazione
        categoria.materie.forEach((materia, materiaIndex) => {
          const li = document.createElement("li");
          li.className = "materia";
          li.style.opacity = "0";

          // Aggiungi la materia all'array globale
          tutteLeMaterie.push({
            nome: materia.nome,
            voto: materia.voto,
            categoria: categoria.nome,
            element: li,
          });

          const voto = materia.voto !== null ? materia.voto : "N/A";
          li.innerHTML = `${materia.nome}: <span>${voto}</span>`;
          lista.appendChild(li);

          // Animazione con ritardo per ogni materia
          setTimeout(() => {
            li.style.animation = `slideIn 0.3s ease forwards ${
              materiaIndex * 0.1
            }s`;
            li.style.opacity = "1";
          }, 300 + materiaIndex * 100);

          if (materia.voto !== null) {
            somma += materia.voto;
            contatore++;
          }
        });

        categoriaDiv.appendChild(lista);

        const media = contatore > 0 ? (somma / contatore).toFixed(2) : "N/A",
          mediaDiv = document.createElement("div");
        mediaDiv.className = "media-categoria";
        mediaDiv.textContent = `Media Categoria: ${media}`;
        categoriaDiv.appendChild(mediaDiv);

        if (media !== "N/A") {
          sommaCategorie += parseFloat(media);
          totalCategorie++;
        }

        // Aggiungi il grafico per ciascuna categoria con animazione
        const canvasContainer = document.createElement("div");
        canvasContainer.className = "chart-container chart-animation";
        canvasContainer.style.opacity = "0";

        const canvas = document.createElement("canvas");
        canvasContainer.appendChild(canvas);
        categoriaDiv.appendChild(canvasContainer);

        // Animazione per il grafico
        setTimeout(() => {
          canvasContainer.style.animation = "scaleIn 0.5s ease forwards";
          canvasContainer.style.opacity = "1";

          new Chart(canvas, {
            type: "doughnut",
            data: {
              labels: categoria.materie.map((m) => m.nome),
              datasets: [
                {
                  label: "Voti",
                  data: categoria.materie.map((m) =>
                    m.voto !== null ? m.voto : 0
                  ),
                  backgroundColor: categoria.materie.map(
                    (_, i) => `hsl(${(i * 60) % 360}, 70%, 70%)`
                  ),
                  borderWidth: 2,
                  borderColor: "#ffffff",
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: `Grafico ${categoria.nome}`,
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                legend: {
                  position: "bottom",
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle",
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  titleColor: "#333",
                  bodyColor: "#333",
                  borderColor: "#ddd",
                  borderWidth: 1,
                  padding: 15,
                  displayColors: false,
                  callbacks: {
                    label: function (context) {
                      return `${context.label}: ${context.raw}`;
                    },
                  },
                },
              },
              animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: "easeOutQuart",
              },
              responsive: true,
              maintainAspectRatio: true,
            },
          });
        }, 500);

        container.appendChild(categoriaDiv);

        // Bottone toggle per mostrare/nascondere le categorie con effetto ripple
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-btn";
        toggleBtn.textContent = categoria.nome;

        // Aggiungi effetto ripple al click
        toggleBtn.addEventListener("click", function (e) {
          // Aggiungi l'effetto ripple
          const ripple = document.createElement("span");
          ripple.classList.add("ripple");
          this.appendChild(ripple);

          // Posiziona l'effetto ripple dove è avvenuto il click
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

          // Rimuovi l'effetto ripple dopo l'animazione
          setTimeout(() => {
            ripple.remove();
          }, 600);

          // Toggle della categoria
          const categoria = document.getElementById(`categoria-${index}`);
          categoria.classList.toggle("hidden");
          this.classList.toggle("active");

          // Aggiungi animazione quando la categoria viene mostrata di nuovo
          if (!categoria.classList.contains("hidden")) {
            categoria.classList.add("animate__animated", "animate__fadeIn");
            setTimeout(() => {
              categoria.classList.remove(
                "animate__animated",
                "animate__fadeIn"
              );
            }, 1000);
          }
        });

        toggleButtons.appendChild(toggleBtn);
      });

      // Funzione di ricerca
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();

        // Filtra le materie in base al termine di ricerca
        tutteLeMaterie.forEach((materia) => {
          const matchesSearch =
            materia.nome.toLowerCase().includes(searchTerm) ||
            (materia.categoria &&
              materia.categoria.toLowerCase().includes(searchTerm));

          // Mostra/nascondi la materia
          if (searchTerm === "") {
            materia.element.style.display = "flex";
            materia.element.style.animation = "slideIn 0.3s ease forwards";
          } else {
            materia.element.style.display = matchesSearch ? "flex" : "none";
            if (matchesSearch) {
              materia.element.style.animation = "slideIn 0.3s ease forwards";
            }
          }
        });

        // Mostra/nascondi le categorie in base alle materie visibili
        data.categorie.forEach((categoria, index) => {
          const categoriaDiv = document.getElementById(`categoria-${index}`);
          const materieVisibili = Array.from(
            categoriaDiv.querySelectorAll(".materia")
          ).some((el) => el.style.display !== "none");

          categoriaDiv.style.display =
            materieVisibili || searchTerm === "" ? "flex" : "none";
        });
      });

      // Media finale delle categorie
      const mediaFinale =
        totalCategorie > 0
          ? (sommaCategorie / totalCategorie).toFixed(2)
          : "N/A";

      // Media complessiva di tutte le materie
      let sommaVoti = 0,
        numVoti = 0;
      data.categorie.forEach((cat) =>
        cat.materie.forEach((m) => {
          if (m.voto !== null) {
            sommaVoti += m.voto;
            numVoti++;
          }
        })
      );

      const mediaMaterie =
        numVoti > 0 ? (sommaVoti / numVoti).toFixed(2) : "N/A";

      // Aggiorna le statistiche
      document.getElementById("media-totale").textContent = mediaMaterie;

      // Trova la categoria con la media più alta
      let migliorCategoria = { nome: "Nessuna", media: 0 };
      data.categorie.forEach((cat) => {
        let somma = 0,
          count = 0;
        cat.materie.forEach((m) => {
          if (m.voto !== null) {
            somma += m.voto;
            count++;
          }
        });

        const media = count > 0 ? somma / count : 0;
        if (media > migliorCategoria.media) {
          migliorCategoria = { nome: cat.nome, media: media };
        }
      });

      document.getElementById("miglior-categoria").textContent = `${
        migliorCategoria.nome
      } (${migliorCategoria.media.toFixed(2)})`;

      // Calcola le materie completate
      const materieCompletate = data.categorie.reduce((acc, cat) => {
        return acc + cat.materie.filter((m) => m.voto !== null).length;
      }, 0);

      const totalMaterie = data.categorie.reduce((acc, cat) => {
        return acc + cat.materie.length;
      }, 0);

      document.getElementById(
        "materie-completate"
      ).textContent = `${materieCompletate}/${totalMaterie} (${Math.round(
        (materieCompletate / totalMaterie) * 100
      )}%)`;

      // Grafico generale delle categorie con animazione migliorata
      const etichette = data.categorie.map((cat) => cat.nome);
      const medieCategorie = data.categorie.map((cat) => {
        let somma = 0,
          count = 0;
        cat.materie.forEach((m) => {
          if (m.voto !== null) {
            somma += m.voto;
            count++;
          }
        });
        return count > 0 ? somma / count : 0;
      });

      // Aggiungi animazione al grafico principale
      setTimeout(() => {
        const graficoGenerale = document.getElementById(
          "grafico-generale-container"
        );
        graficoGenerale.classList.add("chart-animation");
        graficoGenerale.style.opacity = "1";

        new Chart(chartCanvas, {
          type: "doughnut",
          data: {
            labels: etichette,
            datasets: [
              {
                label: "Media Categoria",
                data: medieCategorie,
                backgroundColor: etichette.map(
                  (_, i) => `hsl(${(i * 60) % 360}, 70%, 70%)`
                ),
                borderWidth: 3,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Media generale per categoria",
                font: {
                  size: 18,
                  weight: "bold",
                },
                padding: {
                  top: 10,
                  bottom: 30,
                },
              },
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: "circle",
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#333",
                bodyColor: "#333",
                borderColor: "#ddd",
                borderWidth: 1,
                padding: 15,
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw.toFixed(2)}`;
                  },
                },
              },
            },
            animation: {
              animateScale: true,
              animateRotate: true,
              duration: 2000,
              easing: "easeOutQuart",
            },
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }, 800);

      // Aggiungi effetti di scroll reveal
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Osserva tutti gli elementi che devono apparire con lo scroll
      document.querySelectorAll(".categoria, .stat-card").forEach((el) => {
        observer.observe(el);
      });
    });
}
