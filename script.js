const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// --- LocalStorage ---
const STORAGE_KEY = "todo-list-app:todos";
let todos = [];

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
  } catch (e) {
    todos = [];
  }
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  if (todo.completed) {
    li.classList.add("completed");
  }
  li.innerHTML = `
    <input type="checkbox" class="complete-checkbox" aria-label="Mark as completed"${todo.completed ? " checked" : ""}>
    <span class="checkmark">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><polyline points="3.5 8.5 7 12 13 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="task-text">${todo.text}</span>
    <button class="edit" aria-label="Edit" title="Edit task">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path fill="currentColor" d="M11.93 1.7a2 2 0 0 1 2.83 2.83l-7.4 7.4a2 2 0 0 1-.87.5l-2.76.8a.75.75 0 0 1-.93-.93l.8-2.76a2 2 0 0 1 .5-.87l7.4-7.4Zm1.77 1.06a.5.5 0 0 0-.71 0l-.83.83 1.41 1.41.83-.83a.5.5 0 0 0 0-.7l-.7-.71ZM12.1 6.06l-1.41-1.41-5.98 5.98a.5.5 0 0 0-.12.22l-.48 1.65 1.65-.48a.5.5 0 0 0 .22-.12l5.98-5.98Z"/>
      </svg>
    </button>
    <button class="delete" aria-label="Delete">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path fill="currentColor" d="M6 6.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 6 6.75Zm4 .75a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4ZM2.75 4.75A.75.75 0 0 1 3.5 4h9a.75.75 0 0 1 0 1.5h-.305l-.638 7.016A2.25 2.25 0 0 1 9.32 14H6.68a2.25 2.25 0 0 1-2.237-1.484L3.805 5.5H3.5a.75.75 0 0 1-.75-.75ZM5.07 12.5a.75.75 0 0 0 .71.5h2.64a.75.75 0 0 0 .71-.5l.62-6.5H4.45l.62 6.5ZM6.25 2a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 6.25 2Z"/>
      </svg>
    </button>
  `;

  const checkbox = li.querySelector('.complete-checkbox');
  const editBtn = li.querySelector('.edit');
  const deleteBtn = li.querySelector('.delete');

  function startInlineEdit() {
    if (li.classList.contains('editing')) {
      return;
    }

    li.classList.add('editing');
    const taskText = li.querySelector('.task-text');
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;
    editInput.setAttribute('aria-label', 'Edit task text');
    taskText.replaceWith(editInput);

    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);

    let finalized = false;

    function finishEdit(mode) {
      if (finalized) {
        return;
      }
      finalized = true;

      const nextText = editInput.value.trim();
      if (mode === 'save' && nextText) {
        todo.text = nextText;
        saveTodos();
      }

      renderTodos();
    }

    editInput.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    editInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        finishEdit('save');
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        finishEdit('cancel');
      }
    });

    editInput.addEventListener('blur', function() {
      finishEdit('save');
    });
  }

  li.addEventListener('click', function(e) {
    if (li.classList.contains('editing')) {
      return;
    }
    if (e.target === checkbox) {
      return;
    }
    if (e.target.closest('.delete') || e.target.closest('.edit') || e.target.classList.contains('edit-input')) {
      return;
    }
    checkbox.checked = !checkbox.checked;
    todo.completed = checkbox.checked;
    li.classList.toggle('completed', checkbox.checked);
    saveTodos();
  });

  checkbox.addEventListener('change', function() {
    todo.completed = checkbox.checked;
    li.classList.toggle('completed', checkbox.checked);
    saveTodos();
  });

  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    todos = todos.filter(t => t.id !== todo.id);
    saveTodos();
    li.remove();
    updateDeleteAllVisibility();
  });

  editBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    startInlineEdit();
  });

  return li;
}

function renderTodos() {
  list.innerHTML = "";
  todos.sort((a, b) => a.order - b.order).forEach(todo => {
    list.appendChild(createTodoElement(todo));
  });
  updateDeleteAllVisibility();
}

// Create a flex container for the buttons
let buttonContainer = document.getElementById("button-container");
if (!buttonContainer) {
  buttonContainer = document.createElement("div");
  buttonContainer.id = "button-container";
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "row";
  buttonContainer.style.gap = "1rem";
  buttonContainer.style.marginBottom = "1rem";
  // Insert before the list or wherever appropriate
  const addItemBtn = document.getElementById("add-item");
  addItemBtn.parentNode.insertBefore(buttonContainer, addItemBtn);
  buttonContainer.appendChild(addItemBtn);
}

// Create the "Delete All" button in JS
const deleteAllBtn = document.createElement("button");
deleteAllBtn.id = "delete-all";
deleteAllBtn.className = "delete-all";
deleteAllBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 16 16">
    <path fill="currentColor" d="M6 6.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 6 6.75Zm4 .75a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4ZM2.75 4.75A.75.75 0 0 1 3.5 4h9a.75.75 0 0 1 0 1.5h-.305l-.638 7.016A2.25 2.25 0 0 1 9.32 14H6.68a2.25 2.25 0 0 1-2.237-1.484L3.805 5.5H3.5a.75.75 0 0 1-.75-.75ZM5.07 12.5a.75.75 0 0 0 .71.5h2.64a.75.75 0 0 0 .71-.5l.62-6.5H4.45l.62 6.5ZM6.25 2a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 6.25 2Z"/>
  </svg>
`;
deleteAllBtn.style.display = "none"; // Hide initially

// Insert the button into the flex container
buttonContainer.appendChild(deleteAllBtn);

// Show/hide the "Delete All" button based on task count (>2)
function updateDeleteAllVisibility() {
  deleteAllBtn.style.display = list.children.length > 2 ? "block" : "none";
}

function addItem() {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  const todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    order: todos.length
  };
  todos.push(todo);
  saveTodos();
  list.appendChild(createTodoElement(todo));
  input.value = "";
  updateDeleteAllVisibility();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addItem();
  }
});

// Delete all tasks when "Delete All" is clicked
deleteAllBtn.addEventListener("click", function() {
  todos = [];
  saveTodos();
  list.innerHTML = "";
  updateDeleteAllVisibility();
});

// Load persisted todos on startup
loadTodos();
renderTodos();

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
