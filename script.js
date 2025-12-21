
// ===== PIN CONFIG =====
const CORRECT_PIN = "0757";

// ===== ON LOAD =====
window.onload = () => {
  const splash = document.getElementById("splash-screen");
  const splashText = splash.querySelector(".splash-text");
  const lockScreen = document.getElementById("lockScreen");
  const app = document.getElementById("app");

  lockScreen.classList.add("hidden");
  app.classList.add("hidden");

  // Fade text in
  setTimeout(() => {
    splash.classList.add("show");
  }, 400);

  // Fade splash out
  setTimeout(() => {
    splash.style.opacity = "0";
  }, 2200);

  // Remove splash & show PIN
  setTimeout(() => {
    splash.style.display = "none";
    lockScreen.classList.remove("hidden");

    loadTodosFromFirebase();
    loadGiftsFromFirebase();
  }, 3200);
};


// ===== PIN CHECK =====
window.checkPIN = function () {
  const pin = document.getElementById("pinInput").value;
  const error = document.getElementById("pinError");

  if (pin === CORRECT_PIN) {
    document.getElementById("lockScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  } else {
    error.textContent = "Incorrect PIN";
  }
};

window.cancelApp = function () {
  document.getElementById("pinInput").value = "";
  document.getElementById("pinError").textContent = "";
};

// ===== NAVIGATION =====
window.showPage = function (pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  document.getElementById("navLinks").classList.remove("show");
};

window.toggleMenu = function () {
  document.getElementById("navLinks").classList.toggle("show");
};

// ===== DOCUMENT TABS =====
window.showDocTab = function (event, tabId) {
  document.querySelectorAll(".doc-page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".doc-tab").forEach((t) => t.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
};

// ===== VIEW PDF =====
window.viewPDF = function (file) {
  window.open(file, "_blank");
};

// ===== FINANCE TABS =====
window.showFinanceTab = function (event, tabId) {
  document.querySelectorAll(".finance-page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll("#finance .doc-tab").forEach((t) => t.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
};

// ===== BIRTHDAY FILTER =====
window.filterBirthdays = function () {
  const selected = document.getElementById("monthSelect").value;
  const months = document.querySelectorAll(".birthday-month");

  months.forEach((month) => {
    month.style.display =
      selected === "all" || month.dataset.month === selected ? "block" : "none";
  });
};

// ===== TO-DO =====
let todoCount = 0;
window.openTodoBox = function () {
  document.getElementById("todoBox").classList.remove("hidden");
  document.getElementById("todoInput").value = "";
  document.getElementById("todoError").textContent = "";
};
window.closeTodoBox = function () {
  document.getElementById("todoBox").classList.add("hidden");
};
window.submitTodo = function () {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();
  const error = document.getElementById("todoError");

  if (!text) {
    error.textContent = "Task description cannot be empty";
    return;
  }

  todoRef.push({ description: text, createdAt: Date.now() });
  closeTodoBox();
};

window.loadTodosFromFirebase = function () {
  todoRef.on("value", (snapshot) => {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    todoCount = 0;

    snapshot.forEach((child) => {
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
};

window.editTodo = function (key, btn) {
  const descDiv = btn.parentElement.querySelector(".desc");
  const newText = prompt("Edit task:", descDiv.textContent);
  if (newText && newText.trim() !== "") {
    todoRef.child(key).update({ description: newText.trim() });
  }
};

window.deleteTodo = function (key) {
  todoRef.child(key).remove();
};

// ===== GIFTS =====
window.loadGiftsFromFirebase = function () {
  giftsRef.on("value", (snapshot) => {
    const list = document.getElementById("giftList");
    list.innerHTML = "";
    let giftCount = 0;

    snapshot.forEach((child) => {
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
            <input type="checkbox" ${status === "completed" ? "checked" : ""} onchange="toggleGiftFirebase(this,'${key}')">
            <span class="slider"></span>
          </label>
        </td>
        <td class="status">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
      `;
      list.appendChild(row);
    });
    filterGifts();
  });
};

window.toggleGiftFirebase = function (checkbox, key) {
  const row = checkbox.closest("tr");
  const name = row.children[1].innerText;
  const newStatus = checkbox.checked ? "completed" : "pending";

  if (checkbox.checked && !confirm(`Have you bought the gift for ${name}?`)) {
    checkbox.checked = false;
    return;
  }

  giftsRef.child(key).update({ status: newStatus });
};

window.addGiftFromInput = function () {
  const input = document.getElementById("giftNameInput");
  const name = input.value.trim();
  if (!name) return alert("Enter a name");

  // Push to Firebase using global ref
  window.giftsRef.push({ name, status: "pending" });

  // Clear input
  input.value = "";
};

// ===== GIFT FILTER =====
window.filterGifts = function () {
  const filter = document.getElementById("giftFilter").value;
  const rows = document.querySelectorAll("#giftList tr");

  rows.forEach(row => {
    const status = row.dataset.status; // pending | completed

    if (filter === "all") {
      row.style.display = "";
    } else if (filter === status) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
};
