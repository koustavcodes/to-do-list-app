const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

function addItem() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" class="complete-checkbox" aria-label="Mark as completed">
    <span class="checkmark">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><polyline points="3.5 8.5 7 12 13 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="task-text">${text}</span>
    <button class="delete" aria-label="Delete">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path fill="currentColor" d="M6 6.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 6 6.75Zm4 .75a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4ZM2.75 4.75A.75.75 0 0 1 3.5 4h9a.75.75 0 0 1 0 1.5h-.305l-.638 7.016A2.25 2.25 0 0 1 9.32 14H6.68a2.25 2.25 0 0 1-2.237-1.484L3.805 5.5H3.5a.75.75 0 0 1-.75-.75ZM5.07 12.5a.75.75 0 0 0 .71.5h2.64a.75.75 0 0 0 .71-.5l.62-6.5H4.45l.62 6.5ZM6.25 2a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 6.25 2Z"/>
      </svg>
    </button>
  `;

  const checkbox = li.querySelector('.complete-checkbox');
  const deleteBtn = li.querySelector('.delete');

  // Toggle completed when clicking on li (except delete button and checkbox)
  li.addEventListener('click', function(e) {
    if (e.target === deleteBtn || e.target === checkbox) return;
    checkbox.checked = !checkbox.checked;
    li.classList.toggle('completed', checkbox.checked);
  });

  // Toggle completed when clicking on checkbox directly
  checkbox.addEventListener('change', function() {
    li.classList.toggle('completed', checkbox.checked);
  });

  // Prevent li click when clicking delete
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    li.remove();
  });

  list.appendChild(li);
  input.value = "";
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
