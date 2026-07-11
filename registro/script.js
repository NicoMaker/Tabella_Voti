// script.js – carica i dati da data.json e gestisce l'interfaccia
(async function () {
  let D;

  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    D = await res.json();
  } catch (err) {
    document.body.innerHTML = `<p style="color:red;padding:2rem;">❌ Errore nel caricamento dei dati: ${err.message}</p>`;
    return;
  }

  // ----- utility -----
  const fmt = (v) =>
    v == null ? "—" : (Math.round(v * 10) / 10).toLocaleString("it-IT");
  const cls = (v) => {
    if (typeof v === "number")
      return v >= 90 ? "hi" : v >= 75 ? "ok" : v >= 60 ? "mid" : "low";
    if (v === "superato") return "sup";
    if (v === "da recuperare") return "rec";
    return "na";
  };
  const chip = (v) => {
    if (v == null) return '<span class="gr na">—</span>';
    if (typeof v === "number")
      return `<span class="gr ${cls(v)}">${fmt(v)}</span>`;
    if (v === "superato") return '<span class="gr hi txt">superato</span>';
    if (v === "da recuperare")
      return '<span class="gr low txt">da recuperare</span>';
    return `<span class="gr na txt">${v}</span>`;
  };
  const nums = (a) => a.filter((x) => typeof x === "number");
  const avg = (a) => {
    const n = nums(a);
    return n.length ? n.reduce((s, x) => s + x, 0) / n.length : null;
  };

  // ----- header stats -----
  document.getElementById("mAgg").textContent = D.meta.aggiornato;
  const classAvg = avg(D.students.map((s) => s.tot.conStage));
  const presAvg = avg(D.students.map((s) => s.pct));
  document.getElementById("stats").innerHTML = [
    [D.meta.allievi, "allievi iscritti"],
    [
      D.meta.oreTot.toLocaleString("it-IT") + " h",
      "ore di corso (" + D.meta.oreMin.toLocaleString("it-IT") + " h minime)",
    ],
    [fmt(presAvg) + "%", "presenza media di classe"],
    [fmt(classAvg), "media finale di classe (con stage)"],
  ]
    .map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`)
    .join("");

  // ----- tabs -----
  document.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((x) => x.setAttribute("aria-selected", x === t));
      document
        .querySelectorAll(".view")
        .forEach((v) =>
          v.classList.toggle("on", v.id === "v-" + t.dataset.view),
        );
    }),
  );

  // ----- allievi view -----
  let sortK = "name",
    sortDir = 1,
    query = "";
  const key = (s) =>
    sortK === "name"
      ? s.name
      : sortK === "pct"
        ? (s.pct ?? -1)
        : sortK === "aula"
          ? typeof s.tot.aula === "number"
            ? s.tot.aula
            : -1
          : sortK === "stage"
            ? typeof s.tot.stage === "number"
              ? s.tot.stage
              : -1
            : typeof s.tot.conStage === "number"
              ? s.tot.conStage
              : -1;

  function strip(s) {
    return (
      '<span class="strip" title="Medie per unità formativa">' +
      s.areas
        .map(
          (a, i) =>
            `<i class="${typeof a.media === "number" ? cls(a.media) : ""}" title="${D.areas[i].name}: ${typeof a.media === "number" ? fmt(a.media) : (a.media ?? "—")}"></i>`,
        )
        .join("") +
      "</span>"
    );
  }

  function renderStudents() {
    const rows = D.students
      .filter((s) => s.name.toLowerCase().includes(query))
      .sort(
        (a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0) * sortDir,
      );
    document.getElementById("sbody").innerHTML = rows
      .map((s) => {
        const low = (s.pct ?? 0) < 80;
        return `<tr class="row" tabindex="0" data-id="${s.id}" aria-expanded="false">
          <td><span class="name">${s.name}</span> <span class="idtag">#${s.id}</span>${s.stato !== "ok" ? ` <span class="badge b-warn">${s.stato}</span>` : ""}</td>
          <td><div class="pres"><div class="pbar"><i class="${low ? "low" : ""}" style="width:${Math.min(100, s.pct ?? 0)}%"></i></div><span class="pv">${fmt(s.pct)}%</span></div></td>
          <td class="hide-m">${strip(s)}</td>
          <td class="num">${chip(s.tot.aula)}</td>
          <td class="num hide-m">${chip(s.tot.stage)}</td>
          <td class="num">${chip(s.tot.conStage)}</td>
        </tr>`;
      })
      .join("");
    document
      .querySelectorAll("#stab th[data-k] .arr")
      .forEach((a) => (a.textContent = ""));
    const th = document.querySelector(`#stab th[data-k="${sortK}"] .arr`);
    if (th) th.textContent = sortDir > 0 ? "↑" : "↓";
  }

  document.getElementById("q").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderStudents();
  });
  document.querySelectorAll("#stab th[data-k]").forEach((th) =>
    th.addEventListener("click", () => {
      const k = th.dataset.k;
      if (sortK === k) sortDir *= -1;
      else {
        sortK = k;
        sortDir = k === "name" ? 1 : -1;
      }
      renderStudents();
    }),
  );

  function detailHTML(s) {
    const t = s.tot;
    const ufs = D.areas
      .map((a, i) => {
        const sa = s.areas[i];
        return `<div class="uf">
          <h4>${a.name}</h4><span class="yr">ANNO ${a.year}</span>
          <ul>${a.subjects.map((m, j) => `<li><span>${m.name}<br><small style="font-size:11px">${m.teacher}</small></span>${chip(sa.grades[j])}</li>`).join("")}</ul>
          <div class="avg"><em>Media UF</em>${chip(sa.media)}</div>
        </div>`;
      })
      .join("");
    return `<td colspan="6"><div class="dwrap">
        <div class="dhead">
          <h3>${s.name}</h3>
          <div class="totline">
            <span>Ore frequentate <b>${fmt(s.ore)} / ${D.meta.oreTot.toLocaleString("it-IT")}</b></span>
            <span>Tecnico‑prof. <b>${fmt(t.tecnico)}</b></span>
            <span>Base e trasversali <b>${fmt(t.base)}</b></span>
            <span>Stage A1 <b>${typeof t.stage1 === "number" ? fmt(t.stage1) : (t.stage1 ?? "—")}</b></span>
            <span>Stage A2 <b>${typeof t.stage2 === "number" ? fmt(t.stage2) : (t.stage2 ?? "—")}</b></span>
            <span>Media percorso <b>${fmt(t.percorso)}</b></span>
            <span>Con stage <b>${fmt(t.conStage)}</b></span>
          </div>
        </div>${ufs}</div></td>`;
  }

  function toggleDetail(tr) {
    const open =
      tr.nextElementSibling &&
      tr.nextElementSibling.classList.contains("detail");
    document.querySelectorAll("tr.detail").forEach((x) => x.remove());
    document
      .querySelectorAll("tr.row")
      .forEach((x) => x.setAttribute("aria-expanded", "false"));
    if (open) return;
    const s = D.students.find((x) => x.id === tr.dataset.id);
    const d = document.createElement("tr");
    d.className = "detail";
    d.innerHTML = detailHTML(s);
    tr.after(d);
    tr.setAttribute("aria-expanded", "true");
  }

  document.getElementById("sbody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr.row");
    if (!tr) return;
    toggleDetail(tr);
  });
  document.getElementById("sbody").addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tr = e.target.closest("tr.row");
    if (!tr) return;
    e.preventDefault();
    toggleDetail(tr);
  });

  // ----- matrice view -----
  (function () {
    const areaTh = D.areas
      .map((a) => `<th colspan="${a.subjects.length + 1}">${a.name}</th>`)
      .join("");
    const subTh = D.areas
      .map(
        (a) =>
          a.subjects.map((m) => `<th>${m.name}</th>`).join("") +
          `<th class="medcol">Media</th>`,
      )
      .join("");
    const cell = (v) =>
      v == null
        ? '<td class="c-na">—</td>'
        : typeof v === "number"
          ? `<td class="c-${cls(v)}">${fmt(v)}</td>`
          : v === "superato"
            ? '<td class="c-hi">sup.</td>'
            : v === "da recuperare"
              ? '<td class="c-low">recup.</td>'
              : `<td class="c-na">${v === "non previsto" ? "n.p." : "n.v."}</td>`;
    const body = D.students
      .map((s) => {
        const cells = D.areas
          .map(
            (a, i) =>
              s.areas[i].grades.map(cell).join("") +
              (s.areas[i].media == null
                ? '<td class="medcol c-na">—</td>'
                : `<td class="medcol c-${cls(s.areas[i].media)}">${typeof s.areas[i].media === "number" ? fmt(s.areas[i].media) : s.areas[i].media}</td>`),
          )
          .join("");
        return `<tr><td class="stick">${s.name}</td>${cells}</tr>`;
      })
      .join("");
    document.getElementById("mwrap").innerHTML = `<table class="mtab">
          <thead>
            <tr class="arow"><th class="stick" rowspan="2" style="background:var(--acc-deep);color:#fff">Allievo</th>${areaTh}</tr>
            <tr class="srow">${subTh}</tr>
          </thead><tbody>${body}</tbody></table>`;
  })();

  // ----- materie view -----
  (function () {
    const cards = D.areas
      .map((a, i) => {
        const rows = a.subjects
          .map((m, j) => {
            const vals = nums(D.students.map((s) => s.areas[i].grades[j]));
            const mean = vals.length
              ? vals.reduce((x, y) => x + y, 0) / vals.length
              : null;
            const ins = vals.filter((v) => v < 60).length;
            const w =
              mean == null
                ? 0
                : Math.max(0, Math.min(100, ((mean - 50) / 50) * 100));
            return `<div class="srow2">
                <div class="sn">${m.name}<small>${m.teacher}${ins ? ` · <span style="color:var(--g-low)">${ins} insuff.</span>` : ""}</small></div>
                <div class="mini"><i style="width:${w}%"></i></div>
                <span class="num">${mean == null ? '<span class="gr na">—</span>' : chip(mean)}</span>
              </div>`;
          })
          .join("");
        return `<div class="scard"><h3>${a.name} <span class="yr" style="font:500 11px var(--mono);color:var(--muted)">· ANNO ${a.year}</span></h3>${rows}</div>`;
      })
      .join("");
    document.getElementById("subgrid").innerHTML = cards;
  })();

  renderStudents();
})();
