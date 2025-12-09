function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.getElementById('navLinks').classList.remove('show');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
}

function showDocTab(event, tabId) {
  document.querySelectorAll('.doc-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function viewPDF(file) {
  window.open(file, "_blank");
}

function checkEmptyTabs() {
  document.querySelectorAll(".doc-page").forEach(page => {
    const rows = page.querySelectorAll(".doc-row");
    if (rows.length > 0) page.setAttribute("data-empty", "false");
    else page.setAttribute("data-empty", "true");
  });
}

window.onload = checkEmptyTabs;
