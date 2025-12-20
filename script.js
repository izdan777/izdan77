// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyDWibkHSuIiaThde78VD7ZodpN3kaokaW4",
  authDomain: "family-portal-8b18e.firebaseapp.com",
  databaseURL: "https://family-portal-8b18e-default-rtdb.firebaseio.com",
  projectId: "family-portal-8b18e",
  storageBucket: "family-portal-8b18e.appspot.com",
  messagingSenderId: "651597096294",
  appId: "1:651597096294:web:89ba3b3b6f5cc39ff454a7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const todoRef = database.ref("todos");
const giftsRef = database.ref("gifts");

console.log("🔥 Firebase connected");

// ===== PIN CONFIG =====
const CORRECT_PIN = "0757";

// ===== ON LOAD =====
window.onload = () => {
  document.getElementById("lockScreen").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  loadTodosFromFirebase();
  loadGiftsFromFirebase();
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

// ===== FINANCE TABS =====
function showFinanceTab(event, tabId) {
  document.querySelectorAll('.finance-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#finance .doc-tab').forEach(t => t.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// ===== BIRTHDAY FILTER =====
function filterBirthdays() {
  const selected = document.getElementById("monthSelect").value;
  const months = document.querySelectorAll(".birthday-month");

  months.forEach(month => {
    month.style.display =
      selected === "all" || month.dataset.month === selected ? "block" : "none";
  });
}

// ===== TO-DO WITH FIREBASE =====
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

// Submit task (SAVE TO FIREBASE)
function submitTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  const error = document.getElementById("todoError");

  if (text === "") {
    error.textContent = "Task description cannot be empty";
    return;
  }

  todoRef.push({
    description: text,
    createdAt: Date.now()
  });

  closeTodoBox();
}

// Load tasks from Firebase
function loadTodosFromFirebase() {
  todoRef.on("value", snapshot => {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    todoCount = 0;

    snapshot.forEach(child => {
      todoCount++;
      const data = child.val();
      const key = child.key;

      const row = document.createElement("div");
      row.className = "todo-row";
      row.dataset.key = key;

      row.innerHTML = `
        <div class="seq">${todoCount}</div>
        <div class="desc">${data.description}</div>
        <button onclick="editTodo('${key}', this)">Edit</button>
        <button onclick="deleteTodo('${key}')">✔</button>
      `;

      list.appendChild(row);
    });
  });
}

// Edit task (UPDATE FIREBASE)
function editTodo(key, btn) {
  const descDiv = btn.parentElement.querySelector(".desc");
  const newText = prompt("Edit task:", descDiv.textContent);

  if (newText !== null && newText.trim() !== "") {
    todoRef.child(key).update({
      description: newText.trim()
    });
  }
}

// Delete task (REMOVE FROM FIREBASE)
function deleteTodo(key) {
  todoRef.child(key).remove();
}

// ===== GIFTS WITH FIREBASE =====
let giftCount = 0;

// Load gifts from Firebase
function loadGiftsFromFirebase() {
  giftsRef.on("value", snapshot => {
    const list = document.getElementById("giftList");
    list.innerHTML = "";
    giftCount = 0;

    snapshot.forEach(child => {
      giftCount++;
      const data = child.val();
      const key = child.key;
      const status = data.status || "pending";

      const row = document.createElement("tr");
      row.dataset.key = key;
      row.dataset.status = status;
      if (status === "completed") row.classList.add("completed");

      row.innerHTML = `
        <td>${giftCount}</td>
        <td>${data.name}</td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${status === "completed" ? "checked" : ""} onchange="toggleGiftFirebase(this, '${key}')">
            <span class="slider"></span>
          </label>
        </td>
        <td class="status">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
      `;
      list.appendChild(row);
    });
  });
}

// Toggle gift status in Firebase
function toggleGiftFirebase(checkbox, key) {
  const row = checkbox.closest("tr");
  const name = row.children[1].innerText;
  const statusCell = row.querySelector(".status");

  let newStatus = checkbox.checked ? "completed" : "pending";

  if (checkbox.checked) {
    if (!confirm(`Have you bought the gift for ${name}?`)) {
      checkbox.checked = false;
      return;
    }
  }

  giftsRef.child(key).update({ status: newStatus });
}

// Add new gift
function addGift(name) {
  if (!name || name.trim() === "") return;
  giftsRef.push({
    name: name.trim(),
    status: "pending"
  });
}

// Prompt user to add gift
function promptAddGift() {
  const name = prompt("Enter the gift recipient's name:");
  if (name && name.trim() !== "") addGift(name.trim());
}

// Filter gifts
function filterGifts() {
  const filter = document.getElementById("giftFilter").value;
  const rows = document.querySelectorAll("#giftList tr");

  rows.forEach(row => {
    if (filter === "all" || row.dataset.status === filter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Add gift from input box
function addGiftFromInput() {
  const input = document.getElementById("giftNameInput");
  const name = input.value.trim();

  if (name === "") {
    alert("Please enter a name.");
    return;
  }

  // Push to Firebase
  giftsRef.push({
    name: name,
    status: "pending"
  });

  // Clear input box
  input.value = "";
}

