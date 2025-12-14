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

function showFinanceTab(event, tabId) {
  document.querySelectorAll('.finance-page').forEach(p =>
    p.classList.remove('active')
  );

  document.querySelectorAll('#finance .doc-tab').forEach(t =>
    t.classList.remove('active')
  );

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function filterBirthdays() {
  const selected = document.getElementById("monthSelect").value;
  const months = document.querySelectorAll(".birthday-month");

  months.forEach(month => {
    if (selected === "all" || month.dataset.month === selected) {
      month.style.display = "block";
    } else {
      month.style.display = "none";
    }
  });
}

let todoCount = 0;

// Open add box
function openTodoBox() {
  document.getElementById("todoBox").classList.remove("hidden");
  document.getElementById("todoInput").value = "";
  document.getElementById("todoError").textContent = "";
}

// Close add box
function closeTodoBox() {
  document.getElementById("todoBox").classList.add("hidden");
}

// Submit task
function submitTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  const error = document.getElementById("todoError");

  if (text === "") {
    error.textContent = "Task description cannot be empty";
    return;
  }

  error.textContent = "";
  todoCount++;

  const row = document.createElement("div");
  row.className = "todo-row";

  row.innerHTML = `
    <div class="seq">${todoCount}</div>
    <div class="desc">${text}</div>
    <button onclick="editTodo(this)">Edit</button>
    <button onclick="deleteTodo(this)">✔</button>
  `;

  document.getElementById("todoList").appendChild(row);
  closeTodoBox();
}

// Edit task
function editTodo(btn) {
  const descDiv = btn.parentElement.querySelector(".desc");
  const newText = prompt("Edit task:", descDiv.textContent);

  if (newText !== null && newText.trim() !== "") {
    descDiv.textContent = newText.trim();
  }
}

// Delete task
function deleteTodo(btn) {
  btn.parentElement.remove();
  renumberTodos();
}

// Renumber sequence
function renumberTodos() {
  const rows = document.querySelectorAll("#todoList .todo-row");
  todoCount = 0;
  rows.forEach(row => {
    todoCount++;
    row.querySelector(".seq").textContent = todoCount;
  });
}
