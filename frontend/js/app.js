const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// DOM elements
const authContainer = document.getElementById('auth-container');
const todoContainer = document.getElementById('todo-container');
const loginForm = document.getElementById('login-form');
const registerLink = document.getElementById('register-link');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Event listeners
loginForm.addEventListener('submit', handleLogin);
registerLink.addEventListener('click', showRegisterForm);
addTaskButton.addEventListener('click', addTask);

// Check if user is logged in
if (token) {
    showTodoApp();
} else {
    showAuthForm();
}

function showAuthForm() {
    authContainer.style.display = 'block';
    todoContainer.style.display = 'none';
}

function showTodoApp() {
    authContainer.style.display = 'none';
    todoContainer.style.display = 'block';
    fetchTasks();
}

function showRegisterForm() {
    const form = loginForm;
    form.innerHTML = `
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Register</button>
    `;
    form.removeEventListener('submit', handleLogin);
    form.addEventListener('submit', handleRegister);
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        token = data.token;
        localStorage.setItem('token', token);
        showTodoApp();
    } catch (error) {
        alert('Login failed. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Registration failed');

        const data = await response.json();
        token = data.token;
        localStorage.setItem('token', token);
        showTodoApp();
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
}

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        alert('Failed to fetch tasks. Please try again.');
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item task-item';
        li.innerHTML = `
            <div>
                <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}', this.checked)">
                <span class="${task.completed ? 'completed-task' : ''}">${task.title}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task._id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = newTaskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) throw new Error('Failed to add task');

        newTaskInput.value = '';
        fetchTasks();
    } catch (error) {
        alert('Failed to add task. Please try again.');
    }
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) throw new Error('Failed to update task');

        fetchTasks();
    } catch (error) {
        alert('Failed to update task. Please try again.');
    }
}

async function editTask(id) {
    const newTitle = prompt('Enter new task title:');
    if (!newTitle) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: newTitle })
        });

        if (!response.ok) throw new Error('Failed to update task');

        fetchTasks();
    } catch (error) {
        alert('Failed to update task. Please try again.');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete task');

        fetchTasks();
    } catch (error) {
        alert('Failed to delete task. Please try again.');
    }
}