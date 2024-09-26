const todos = [];
console.log(todos);

//
const todoCreationDiv = document.querySelector(".todo-creation");
const todoMainForm = todoCreationDiv.querySelector("form");
const todoMainInput = todoCreationDiv.querySelector("input");

//
window.addEventListener("click", handleTodoClick);
todoMainForm.addEventListener("submit", createTodoItem);
window.addEventListener("DOMContentLoaded", contentLoaded);

//
function handleTodoClick(e) {
    if (e.target.classList.contains("todo-item-delete")) {
        const parentEl = e.target.parentElement;
        const todoId = parentEl.dataset.todo;
        deleteTodoById(todoId, parentEl);
    }
    if (e.target.classList.contains("todo-item-check")) {
        const parentEl = e.target.parentElement;
        const todoId = parentEl.dataset.todo;
        toggleTodoById(todoId, parentEl);
    }
}

function createTodoItem(e) {
    e.preventDefault();
    const inputValue = todoMainInput.value.trim();

    if (inputValue) {
        const todo = {
            id: Date.now().toString(),
            text: inputValue,
            completed: false,
            createdAt: new Date().toLocaleString(),
        };
        todos.push(todo);
        saveTodos();
        renderTodos([todo]);
        todoMainForm.reset();
        todoMainInput.focus();
    } else {
        console.log("Creating failed");
        return;
    }
}

function deleteTodoById(id, item) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        saveTodos();
        item.remove();
    } else {
        console.log("Deleting failed");
        return;
    }
}

function toggleTodoById(id, item) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
        if (todos[index].completed) {
            todos[index].completed = false;
            saveTodos();
            item.remove();
            renderTodos([todos[index]]);
        } else {
            todos[index].completed = true;
            saveTodos();
            item.remove();
            renderTodos([todos[index]]);
        }
    } else {
        console.log("Toggling failed");
        return;
    }
}

function renderTodos(items = todos) {
    if (items.length === 0) return;

    const mainItemsDiv = document.querySelector(".todo-items");
    const completedItemsDiv = document.querySelector(".todo-completed");

    if (items.length == 1) {
        //
        if (items[0].completed) {
            completedItemsDiv.insertAdjacentHTML(
                "beforeend",
                items.map(getTodoHTML).join("\n")
            );
        } else {
            mainItemsDiv.insertAdjacentHTML(
                "beforeend",
                items.map(getTodoHTML).join("\n")
            );
        }
    } else {
        //
        const completedItems = [];
        const activeItems = [];

        //
        items.map((todo) => {
            if (todo.completed) {
                completedItems.push(todo);
            } else {
                activeItems.push(todo);
            }
        });

        //
        completedItemsDiv.hidden = completedItems.length === 0;

        mainItemsDiv.insertAdjacentHTML(
            "beforeend",
            activeItems.map(getTodoHTML).join("\n")
        );

        completedItemsDiv.insertAdjacentHTML(
            "beforeend",
            completedItems.map(getTodoHTML).join("\n")
        );
    }
}

function getTodoHTML(todo, index) {
    const { id, text, completed, createdAt } = todo;
    const todoStatus = completed ? "completed" : "active";

    return `<div 
                class="todo-item" 
                data-todo="${id}" 
                data-todo-status="${todoStatus}" 
                title="${createdAt}"
            >
            <span class="todo-item-count">${index + 1}</span>
            <input 
                type="checkbox" 
                class="todo-item-check" 
                name="todo-item-status" 
                ${completed ? "checked" : null} 
            />
            <span class="todo-item-text">${text}</span>
            <button class="todo-item-delete">Delete</button>
            </div>`;
}

//
function contentLoaded() {
    todos.push(...getTodos());
    console.log(todos);
    renderTodos();
}

//
function getTodos() {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
}

function saveTodos() {
    const todosJSON = JSON.stringify(todos);
    localStorage.setItem("todos", todosJSON);
}
