const calendarEl = document.getElementById("calendar");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalDate = document.getElementById("modal-date");
const tableBody = document.getElementById("tableBody");
const captureBtn = document.getElementById("captureBtn");
const addSlotBtn = document.getElementById("addSlotBtn");
const removeSlotBtn = document.getElementById("removeSlotBtn");

/* Toolbar / búsqueda / export */
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const searchCountEl = document.getElementById("searchCount");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const importJsonBtn = document.getElementById("importJsonBtn");
const importFileInput = document.getElementById("importFileInput");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

/* Horas sugeridas según índice de slot (auto-fill si vacío) */
const horasSugeridas = ["09:00", "12:00", "15:00", "18:00", "21:00"];

/* Generar contenido aleatorio sin repetir unidad/formato en el mismo día si es posible */
function generateRandomSlot(existingRows = []) {
  const usedUnits = existingRows.map(r => r.unidad).filter(Boolean);
  const usedFormats = existingRows.map(r => r.formato).filter(Boolean);

  // Seleccionar unidad
  const availableUnits = unidades.filter(u => !usedUnits.includes(u));
  const poolU = availableUnits.length > 0 ? availableUnits : unidades;
  const unidad = poolU[Math.floor(Math.random() * poolU.length)];

  // Seleccionar formato basado en la unidad elegida (según condiciones específicas)
  const formatosPermitidos = formatosPorUnidad[unidad] || formatos;
  const availableFormats = formatosPermitidos.filter(f => !usedFormats.includes(f));
  
  // Si no quedan formatos permitidos sin usar, usamos cualquiera de los permitidos para esa unidad
  const poolF = availableFormats.length > 0 ? availableFormats : formatosPermitidos;
  const formato = poolF[Math.floor(Math.random() * poolF.length)];

  return { unidad, formato };
}

/* Día actualmente abierto en el modal */
let currentKey = null;

const unidades = [
  "Soy Marcus","Lemora","Hola Mundo Store","Vida Freelance",
  "Code Injection", /* "Academia WP", "Gato Negro" */ "Twitch"
];

const formatos = [
  "CapCut","Carrusel","Memes","Stream",
  "Green Screen","Vlog","FYP","Comentarios",
  "Trend", "Podcast", "Proyectos-IA", "Portfolio"
];

const formatosPorUnidad = {
  "Soy Marcus": formatos.filter(f => f !== "Carrusel" && f !== "Podcast"),
  "Lemora": ["CapCut", "Carrusel", "Comentarios", "Portfolio"],
  "Hola Mundo Store": ["Carrusel", "Stream", "Green Screen", "FYP", "Comentarios", "Trend"],
  "Vida Freelance": ["Carrusel", "Vlog", "Comentarios", "Podcast"],
  "Code Injection": ["Memes", "Stream", "Green Screen", "FYP", "Comentarios", "Proyectos-IA", "Portfolio"],
  "Academia WP": ["CapCut", "Carrusel", "Stream", "Comentarios", "Portfolio"],
  "Gato Negro": ["Carrusel", "Stream", "FYP", "Comentarios"],
  "Twitch": ["Stream", "Comentarios", "FYP"]
};

const redes = ["Instagram","TikTok","Shorts","YouTube","LinkedIn","X"];

/* STORAGE */
function getKey(date) {
  return date.toISOString().split("T")[0];
}

function getData() {
  return JSON.parse(localStorage.getItem("planner2026") || "{}");
}

function saveData(data) {
  localStorage.setItem("planner2026", JSON.stringify(data));
}

/* CALENDAR */
function generateCalendar() {
  const weekdayLabels = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

  for (let m = 0; m < 12; m++) {
    const month = document.createElement("div");
    month.className = "month";

    const name = new Date(2026, m).toLocaleString("es", { month: "long" });
    month.innerHTML = `<h3>${name}</h3>`;

    // Cabecera de días de la semana
    const weekdays = document.createElement("div");
    weekdays.className = "weekdays";
    weekdayLabels.forEach(label => {
      const wd = document.createElement("div");
      wd.className = "weekday";
      wd.textContent = label;
      weekdays.appendChild(wd);
    });
    month.appendChild(weekdays);

    const days = document.createElement("div");
    days.className = "days";

    // Offset: calcular qué día de la semana es el 1 del mes
    // getDay() -> 0=Dom, 1=Lun, ..., 6=Sab
    // Queremos que la semana empiece en Lunes, así que:
    // Lun=0, Mar=1, Mie=2, Jue=3, Vie=4, Sab=5, Dom=6
    const firstDayJS = new Date(2026, m, 1).getDay();
    const offset = (firstDayJS + 6) % 7;

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      days.appendChild(empty);
    }

    const total = new Date(2026, m + 1, 0).getDate();

    for (let d = 1; d <= total; d++) {
      const el = document.createElement("div");
      el.className = "day";

      const date = new Date(2026, m, d);
      const key = getKey(date);
      el.dataset.key = key;

      // Número del día
      const num = document.createElement("span");
      num.className = "day-num";
      num.textContent = d;
      el.appendChild(num);

      // Badge con cantidad de slots completos
      const badge = document.createElement("span");
      badge.className = "day-badge";
      el.appendChild(badge);

      el.onclick = () => openDay(date);

      updateDayStatus(el);

      days.appendChild(el);
    }

    month.appendChild(days);
    calendarEl.appendChild(month);
  }
}

/* DAY STATUS (color-coded calendar) */
function getDayStatus(key) {
  const data = getData();
  const rows = data[key] || [];
  // Slot "completo" = tiene al menos unidad + formato + redes
  const completos = rows.filter(r =>
    r && r.unidad && r.formato && Array.isArray(r.redes) && r.redes.length > 0
  ).length;

  if (completos === 0) return { level: "empty", count: 0 };
  if (completos <= 2) return { level: "partial", count: completos };
  return { level: "full", count: completos };
}

function updateDayStatus(dayEl) {
  if (!dayEl || !dayEl.dataset.key) return;
  const { level, count } = getDayStatus(dayEl.dataset.key);

  dayEl.classList.remove("partial", "full");
  if (level !== "empty") dayEl.classList.add(level);

  const badge = dayEl.querySelector(".day-badge");
  if (badge) badge.textContent = count > 0 ? count : "";
}

function refreshCurrentDay() {
  if (!currentKey) return;
  const el = calendarEl.querySelector(`.day[data-key="${currentKey}"]`);
  if (el) updateDayStatus(el);
}

/* MODAL */
function openDay(date) {
  modal.classList.remove("hidden");
  const key = getKey(date);
  currentKey = key;
  modalDate.textContent = key;
  renderTable(key);
}

closeModal.onclick = () => {
  modal.classList.add("hidden");
  refreshCurrentDay();
  currentKey = null;
};

/* TABLE */
function renderTable(key) {
  tableBody.innerHTML = "";
  const data = getData();
  // Si no hay datos previos, iniciar con 1 slot aleatorio
  const rows = data[key] && data[key].length ? data[key] : [generateRandomSlot([])];
  const total = Math.max(rows.length, 1);

  for (let i = 0; i < total; i++) {
    const row = rows[i] || {};
    // Hora sugerida según índice si viene vacía
    const horaValor = row.hora || horasSugeridas[i] || "";
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="time" step="1800" list="timePresets" value="${horaValor}"></td>
      <td>${selectHTML(unidades, row.unidad)}</td>
      <td>${selectHTML(formatos, row.formato, true)}</td>
      <td>${checkboxHTML(row.redes || [])}</td>
      <td><input type="number" min="0" value="${row.likes || ""}"></td>
      <td><input type="number" min="0" value="${row.alcance || ""}"></td>
      <td><textarea>${row.comentarios || ""}</textarea></td>
    `;

    tr.onchange = () => saveRow(key);

    tableBody.appendChild(tr);

    // aplicar color inicial formato
    applyFormatColor(tr.querySelectorAll("select")[1]);
  }

  updateSlotButtons(total);
}

/* SLOT DINÁMICO (add / remove) */
function updateSlotButtons(total) {
  if (!removeSlotBtn) return;
  removeSlotBtn.disabled = total <= 1;
  removeSlotBtn.style.opacity = total <= 1 ? "0.4" : "1";
  removeSlotBtn.style.cursor = total <= 1 ? "not-allowed" : "pointer";

  if (addSlotBtn) {
    addSlotBtn.disabled = total >= 5;
    addSlotBtn.style.opacity = total >= 5 ? "0.4" : "1";
    addSlotBtn.style.cursor = total >= 5 ? "not-allowed" : "pointer";
  }
}

function addSlot() {
  if (!currentKey) return;
  const data = getData();
  // Si el día está vacío, generamos el primero y luego el nuevo, ambos al azar
  const rows = data[currentKey] && data[currentKey].length 
    ? [...data[currentKey]] 
    : [generateRandomSlot([])];
  if (rows.length >= 5) return;
  rows.push(generateRandomSlot(rows));
  data[currentKey] = rows;
  saveData(data);
  renderTable(currentKey);
}

function removeSlot() {
  if (!currentKey) return;
  const data = getData();
  const rows = data[currentKey] && data[currentKey].length 
    ? [...data[currentKey]] 
    : [generateRandomSlot([])];
  if (rows.length <= 1) return;
  rows.pop();
  data[currentKey] = rows;
  saveData(data);
  renderTable(currentKey);
}

if (addSlotBtn) addSlotBtn.onclick = addSlot;
if (removeSlotBtn) removeSlotBtn.onclick = removeSlot;

/* SELECT */
function selectHTML(options, selected, isFormat = false) {
  return `
    <select class="${isFormat ? "format-select" : ""}">
      ${options.map(opt => `
        <option value="${opt}" ${opt === selected ? "selected" : ""}>
          ${opt}
        </option>
      `).join("")}
    </select>
  `;
}

/* REDES */
function checkboxHTML(selected) {
    return `
      <div class="checkbox-group">
        ${redes.map(r => `
          <label title="${r}">
            <input type="checkbox" value="${r}" ${selected.includes(r) ? "checked" : ""}>
            <i class="${getIconClass(r)}"></i>
          </label>
        `).join("")}
      </div>
    `;
  }

  function getIconClass(red) {
    const map = {
      "Instagram": "fa-brands fa-instagram",
      "TikTok": "fa-brands fa-tiktok",
      "Shorts": "fa-brands fa-square-youtube",   // no hay icono oficial Shorts
      "YouTube": "fa-brands fa-youtube",
      "LinkedIn": "fa-brands fa-linkedin",
      "X": "fa-brands fa-x-twitter"
    };
  
    return map[red] || "fa-solid fa-circle";
  }


/* SAVE */
function saveRow(key) {
  const data = getData();
  data[key] = [];

  const trs = tableBody.querySelectorAll("tr");

  trs.forEach(tr => {
    const hora = tr.querySelector('input[type="time"]').value;
    const selects = tr.querySelectorAll("select");

    const unidad = selects[0].value;
    const formato = selects[1].value;

    const redesChecked = [...tr.querySelectorAll('input[type="checkbox"]:checked')]
      .map(c => c.value);

    const numbers = tr.querySelectorAll('input[type="number"]');

    const likes = numbers[0].value;
    const alcance = numbers[1].value;

    const comentarios = tr.querySelector("textarea").value;

    data[key].push({
      hora,
      unidad,
      formato,
      redes: redesChecked,
      likes,
      alcance,
      comentarios
    });

    applyFormatColor(selects[1]);
  });

  saveData(data);
  refreshCurrentDay();
}

/* COLOR FORMATO */
function applyFormatColor(select) {
  const value = select.value.toLowerCase().replace(" ", "");
  select.className = "format-select format-" + value;
}

/* EVENT GLOBAL */
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("format-select")) {
    applyFormatColor(e.target);
  }
});

/* CAPTURA */
captureBtn.onclick = () => {
  const area = document.getElementById("captureArea");

  html2canvas(area, {
    backgroundColor: "#1a1d24",
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "planner.png";
    link.href = canvas.toDataURL();
    link.click();
  });
};

/* =========================================================
   BÚSQUEDA GLOBAL
   ========================================================= */
function searchPlanner(term) {
  const q = (term || "").trim().toLowerCase();
  const days = calendarEl.querySelectorAll(".day[data-key]");

  // Limpiar estado previo
  days.forEach(d => d.classList.remove("search-match", "search-dim"));

  if (!q) {
    clearSearchBtn.classList.add("hidden");
    searchCountEl.textContent = "";
    return;
  }

  clearSearchBtn.classList.remove("hidden");

  const data = getData();
  let matches = 0;
  let firstMatch = null;

  days.forEach(dayEl => {
    const key = dayEl.dataset.key;
    const rows = data[key] || [];

    const hit = rows.some(r => {
      if (!r) return false;
      const haystack = [
        r.unidad, r.formato, r.comentarios,
        ...(Array.isArray(r.redes) ? r.redes : [])
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });

    if (hit) {
      dayEl.classList.add("search-match");
      matches++;
      if (!firstMatch) firstMatch = dayEl;
    } else {
      dayEl.classList.add("search-dim");
    }
  });

  searchCountEl.textContent = matches
    ? `${matches} día${matches === 1 ? "" : "s"}`
    : "Sin resultados";

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function clearSearch() {
  searchInput.value = "";
  searchPlanner("");
  searchInput.focus();
}

if (searchInput) {
  let tId;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(tId);
    tId = setTimeout(() => searchPlanner(e.target.value), 200);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") clearSearch();
  });
}

if (clearSearchBtn) clearSearchBtn.onclick = clearSearch;

/* =========================================================
   EXPORT / IMPORT JSON
   ========================================================= */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function timestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function exportJSON() {
  const data = getData();
  const payload = {
    app: "planner2026",
    exportedAt: new Date().toISOString(),
    data
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  downloadBlob(blob, `planner2026-backup-${timestamp()}.json`);
}

function importJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const payload = parsed && parsed.data ? parsed.data : parsed;

      if (typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("Formato inválido");
      }

      const current = getData();
      const hasData = Object.keys(current).length > 0;

      let merged = payload;
      if (hasData) {
        const replace = confirm(
          "Ya tenés datos guardados.\n\n" +
          "Aceptar = REEMPLAZAR todo con el archivo importado.\n" +
          "Cancelar = COMBINAR (el archivo pisa los días en conflicto)."
        );
        merged = replace ? payload : { ...current, ...payload };
      }

      saveData(merged);
      // Refrescar colores de todos los días visibles
      calendarEl.querySelectorAll(".day[data-key]").forEach(updateDayStatus);
      alert("Importación completada ✅");
    } catch (err) {
      alert("Error al importar: " + err.message);
    }
  };
  reader.readAsText(file);
}

if (exportJsonBtn) exportJsonBtn.onclick = exportJSON;
if (importJsonBtn) importJsonBtn.onclick = () => importFileInput && importFileInput.click();
if (importFileInput) {
  importFileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    importJSON(file);
    e.target.value = ""; // permitir reimportar mismo archivo
  });
}

/* =========================================================
   EXPORT CSV
   ========================================================= */
function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n;]/.test(s) ? `"${s}"` : s;
}

function exportCSV() {
  const data = getData();
  const headers = ["fecha", "hora", "unidad", "formato", "redes", "likes", "alcance", "comentarios"];
  const lines = [headers.join(",")];

  const keys = Object.keys(data).sort();
  keys.forEach(key => {
    const rows = data[key] || [];
    rows.forEach(r => {
      if (!r) return;
      lines.push([
        key,
        r.hora || "",
        r.unidad || "",
        r.formato || "",
        Array.isArray(r.redes) ? r.redes.join("|") : "",
        r.likes || "",
        r.alcance || "",
        r.comentarios || ""
      ].map(csvEscape).join(","));
    });
  });

  // BOM para Excel + UTF-8
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8"
  });
  downloadBlob(blob, `planner2026-${timestamp()}.csv`);
}

if (exportCsvBtn) exportCsvBtn.onclick = exportCSV;

/* =========================================================
   EXPORT PDF (multi-página, texto estructurado con jsPDF)
   ========================================================= */
function exportPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF aún no se cargó. Intentá de nuevo en unos segundos.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  const data = getData();
  const keys = Object.keys(data).sort().filter(k => (data[k] || []).some(r =>
    r && (r.unidad || r.formato || (r.redes && r.redes.length) || r.comentarios)
  ));

  // Portada
  doc.setFillColor(15, 17, 21);
  doc.rect(0, 0, pageW, pageH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Planner 2026", margin, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(138, 144, 161);
  doc.text(`Exportado: ${new Date().toLocaleString("es-AR")}`, margin, 145);
  doc.text(`Total de días con contenido: ${keys.length}`, margin, 163);

  if (keys.length === 0) {
    doc.setTextColor(255, 255, 255);
    doc.text("No hay días con contenido cargado.", margin, 220);
    doc.save(`planner2026-${timestamp()}.pdf`);
    return;
  }

  // Páginas por día
  keys.forEach((key) => {
    doc.addPage();
    y = margin;

    // Header del día
    doc.setFillColor(26, 29, 36);
    doc.rect(0, 0, pageW, 60, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(key, margin, 38);

    y = 90;
    const rows = data[key] || [];

    rows.forEach((r, i) => {
      if (!r) return;
      const hasContent = r.unidad || r.formato || (r.redes && r.redes.length) || r.comentarios;
      if (!hasContent) return;

      // Salto de página si queda poco espacio
      if (y > pageH - 120) {
        doc.addPage();
        y = margin;
      }

      // Caja del slot
      doc.setDrawColor(58, 63, 79);
      doc.setFillColor(35, 39, 51);
      doc.roundedRect(margin, y, pageW - margin * 2, 90, 6, 6, "FD");

      doc.setTextColor(79, 140, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`SLOT ${i + 1}${r.hora ? "  ·  " + r.hora : ""}`, margin + 12, y + 18);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(r.unidad || "—", margin + 12, y + 36);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 210);
      doc.setFontSize(10);
      const redesTxt = Array.isArray(r.redes) ? r.redes.join(" · ") : "";
      doc.text(
        `${r.formato || "—"}${redesTxt ? "  |  " + redesTxt : ""}`,
        margin + 12, y + 52
      );

      // Métricas
      doc.setTextColor(138, 144, 161);
      doc.setFontSize(9);
      const metricas = [];
      if (r.likes) metricas.push(`♥ ${r.likes}`);
      if (r.alcance) metricas.push(`↗ ${r.alcance}`);
      if (metricas.length) doc.text(metricas.join("   "), margin + 12, y + 68);

      // Comentarios
      if (r.comentarios) {
        doc.setTextColor(180, 180, 190);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(r.comentarios, pageW - margin * 2 - 24);
        const firstLine = lines.slice(0, 1).join(" ");
        doc.text(firstLine + (lines.length > 1 ? "…" : ""), margin + 12, y + 82);
      }

      y += 100;
    });

    // Footer número de página
    doc.setTextColor(100, 100, 110);
    doc.setFontSize(9);
    const pageNum = doc.internal.getNumberOfPages();
    doc.text(`Página ${pageNum}`, pageW - margin, pageH - 20, { align: "right" });
  });

  doc.save(`planner2026-${timestamp()}.pdf`);
}

if (exportPdfBtn) exportPdfBtn.onclick = exportPDF;

/* =========================================================
   SERVICE WORKER (PWA)
   ========================================================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("SW no registrado:", err);
    });
  });
}

/* INIT */
generateCalendar();
