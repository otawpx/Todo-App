const todos = [];

// stats
let completedLength = 0;
let activeLength = 0;

// dom elements
const todoMainListEl = document.querySelector(".todo-items");
const todoMainFilterEl = document.querySelector(".todo-filter");
const todoMainFormEl = document.querySelector(".todo-creation");
const todoMainInputEl = todoMainFormEl.querySelector("input");

// events
window.addEventListener("DOMContentLoaded", domLoaded);
document.addEventListener("click", handleTodoOptions);
todoMainFormEl.addEventListener("submit", createTodo);
todoMainFilterEl.addEventListener("change", filterTodo);

// functions
function createTodo(e) {
    e.preventDefault();

    const inputValue = todoMainInputEl.value.trim();
    if (!inputValue) return false;

    const todo = {
        id: Date.now().toString(),
        text: inputValue,
        isCompleted: false,
        createAt: new Date().toLocaleString(),
    };

    todos.push(todo);
    saveTodosToLocalStorage();
    renderTodos();
    todoMainFormEl.reset();
    todoMainInputEl.focus();
    todoMainFilterEl.value = "all";
}

function deleteTodoById(id, el) {
    const i = todos.findIndex((item) => item.id == id);
    if (i == -1) return;

    todos.splice(i, 1);
    saveTodosToLocalStorage();
    el.remove();
}

function toggleTodoById(id, el) {
    const i = todos.findIndex((item) => item.id == id);
    if (i == -1) return;

    const isCompleted = !todos[i].isCompleted;
    todos[i].isCompleted = isCompleted;
    saveTodosToLocalStorage();
    const statusT = isCompleted ? "completed" : "active";
    el.dataset.todostatusT = statusT;
}

function filterTodo(e) {
    const filter = e.target.value;
    renderTodos(filter);
}

function handleTodoOptions(e) {
    const target = e.target;
    if (target.classList.contains("todo-delete-button")) {
        const parentEl = target.parentElement;
        const todoId = parentEl.dataset.todoId;
        deleteTodoById(todoId, parentEl);
    }

    if (target.classList.contains("todo-toggle-button")) {
        const parentEl = target.parentElement;
        const todoId = parentEl.dataset.todoId;
        toggleTodoById(todoId, parentEl);
    }
}

function renderTodos(filter = "all") {
    todoMainListEl.innerHTML = "";

    todos.forEach((todo) => {
        const statusT = todo.isCompleted ? "completed" : "active";
        if (filter === statusT || filter === "all") {
            const li = renderTodo({ ...todo, statusT: statusT });
            todoMainListEl.insertAdjacentHTML("beforeend", li);
        }
    });
}

function renderTodo({ id, text, isCompleted, createAt, statusT }) {
    return `<li class="todo-item" data-todo-statusT="${statusT}" data-todo-id="${id}" title="${createAt}">
                <input 
                    type="checkbox" ${isCompleted ? "checked" : null} 
                    name="todo-item-toggle" class="todo-toggle-button" 
                />
                <span>${text}</span>
                <button type="button" class="todo-delete-button">
                    <span class="material-symbols-outlined"> delete </span>
                </button>
                <button type="button" class="todo-update-button">
                    <span class="material-symbols-outlined"> check </span>
                </button>
            </li>`;
}

function domLoaded() {
    todos.push(...getTodosFromLocalStorage());
    renderTodos();
}

function getTodosFromLocalStorage() {
    const todosJSON = localStorage.getItem("todos");
    return todosJSON ? JSON.parse(todosJSON) : [];
}

function saveTodosToLocalStorage() {
    const todosJSON = JSON.stringify(todos);
    localStorage.setItem("todos", todosJSON);
}
