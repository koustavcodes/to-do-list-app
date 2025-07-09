const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

function addItem() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <button class="delete" onclick="this.parentElement.remove()">Delete</button>
  `;
  list.appendChild(li);
  input.value = "";
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
