function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');

  // Close mobile menu after click
  document.getElementById('navLinks').classList.remove('show');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
}

function showDocTab(tabId) {
  // Hide all document pages
  document.querySelectorAll('.doc-page').forEach(page => {
    page.classList.remove('active');
  });

  // Remove active class from tabs
  document.querySelectorAll('.doc-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected page
  document.getElementById(tabId).classList.add('active');

  // Activate clicked tab
  event.target.classList.add('active');
}

function viewPDF(file) {
  window.open(file, "_blank");
}
