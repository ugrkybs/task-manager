// script.js

// DOM Elements
const taskNameInput = document.getElementById('task-name');
const taskCategoryInput = document.getElementById('task-category');
const taskDateInput = document.getElementById('task-date');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('tasks');
const filterCategoryInput = document.getElementById('filter-category');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const taskProgress = document.getElementById('task-progress');

// Temporary task storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add Task Function
function addTask() {
    const taskName = taskNameInput.value.trim();
    const taskCategory = taskCategoryInput.value;
    const taskDate = taskDateInput.value;

    if (!taskName || !taskDate) {
        alert('Please fill in all required fields!');
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        category: taskCategory,
        date: taskDate,
        completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    clearForm();
}

// Render Tasks Function
function renderTasks(filter = '') {
    taskList.innerHTML = '';

    const filteredTasks = filter ? tasks.filter(task => task.category === filter) : tasks;

    filteredTasks.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('p-4', 'border', 'border-gray-300', 'rounded-md', 'bg-gray-50');
        taskItem.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold">${task.name}</h3>
                    <p class="text-sm text-gray-600">Category: ${task.category}</p>
                    <p class="text-sm text-gray-600">Due: ${task.date}</p>
                </div>
                <div>
                    <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700" onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700" onclick="editTask(${task.id})">Edit</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    updateProgress();
}

// Save Tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete Task Function
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Edit Task Function
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        taskNameInput.value = task.name;
        taskCategoryInput.value = task.category;
        taskDateInput.value = task.date;
        deleteTask(taskId);
    }
}

// Toggle Task Completion
function toggleComplete(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Clear Form Function
function clearForm() {
    taskNameInput.value = '';
    taskCategoryInput.value = 'work';
    taskDateInput.value = '';
}

// Filter Tasks by Category
filterCategoryInput.addEventListener('change', () => {
    const filter = filterCategoryInput.value;
    renderTasks(filter);
});

// Update Progress Tracker
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    taskProgress.textContent = `Progress: ${completedTasks} / ${totalTasks} tasks completed`;
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
darkModeToggle.addEventListener('click', toggleDarkMode);

// Event Listeners
addTaskButton.addEventListener('click', addTask);

// Initial Render
renderTasks();
