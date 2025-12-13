// ===== PIN CONFIG =====
const CORRECT_PIN = "0757";

// ===== ON LOAD =====
window.onload = () => {
  document.getElementById("lockScreen").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
};

// ===== PIN CHECK =====
function checkPIN() {
  const pin = document.getElementById("pinInput").value;
  const error = document.getElementById("pinError");

  if (pin === CORRECT_PIN) {
    document.getElementById("lockScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  } else {
    error.textContent = "Incorrect PIN";
  }
}

// Cancel app
function cancelApp() {
  document.getElementById("pinInput").value = "";
  document.getElementById("pinError").textContent = "";
}

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.getElementById('navLinks').classList.remove('show');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
}

// ===== DOCUMENT TABS =====
function showDocTab(event, tabId) {
  document.querySelectorAll('.doc-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// ===== VIEW PDF =====
function viewPDF(file) {
  window.open(file, "_blank");
}
