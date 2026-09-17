const storageKey = "forest-lms-state";
const defaultState = { progress: 68, completed: 4, certificates: 2, enrolled: [], drivers: [], attendance: [], certificateRecords: [], manualCharts: { attendance: { "NEOP": { target: 38, hadir: 36 }, "Refresh Training": { target: 24, hadir: 22 }, "Insidental Training": { target: 18, hadir: 16 }, "Development Training": { target: 16, hadir: 15 } } } };
const monthlyParticipants = [42, 58, 51, 74, 68, 83, 91, 87, 96, 0, 0, 0];

const state = { ...defaultState, ...(JSON.parse(localStorage.getItem(storageKey) || "{}")) };
state.attendance = Array.isArray(state.attendance) ? state.attendance : [];
state.certificateRecords = Array.isArray(state.certificateRecords) ? state.certificateRecords : [];
state.manualCharts = state.manualCharts && typeof state.manualCharts === "object" ? state.manualCharts : {};
state.manualCharts.targets = state.manualCharts.targets && typeof state.manualCharts.targets === "object" ? state.manualCharts.targets : {};
const toast = document.querySelector("#toast");
let toastTimer;
let editingCertificateIndex = null;

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateTargetLine(chartSelector, lineSelector, targets, trackSelector = ".bar-track") {
  const chart = document.querySelector(chartSelector);
  const line = document.querySelector(lineSelector);
  if (!chart || !line) return;
  const chartRect = chart.getBoundingClientRect();
  if (!chartRect.width || !chartRect.height) return;
  const overlay = line.closest("svg");
  overlay.setAttribute("viewBox", `0 0 ${chart.clientWidth} ${chart.clientHeight}`);
  overlay.setAttribute("width", chart.clientWidth);
  overlay.setAttribute("height", chart.clientHeight);
  const tracks = [...chart.querySelectorAll(trackSelector)];
  const points = tracks.map((track, index) => {
    const rect = track.getBoundingClientRect();
    const target = Number(targets[index] ?? 75);
    return `${rect.left + rect.width / 2 - chartRect.left},${rect.bottom - (Math.min(100, target) / 100) * rect.height - chartRect.top}`;
  }).join(" ");
  line.setAttribute("points", points);
  const labels = [...overlay.querySelectorAll(".target-value-label")];
  const pointValues = points.split(" ").map((point) => point.split(",").map(Number));
  pointValues.forEach(([x, y], index) => {
    const label = labels[index] || document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.classList.add("target-value-label");
    label.setAttribute("x", x);
    label.setAttribute("y", Math.max(12, y - 6));
    label.textContent = String(Number(targets[index] ?? 75));
    if (!labels[index]) overlay.appendChild(label);
  });

}

window.addEventListener("resize", () => {
  updateTargetLine("#courses .bar-chart", "#programTargetLine", Object.values(state.manualCharts.targets.programs || {}));
  updateTargetLine("#progress .bar-chart", "#activityTargetLine", Object.values(state.manualCharts.targets.activities || {}));
  updateTargetLine("#monthlyChart", "#monthlyTargetLine", state.manualCharts.targets.monthly || [], ".month-bar");
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function render() {
  const checkIns = state.attendance.filter((record) => record.attendanceType === "In");
  const monthlyTotals = (state.manualCharts.monthly || monthlyParticipants).map((value, index) => value + (state.manualCharts.monthly ? 0 : checkIns.filter((record) => new Date(record.createdAt).getMonth() === index && new Date(record.createdAt).getFullYear() === new Date().getFullYear()).length));
  const programDefaults = { NEOP: 86, "Refresh Training": 72, "Insidental Training": 48, "Development Training": 64 };
  const programBase = state.manualCharts.programs || programDefaults;
  const activityDefaults = { Coaching: 58, "Dojo Express Campaign": 76, "Observasi Lapangan": 43 };
  const activities = state.manualCharts.activities || activityDefaults;
  const programTargets = state.manualCharts.targets.programs || {};
  const activityTargets = state.manualCharts.targets.activities || {};
  const monthlyTargets = state.manualCharts.targets.monthly || [];
  const programIds = { NEOP: "Neop", "Refresh Training": "Refresh", "Insidental Training": "Insidental", "Development Training": "Development" };
  const attendanceManual = state.manualCharts.attendance || {};
  const trainingDetails = [
    { name: "NEOP", participants: attendanceManual["NEOP"]?.target ?? 38, attendance: attendanceManual["NEOP"]?.hadir ?? 36, completion: 0, status: "On track" },
    { name: "Refresh Training", participants: attendanceManual["Refresh Training"]?.target ?? 24, attendance: attendanceManual["Refresh Training"]?.hadir ?? 22, completion: 0, status: "On track" },
    { name: "Insidental Training", participants: attendanceManual["Insidental Training"]?.target ?? 18, attendance: attendanceManual["Insidental Training"]?.hadir ?? 16, completion: 0, status: "Perlu perhatian" },
    { name: "Development Training", participants: attendanceManual["Development Training"]?.target ?? 16, attendance: attendanceManual["Development Training"]?.hadir ?? 15, completion: 0, status: "On track" }
  ].map((training) => ({ ...training, completion: training.participants ? Math.round((training.attendance / training.participants) * 100) : 0, status: training.completion >= 100 ? "OK (Close)" : "Perlu Perhatian" }));
  Object.entries(programBase).forEach(([program, base]) => {
    const value = state.manualCharts.programs ? base : base + checkIns.filter((record) => record.program === program).length;
    const id = programIds[program];
    const target = Number(programTargets[program] ?? 75);
    const valueLabel = document.querySelector(`#programValue${id}`);
    const bar = document.querySelector(`#programBar${id}`);
    valueLabel.textContent = value;
    bar.style.height = `${Math.min(100, value)}%`;
    setBarStatus(valueLabel, bar, value, target);
  });
  Object.entries(activities).forEach(([activity, value]) => {
    const id = activity === "Coaching" ? "Coaching" : activity === "Dojo Express Campaign" ? "Dojo" : "Observasi";
    const target = Number(activityTargets[activity] ?? 75);
    const valueLabel = document.querySelector(`#activityValue${id}`);
    const bar = document.querySelector(`#activityBar${id}`);
    valueLabel.textContent = value;
    bar.style.height = `${Math.min(100, value)}%`;
    setBarStatus(valueLabel, bar, value, target);
  });
  Object.entries(programIds).forEach(([program, id]) => {
    const target = Number(programTargets[program] ?? 75);
    const marker = document.querySelector(`#programTarget${id}`);
    marker.style.bottom = `${Math.min(100, target)}%`;
    marker.title = `Target ${target}`;
  });
  updateTargetLine("#courses .bar-chart", "#programTargetLine", Object.entries(programIds).map(([program]) => Number(programTargets[program] ?? 75)));
  updateTargetLine("#progress .bar-chart", "#activityTargetLine", Object.entries({ Coaching: "Coaching", "Dojo Express Campaign": "Dojo", "Observasi Lapangan": "Observasi" }).map(([activity]) => Number(activityTargets[activity] ?? 75)));
  Object.entries({ Coaching: "Coaching", "Dojo Express Campaign": "Dojo", "Observasi Lapangan": "Observasi" }).forEach(([activity, id]) => {
    const target = Number(activityTargets[activity] ?? 75);
    const marker = document.querySelector(`#activityTarget${id}`);
    marker.style.bottom = `${Math.min(100, target)}%`;
    marker.title = `Target ${target}`;
  });
  const programValues = Object.entries(programBase).map(([program, base]) => ({
    name: program,
    value: state.manualCharts.programs ? base : base + checkIns.filter((record) => record.program === program).length
  }));
  const pieColors = ["#2a7c13", "#76c457", "#8c7ee8", "#f59e0b"];
  const totalProgramParticipants = programValues.reduce((total, item) => total + item.value, 0);
  const participantGradient = programValues.reduce((segments, item, index) => {
    const start = segments.end;
    const end = start + (item.value / totalProgramParticipants) * 100;
    segments.parts.push(`${pieColors[index]} ${start}% ${end}%`);
    segments.end = end;
    return segments;
  }, { parts: [], end: 0 }).parts.join(", ");
  document.querySelector("#programShareChart").innerHTML = `
    <div class="pie-visual" style="background:conic-gradient(${participantGradient})"><b>${totalProgramParticipants}</b><small>Peserta<br>Per kategori</small></div>
    <div class="pie-legend">${programValues.map((item, index) => `<div><i style="background:${pieColors[index]}"></i><span>${item.name}</span><strong>${Math.round((item.value / totalProgramParticipants) * 100)}%</strong></div>`).join("")}</div>
  `;
  document.querySelector("#progressMetric").firstChild.textContent = `${state.progress}%`;
  document.querySelector("#metricProgressBar").style.width = `${state.progress}%`;
  document.querySelector("#completedMetric").firstChild.textContent = state.completed;
  document.querySelector("#annualParticipantsMetric").textContent = monthlyTotals.reduce((total, value) => total + value, 0);
  const maxParticipants = Math.max(...monthlyTotals);
  document.querySelector("#monthlyChart").innerHTML = `<svg class="target-line-overlay" aria-hidden="true" preserveAspectRatio="none"><polyline id="monthlyTargetLine"></polyline></svg>${monthlyTotals.map((value, index) => `
    <div class="month-bar" title="${value ? `${value} peserta` : "Belum ada data"}">
      <span class="${value >= Number(monthlyTargets[index] ?? 75) ? "bar-above-target" : "bar-below-target"}" style="height:${value ? (value / maxParticipants) * 100 : 3}%;background:${value >= Number(monthlyTargets[index] ?? 75) ? "linear-gradient(180deg,#4ade80,#15803d)" : "linear-gradient(180deg,#f87171,#b91c1c)"}"></span>
      <i class="category-target" style="bottom:${Math.min(100, Number(monthlyTargets[index] ?? 75))}%" title="Target ${Number(monthlyTargets[index] ?? 75)}"></i>
      <b class="${value >= Number(monthlyTargets[index] ?? 75) ? "value-above-target" : "value-below-target"}">${value || "-"}</b>
    </div>
  `).join("")}`;
  document.querySelectorAll("#monthlyChart .month-bar").forEach((bar) => {
    const valueBar = bar.querySelector("span");
    const valueLabel = bar.querySelector("b");
    const barRect = valueBar.getBoundingClientRect();
    const containerRect = bar.getBoundingClientRect();
    valueLabel.style.bottom = `${containerRect.bottom - barRect.top + 4}px`;
  });
  updateTargetLine("#monthlyChart", "#monthlyTargetLine", monthlyTargets, ".month-bar");
  document.querySelector("#trainingDetailTable").innerHTML = trainingDetails.map((training) => `
    <tr><td><strong>${training.name}</strong></td><td>${training.participants}</td><td>${training.attendance}</td><td><div class="table-progress"><span style="width:${training.completion}%"></span></div><b>${training.completion}%</b></td><td><span class="status-badge ${training.status === "OK (Close)" ? "status-good" : "status-warning"}">${training.status}</span></td></tr>
  `).join("");
  const attendanceListBody = document.querySelector("#attendanceListBody");
  if (attendanceListBody) {
    attendanceListBody.innerHTML = state.attendance.length ? [...state.attendance].reverse().map((record, index) => `
      <tr><td>${state.attendance.length - index}</td><td><strong>${escapeHtml(record.participantName)}</strong></td><td>${escapeHtml(record.nik)}</td><td>${escapeHtml(record.program)}</td><td><span class="status-badge ${record.attendanceType === "In" ? "status-good" : "status-warning"}">${escapeHtml(record.attendanceType)}</span></td><td>${new Date(record.createdAt).toLocaleString("id-ID")}</td></tr>
    `).join("") : '<tr><td colspan="6" class="empty-state">Belum ada data absensi.</td></tr>';
  }
  const certificateListBody = document.querySelector("#certificateListBody");
  const certificateCount = document.querySelector("#certificateCount");
  if (certificateListBody) {
    certificateCount.textContent = `${state.certificateRecords.length} data`;
    certificateListBody.innerHTML = state.certificateRecords.length ? state.certificateRecords.map((record, index) => `
      <tr><td>${index + 1}</td><td><strong>${escapeHtml(record.employeeName)}</strong></td><td>${escapeHtml(record.position)}</td><td>${escapeHtml(record.certificate)}</td><td>${escapeHtml(record.validityPeriod ? `${record.validityPeriod} tahun` : "-")}</td><td>${escapeHtml(record.expiredDate)}</td><td>${certificateWarning(record.expiredDate)}</td><td>${escapeHtml(record.others || "-")}</td><td><button class="text-button edit-certificate-button" type="button" data-index="${index}">Edit</button><button class="text-button delete-certificate-button" type="button" data-index="${index}">Hapus</button></td></tr>
    `).join("") : '<tr><td colspan="9" class="empty-state">Belum ada data karyawan bersertifikat.</td></tr>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function remainingCertificateDays(expiredDate) {
  const expiry = new Date(`${expiredDate}T00:00:00`);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!expiredDate || Number.isNaN(expiry.getTime())) return null;
  return Math.ceil((expiry - startOfToday) / 86400000);
}

function certificateWarning(expiredDate) {
  const days = remainingCertificateDays(expiredDate);
  if (days === null) return '<span class="status-badge status-warning">Tanggal tidak valid</span>';
  if (days < 0) return `<span class="status-badge status-warning">Expired ${Math.abs(days)} hari</span>`;
  if (days <= 30) return `<span class="status-badge status-warning">Sisa ${days} hari</span>`;
  return `<span class="status-badge status-good">Sisa ${days} hari</span>`;
}

function certificateWarningText(expiredDate) {
  const days = remainingCertificateDays(expiredDate);
  if (days === null) return "Tanggal tidak valid";
  return days < 0 ? `Expired ${Math.abs(days)} hari` : `Sisa ${days} hari`;
}

function setBarStatus(valueLabel, bar, value, target) {
 const aboveTarget = value >= target;
 valueLabel.classList.toggle("value-above-target", aboveTarget);
 valueLabel.classList.toggle("value-below-target", !aboveTarget);
 bar.classList.toggle("bar-above-target", aboveTarget);
 bar.classList.toggle("bar-below-target", !aboveTarget);
 bar.style.background = aboveTarget
   ? "linear-gradient(180deg,#4ade80,#15803d)"
   : "linear-gradient(180deg,#f87171,#b91c1c)";
 const track = bar.closest(".bar-track");
 const item = bar.closest(".bar-item");
 if (track && item) {
   const trackHeight = track.getBoundingClientRect().height;
   const itemRect = item.getBoundingClientRect();
   const trackRect = track.getBoundingClientRect();
   const filledHeight = trackHeight * Math.min(100, Math.max(0, value)) / 100;
   valueLabel.style.bottom = `${itemRect.bottom - trackRect.bottom + filledHeight + 3}px`;
 }
}

function renderBarcode(record) {
  const payload = `${record.participantName}|${record.nik}|${record.program}|${record.attendanceType}|${record.createdAt}`;
  const pattern = [...payload].flatMap((character) => character.charCodeAt(0).toString(2).padStart(8, "0").split("").map(Number));
  const bars = pattern.map((bit) => `<span style="width:${bit ? 3 : 1}px;background:${bit ? "#111827" : "#fff"}"></span>`).join("");
  document.querySelector("#barcodeResult").innerHTML = `
    <div class="barcode-card">
      <h3>Barcode Absen ${escapeHtml(record.attendanceType)}</h3>
      <div class="barcode-bars" aria-label="Barcode absensi">${bars}</div>
      <div class="barcode-meta"><span><strong>Nama:</strong> ${escapeHtml(record.participantName)}</span><span><strong>NIK:</strong> ${escapeHtml(record.nik)}</span><span><strong>Program:</strong> ${escapeHtml(record.program)}</span></div>
      <small class="barcode-code">${escapeHtml(payload)}</small>
    </div>`;
}

const attendanceForm = document.querySelector("#attendanceForm");
function renderAttendanceQr() {
  const qrTarget = document.querySelector("#attendanceQrCode");
  if (!qrTarget || typeof QRCode === "undefined") return;
  const mobileUrl = `${window.location.origin}${window.location.pathname}#attendance-mobile`;
  qrTarget.innerHTML = "";
  new QRCode(qrTarget, { text: mobileUrl, width: 190, height: 190, colorDark: "#111827", colorLight: "#ffffff" });
  document.querySelector("#attendanceQrUrl").textContent = mobileUrl;
}

if (window.location.hash === "#attendance-mobile") document.body.classList.add("mobile-attendance");
renderAttendanceQr();
if (attendanceForm) {
  attendanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!attendanceForm.checkValidity()) {
      attendanceForm.reportValidity();
      showToast("Lengkapi semua data absensi terlebih dahulu.");
      return;
    }
    const record = { ...Object.fromEntries(new FormData(attendanceForm)), createdAt: new Date().toISOString() };
    state.attendance.push(record);
    saveState();
    renderBarcode(record);
    render();
    if (document.body.classList.contains("mobile-attendance")) {
      attendanceForm.reset();
      document.querySelector(".attendance-panel .panel-heading").insertAdjacentHTML("afterend", '<p class="attendance-success">Absensi berhasil direkam di perangkat ini.</p>');
    } else {
      showToast(`Absen ${record.attendanceType} berhasil terdata.`);
    }
  });
}

const continueButton = document.querySelector("#continueButton");
if (continueButton) {
  continueButton.addEventListener("click", () => {
    document.querySelector("#monthly-report").scrollIntoView({ behavior: "smooth" });
    showToast("Laporan monitoring siap ditinjau.");
  });
}
document.querySelector("#backDashboardButton").addEventListener("click", () => {
  activatePage("home");
  navItems.forEach((item) => item.classList.remove("active"));
});

document.querySelectorAll(".material-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.material === "NEOP") {
      document.querySelector("#neopDialog").showModal();
      return;
    }
    if (button.dataset.material === "Refresh Training") {
      document.querySelector("#refreshDialog").showModal();
      return;
    }
    if (button.dataset.material === "Insidental Training") {
      document.querySelector("#incidentalDialog").showModal();
      return;
    }
    showToast(`${button.dataset.material} siap dibuka.`);
  });
});

document.querySelector("#closeNeopDialog").addEventListener("click", () => {
  document.querySelector("#neopDialog").close();
});

document.querySelector("#closeRefreshDialog").addEventListener("click", () => {
  document.querySelector("#refreshDialog").close();
});

document.querySelector("#closeIncidentalDialog").addEventListener("click", () => {
  document.querySelector("#incidentalDialog").close();
});

document.querySelector("#neopDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

document.querySelector("#refreshDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

document.querySelector("#incidentalDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

const moduleDetails = {
  kyt: ["01. Target pembelajaran & KYT", "Peserta memahami perubahan mindset dari sekadar menyelesaikan perjalanan menjadi pengemudi yang aktif mencegah risiko. Lakukan identifikasi bahaya, prediksi risiko, tentukan tindakan perbaikan, lalu gunakan prinsip STOP–CALL–WAIT ketika kondisi tidak aman.", ["Kembali ke prinsip dasar mengemudi.", "Amati kondisi kendaraan, jalan, cuaca, dan lingkungan kerja.", "Hentikan pekerjaan bila kontrol keselamatan belum tersedia."]],
  k3: ["02. Pengendalian risiko K3", "Pengendalian dilakukan mengikuti hirarki: eliminasi bahaya, substitusi, perancangan atau rekayasa, administrasi, lalu alat pelindung diri sebagai lapisan terakhir.", ["Utamakan menghilangkan sumber bahaya.", "Gunakan prosedur, rambu, dan briefing untuk mengendalikan risiko tersisa.", "Pastikan APD sesuai bahaya dan digunakan dengan benar."]],
  awareness: ["03. Safety awareness & penyebab kecelakaan", "Keselamatan dimulai dari kemampuan mengenali bahaya sebelum kejadian. Amati situasi, prediksi akibatnya, lakukan pencegahan, dan siapkan tindakan antisipasi. Keselamatan adalah kebutuhan sekaligus kewajiban setiap orang.", ["Jangan mengabaikan kondisi tidak normal.", "Laporkan near miss dan kondisi berbahaya.", "Pastikan tindakan aman dipahami seluruh tim."]],
  inspection: ["04. Pemeriksaan kendaraan & troubleshooting", "Pemeriksaan pre-trip, in-trip, dan post-trip memastikan kendaraan layak digunakan. Periksa kerusakan, keausan, kelonggaran, kehilangan, fungsi, dan kapasitas. Kenali troubleshooting untuk masalah start, overheat, transmisi, hidrolik wing box, rem, serta alur BBM.", ["Gunakan checklist sebelum kendaraan bergerak.", "Jangan mengoperasikan kendaraan yang memiliki kerusakan kritis.", "Eskalasi gangguan kepada mekanik atau atasan."]],
  microsleep: ["05. Microsleep & gangguan internal", "Microsleep dapat terjadi tanpa disadari. Tanda-tandanya antara lain menguap, kelopak mata berat, berkedip berlebihan, hilang fokus, dan kontrol tubuh menurun. Lakukan peregangan dan istirahat berkala; jangan memaksakan diri mengemudi.", ["Berhenti di tempat aman saat mulai mengantuk.", "Komunikasikan kondisi tubuh kepada pengawas.", "Hindari alkohol, obat yang menyebabkan kantuk, dan kurang tidur."]],
  defensive: ["06. Defensive driving", "Terapkan lima kunci: pandangan jauh ke depan, pandangan luas, aktifkan mata, jaga jarak iring, serta melihat dan melihat. Lengkapi dengan prinsip 4A: alertness, awareness, attitude, dan anticipation.", ["Berikan ruang dan waktu untuk bereaksi.", "Periksa blind spot sebelum berpindah jalur atau berbelok.", "Antisipasi kesalahan pengguna jalan lain."]],
  economical: ["07. Economical driving", "Safety driving dan defensive driving membantu menghemat BBM, mengurangi biaya perawatan, dan menekan emisi. Pindahkan gigi sesuai kondisi jalan dan muatan, hindari akselerasi atau pengereman mendadak, dan jaga kecepatan konstan.", ["Jaga tekanan ban dan kondisi kendaraan.", "Matikan mesin saat berhenti lama bila aman.", "Rencanakan rute dan hindari beban berlebih."]],
  braking: ["08. Teknik pengereman & transmisi", "Pahami threshold braking, pulse braking, engine brake, exhaust brake, dan service brake. Pilih gigi sesuai kecepatan, kemiringan, kondisi jalan, serta muatan. Saat rem blong, tetap tenang, gunakan perlambatan yang tersedia, dan arahkan kendaraan ke area aman.", ["Jaga jarak aman sebelum melakukan pengereman.", "Gunakan engine brake di turunan sesuai prosedur.", "Jangan mematikan mesin secara sembarangan saat kendaraan bergerak."]],
  signs: ["09. Rambu, marka & manuver", "Pahami dasar UU No. 22 Tahun 2009, rambu dan marka jalan, yellow box junction, blind spot, jalan rusak, serta aturan memberi ruang bagi truk.", ["Patuhi rambu dan marka meskipun jalan sepi.", "Kurangi kecepatan di area dengan visibilitas terbatas.", "Pastikan pengguna jalan lain dapat melihat posisi kendaraan."]],
  forklift: ["10. Teknik operasi forklift", "Ikuti tahapan pre-operation, during operation, dan after operation. Saat loading, unloading, handling, dan stacking, atur lebar garpu, sandarkan muatan pada backrest, jaga garpu tetap terangkat secukupnya, dan jangan stacking di permukaan tidak rata.", ["Periksa kapasitas forklift dan berat muatan.", "Bunyikan klakson di persimpangan atau area blind spot.", "Turunkan garpu dan parkirkan forklift sesuai prosedur."]],
  loading: ["11. Loading pattern pada truck", "Susun muatan secara seimbang sesuai kapasitas kendaraan agar tidak bergeser, jatuh, atau merusak kendaraan selama perjalanan. Pastikan distribusi beban, pengikatan, dan urutan bongkar mendukung keselamatan.", ["Tempatkan muatan berat di bagian bawah dan seimbang.", "Gunakan pengaman sesuai jenis muatan.", "Periksa kembali muatan sebelum kendaraan berangkat."]]
};

document.querySelectorAll(".module-summary").forEach((module) => {
  module.addEventListener("click", () => {
    const [title, description, points] = moduleDetails[module.dataset.module];
    document.querySelector("#moduleDetailTitle").textContent = title;
    document.querySelector("#moduleDetailContent").innerHTML = `<p>${description}</p><ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>`;
    document.querySelector("#moduleList").hidden = true;
    document.querySelector("#moduleDetail").hidden = false;
  });
});

document.querySelector("#backToModules").addEventListener("click", () => {
  document.querySelector("#moduleDetail").hidden = true;
  document.querySelector("#moduleList").hidden = false;
});

document.querySelector("#exportReportButton").addEventListener("click", () => {
  const csv = ["Training,Peserta,Hadir,Completion,Status", ...trainingDetails.map((item) => `${item.name},${item.participants},${item.attendance},${item.completion}%,${item.status}`)].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "laporan-training-september-2026.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Laporan berhasil diekspor.");
});

document.querySelector("#exportPdfButton").addEventListener("click", () => {
  showToast("Dialog cetak dibuka. Pilih Save as PDF untuk mengunduh laporan.");
  window.setTimeout(() => window.print(), 250);
});

function downloadAttendanceList() {
  const rows = [["No", "Nama Peserta", "NIK", "Program Training", "Absen", "Waktu"], ...state.attendance.map((record, index) => [index + 1, record.participantName, record.nik, record.program, record.attendanceType, new Date(record.createdAt).toLocaleString("id-ID")])];
  const table = `<table><thead><tr>${rows[0].map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`\ufeff<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`], { type: "application/vnd.ms-excel" }));
  link.download = "daftar-hadir-training.xls";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Daftar hadir berhasil diunduh dalam format Excel.");
}

document.querySelector("#downloadAttendanceButton").addEventListener("click", downloadAttendanceList);
document.querySelector("#printAttendanceButton").addEventListener("click", () => {
  showToast("Dialog cetak dibuka. Pilih Save as PDF untuk mengunduh daftar hadir.");
  window.setTimeout(() => window.print(), 250);
});

const certificateForm = document.querySelector("#certificateForm");
const addCertificateButton = document.querySelector("#addCertificateButton");
if (addCertificateButton && certificateForm) {
  addCertificateButton.addEventListener("click", () => {
    const isOpen = !certificateForm.hidden;
    certificateForm.hidden = isOpen;
    addCertificateButton.textContent = isOpen ? "Tambah Data +" : "Tutup Input ×";
    if (!isOpen) certificateForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
if (certificateForm) {
  certificateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!certificateForm.checkValidity()) {
      certificateForm.reportValidity();
      showToast("Lengkapi data sertifikat terlebih dahulu.");
      return;
    }
    const certificate = Object.fromEntries(new FormData(certificateForm));
    if (editingCertificateIndex === null) state.certificateRecords.push(certificate);
    else state.certificateRecords[editingCertificateIndex] = certificate;
    saveState();
    certificateForm.reset();
    certificateForm.hidden = true;
    editingCertificateIndex = null;
    if (addCertificateButton) addCertificateButton.textContent = "Tambah Data +";
    document.querySelector("#certificateSubmitButton").textContent = "Simpan Data Sertifikat";
    render();
    showToast("Data sertifikat berhasil disimpan.");
  });
}
document.querySelector("#certificateListBody").addEventListener("click", (event) => {
  const editButton = event.target.closest(".edit-certificate-button");
  if (editButton) {
    editingCertificateIndex = Number(editButton.dataset.index);
    const certificate = state.certificateRecords[editingCertificateIndex];
    certificateForm.hidden = false;
    if (addCertificateButton) addCertificateButton.textContent = "Tutup Input ×";
    Object.entries(certificate).forEach(([name, value]) => {
      if (certificateForm.elements[name]) certificateForm.elements[name].value = value;
    });
    document.querySelector("#certificateSubmitButton").textContent = "Perbarui Data Sertifikat";
    certificateForm.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const button = event.target.closest(".delete-certificate-button");
  if (!button) return;
  state.certificateRecords.splice(Number(button.dataset.index), 1);
  saveState();
  render();
  showToast("Data sertifikat dihapus.");
});

function certificateRows() {
  return [["No", "Nama", "Jabatan", "Sertifikat", "Masa Berlaku (tahun)", "Expired", "Warning", "Others"], ...state.certificateRecords.map((record, index) => [
    index + 1, record.employeeName, record.position, record.certificate, record.validityPeriod || "-", record.expiredDate, certificateWarningText(record.expiredDate), record.others || "-"
  ])];
}

document.querySelector("#downloadCertificateExcelButton").addEventListener("click", () => {
  const rows = certificateRows();
  const table = `<table><thead><tr>${rows[0].map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`\ufeff<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`], { type: "application/vnd.ms-excel" }));
  link.download = "list-karyawan-bersertifikat.xls";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("List sertifikat berhasil diunduh dalam format Excel.");
});

document.querySelector("#printCertificateButton").addEventListener("click", () => {
  showToast("Dialog cetak dibuka. Pilih Save as PDF untuk mengunduh list sertifikat.");
  document.querySelector(".content").classList.add("certificate-view");
  document.body.classList.add("certificate-printing");
  window.setTimeout(() => window.print(), 250);
});
window.addEventListener("afterprint", () => {
  document.querySelector(".content")?.classList.remove("certificate-view");
  document.body.classList.remove("certificate-printing");
  document.body.classList.remove("dashboard-printing");
});

document.querySelector("#refreshButton").addEventListener("click", () => {
  const button = document.querySelector("#refreshButton");
  button.classList.add("is-refreshing");
  window.setTimeout(() => window.location.reload(), 250);
});

document.querySelector("#downloadDashboardPdfButton").addEventListener("click", () => {
  activatePage("dashboard");
  document.body.classList.add("dashboard-printing");
  showToast("Dashboard siap dicetak sebagai PDF A4 portrait.");
  window.setTimeout(() => window.print(), 250);
});

document.querySelector("#notificationButton").addEventListener("click", () => showToast("Tidak ada notifikasi baru."));
document.querySelector("#profileButton").addEventListener("click", () => showToast("Profil Sri Hartomo"));
document.querySelector("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  showToast(document.body.classList.contains("dark-mode") ? "Mode gelap aktif." : "Mode terang aktif.");
});
document.querySelector("#menuButton").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const pageTargets = [...content.querySelectorAll("[id]")].filter((element) => element.closest(".content") === content);
function activatePage(targetId) {
  const isHome = targetId === "home";
  const isDashboard = targetId === "dashboard";
  content.classList.toggle("single-page", !isHome && !isDashboard);
  content.classList.toggle("dashboard-landing", isHome);
  content.classList.toggle("dashboard-view", isDashboard);
  content.classList.toggle("driver-view", targetId === "data-driver");
  pageTargets.forEach((element) => element.classList.remove("page-active"));
  let target = document.querySelector(`#${targetId}`);
  while (target && target !== content) {
    target.classList.add("page-active");
    target = target.parentElement;
  }
  if (!isHome) document.querySelector(`#${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (isDashboard) window.requestAnimationFrame(() => render());
}
const masterDataToggle = document.querySelector("#masterDataToggle");
const masterDataMenu = document.querySelector("#masterDataMenu");
masterDataToggle.addEventListener("click", () => {
  const expanded = masterDataToggle.getAttribute("aria-expanded") === "true";
  masterDataToggle.setAttribute("aria-expanded", String(!expanded));
  masterDataMenu.hidden = expanded;
});
masterDataMenu.querySelectorAll(".subnav-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    sidebar.classList.remove("open");
    const target = document.querySelector(item.getAttribute("href"));
    if (target) {
      activatePage(target.id);
      return;
    }
    showToast(`${item.textContent} siap digunakan.`);
  });
});
const driverForm = document.querySelector("#driverForm");
let editingDriverIndex = null;
const driverTableBody = document.querySelector("#driverTableBody");
const driverCount = document.querySelector("#driverCount");

function renderDrivers() {
  driverCount.textContent = `${state.drivers.length} data`;
  const sortedDrivers = state.drivers
    .map((driver, index) => ({ driver, index }))
    .sort((a, b) => a.driver.driverId.localeCompare(b.driver.driverId, undefined, { numeric: true, sensitivity: "base" }));
  driverTableBody.innerHTML = sortedDrivers.length ? sortedDrivers.map(({ driver, index }) => `
    <tr><td>${driver.driverId}</td><td><strong>${driver.driverName}</strong></td><td>${driver.joinDate}</td><td>${formatWorkDuration(driver.joinDate)}</td><td>${driver.driverStatus}</td><td>${driver.ddtScore}</td><td>${driver.forkliftScore}</td><td><button class="text-button edit-driver-button" type="button" data-index="${index}">Edit</button></td></tr>
  `).join("") : '<tr><td colspan="8" class="empty-state">Belum ada data driver.</td></tr>';
}

function formatWorkDuration(joinDate) {
  const start = new Date(`${joinDate}T00:00:00`);
  const today = new Date();
  if (!joinDate || Number.isNaN(start.getTime()) || start > today) return "-";
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  if (today.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years === 0 && months === 0) return "Kurang dari 1 bulan";
  return `${years ? `${years} tahun` : ""}${years && months ? " " : ""}${months ? `${months} bulan` : ""}`;
}

renderDrivers();
driverForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!driverForm.checkValidity()) {
    driverForm.reportValidity();
    showToast("Lengkapi semua data driver terlebih dahulu.");
    return;
  }
  const driver = Object.fromEntries(new FormData(driverForm));
  if (editingDriverIndex === null) state.drivers.push(driver);
  else state.drivers[editingDriverIndex] = driver;
  saveState();
  driverForm.reset();
  editingDriverIndex = null;
  driverForm.querySelector("button[type=submit]").textContent = "Simpan Data Driver";
  renderDrivers();
  showToast("Data driver berhasil disimpan.");
});
driverTableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".edit-driver-button");
  if (!button) return;
  editingDriverIndex = Number(button.dataset.index);
  const driver = state.drivers[editingDriverIndex];
  Object.entries(driver).forEach(([name, value]) => { if (driverForm.elements[name]) driverForm.elements[name].value = value; });
  driverForm.querySelector("button[type=submit]").textContent = "Perbarui Data Driver";
  driverForm.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#downloadDriverPdfButton").addEventListener("click", () => {
  showToast("Dialog cetak dibuka. Pilih A4 dan Portrait untuk menyimpan PDF.");
  window.setTimeout(() => window.print(), 250);
});

const navItems = [...document.querySelectorAll(".main-nav a.nav-item")];
document.querySelector("#exploreButton").addEventListener("click", () => {
  document.querySelector("#program-training")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#guideButton").addEventListener("click", () => {
  document.querySelector("#help")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelectorAll(".landing-menu-card").forEach((card) => {
  card.addEventListener("click", () => {
    const target = document.querySelector(card.dataset.target);
    if (target) activatePage(target.id);
  });
});
navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const target = document.querySelector(item.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    activatePage(target.id);
    navItems.forEach((navItem) => navItem.classList.remove("active"));
    item.classList.add("active");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    sidebar.classList.remove("open");
  });
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  activatePage("home");
  navItems.forEach((item) => item.classList.remove("active"));
});

document.querySelectorAll(".back-dashboard-link").forEach((button) => button.addEventListener("click", () => {
  activatePage("home");
  navItems.forEach((item) => item.classList.remove("active"));
}));

document.addEventListener("click", (event) => {
  if (window.innerWidth <= 900 && sidebar.classList.contains("open") && !sidebar.contains(event.target) && event.target.id !== "menuButton") {
    sidebar.classList.remove("open");
  }
});

document.querySelectorAll(".manual-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.querySelector(`#${button.dataset.target}`);
    if (!form) return;
    form.hidden = !form.hidden;
    button.textContent = form.hidden ? "Input Data Manual" : "Tutup Input";
    if (!form.hidden) {
      const values = form.dataset.chart === "programs" ? (state.manualCharts.programs || { NEOP: 86, "Refresh Training": 72, "Insidental Training": 48, "Development Training": 64 }) : form.dataset.chart === "activities" ? (state.manualCharts.activities || { Coaching: 58, "Dojo Express Campaign": 76, "Observasi Lapangan": 43 }) : form.dataset.chart === "attendance" ? (state.manualCharts.attendance || { "NEOP": { target: 38, hadir: 36 }, "Refresh Training": { target: 24, hadir: 22 }, "Insidental Training": { target: 18, hadir: 16 }, "Development Training": { target: 16, hadir: 15 } }) : (state.manualCharts.monthly || monthlyParticipants);
      [...form.elements].forEach((field) => {
        if (field.name && values[field.name] !== undefined) field.value = values[field.name];
      });
      [...form.elements].forEach((field) => {
        if (field.name && field.name.startsWith("target_")) {
          const targetKey = field.name.slice(7);
          if (form.dataset.chart === "attendance") {
            field.value = values[targetKey]?.target ?? 0;
          } else {
            field.value = form.dataset.chart === "monthly" ? (state.manualCharts.targets.monthly?.[Number(targetKey)] ?? 75) : (state.manualCharts.targets[form.dataset.chart]?.[targetKey] ?? 75);
          }
        }
      });
      [...form.elements].forEach((field) => {
        if (field.name && field.name.startsWith("hadir_")) {
          const targetKey = field.name.slice(6);
          field.value = values[targetKey]?.hadir ?? 0;
        }
      });
    }
  });
});

document.querySelectorAll(".manual-chart-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const submitted = Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, Number(value)]));
    if (form.dataset.chart === "attendance") {
      const attendanceData = {};
      Object.entries(submitted).forEach(([name, value]) => {
        const [type, program] = name.split("_");
        if (!attendanceData[program]) attendanceData[program] = {};
        attendanceData[program][type] = value;
      });
      state.manualCharts.attendance = attendanceData;
    } else {
      const targetEntries = Object.entries(submitted).filter(([name]) => name.startsWith("target_"));
      const chartValues = Object.fromEntries(Object.entries(submitted).filter(([name]) => !name.startsWith("target_")));
      if (form.dataset.targets !== "false") {
        state.manualCharts.targets[form.dataset.chart] = form.dataset.chart === "monthly"
          ? Object.keys(Object.fromEntries(targetEntries)).sort((a, b) => Number(a.slice(7)) - Number(b.slice(7))).map((name) => submitted[name])
          : Object.fromEntries(targetEntries.map(([name, value]) => [name.slice(7), value]));
      }
      state.manualCharts[form.dataset.chart] = form.dataset.chart === "monthly" ? Object.keys(chartValues).sort((a, b) => Number(a) - Number(b)).map((key) => chartValues[key]) : chartValues;
    }
    saveState();
    render();
    document.querySelectorAll(`.manual-chart-form[data-chart="${form.dataset.chart}"]`).forEach((item) => {
      item.hidden = true;
      const toggle = document.querySelector(`.manual-toggle[data-target="${item.id}"]`);
      if (toggle) toggle.textContent = "Input Data Manual";
    });
    showToast("Data grafik manual berhasil diterapkan.");
  });
});

render();
