document.addEventListener("DOMContentLoaded", () => {
  fetch("dati.json")
    .then((response) => response.json())
    .then((data) => {
      const app = document.getElementById("app");
      const container = document.getElementById("categorie-container");
      const toggleButtons = document.getElementById("toggle-buttons");
      const chartCanvas = document
        .getElementById("categorie-chart")
        .getContext("2d");
      const mediaTotale = document.getElementById("media-totale");

      let totalCategorie = 0;
      let sommaCategorie = 0;

      data.categorie.forEach((categoria, index) => {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "categoria";
        categoriaDiv.id = `categoria-${index}`;

        const titolo = document.createElement("h3");
        titolo.textContent = categoria.nome;
        categoriaDiv.appendChild(titolo);

        const lista = document.createElement("ul");
        let somma = 0;
        let contatore = 0;

        categoria.materie.forEach((materia) => {
          const li = document.createElement("li");
          li.className = "materia";
          const voto = materia.voto !== null ? materia.voto : "N/A";
          li.innerHTML = `<span>${materia.nome}:</span> ${voto}`;
          lista.appendChild(li);

          if (materia.voto !== null) {
            somma += materia.voto;
            contatore++;
          }
        });

        categoriaDiv.appendChild(lista);

        const media = contatore > 0 ? (somma / contatore).toFixed(2) : "N/A";
        const mediaDiv = document.createElement("div");
        mediaDiv.className = "media-categoria";
        mediaDiv.textContent = `Media Categoria: ${media}`;
        categoriaDiv.appendChild(mediaDiv);

        if (media !== "N/A") {
          sommaCategorie += parseFloat(media);
          totalCategorie++;

          const canvas = document.createElement("canvas");
          categoriaDiv.appendChild(canvas);
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
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: `Grafico ${categoria.nome}`,
                },
              },
            },
          });
        }

        container.appendChild(categoriaDiv);

        // Bottone toggle
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-btn";
        toggleBtn.textContent = categoria.nome;
        toggleBtn.addEventListener("click", () => {
          categoriaDiv.classList.toggle("hidden");
          toggleBtn.classList.toggle("active");
        });
        toggleButtons.appendChild(toggleBtn);
      });

      const mediaFinale =
        totalCategorie > 0
          ? (sommaCategorie / totalCategorie).toFixed(2)
          : "N/A";
      mediaTotale.textContent = mediaFinale;

      // Media materie globali
      let sommaVoti = 0;
      let numVoti = 0;

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
      const mediaMaterieDiv = document.createElement("div");
      mediaMaterieDiv.className = "media-categoria";
      mediaMaterieDiv.textContent = `Media Totale Materie: ${mediaMaterie}`;
      app.appendChild(mediaMaterieDiv);

      // Grafico generale
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
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Media generale per categoria",
            },
          },
        },
      });
    });
});
