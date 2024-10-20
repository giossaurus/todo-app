const API_URL = 'http://localhost:3000/api'
let token = localStorage.getItem('token');

const authContainer = document.getElementById('auth-container')
const todoContainer = document.getElementById('todo-container')
const loginForm = document.getElementById('login-form')
const registerLink = document.getElementById('register-link')
const newTaskInput = document.getElementById('new-task')
const addTaskButton = document.getElementById('add-task')
const taskList = document.getElementById('task-list')

loginForm.addEventListener('submit', handleLogin)
registerLink.addEventListener('click', showRegisterForm)
addTaskButton.addEventListener('click', addTask)

if (token) {
    showTodoApp()
} else {
    showAuthForm()
}

function showAuthForm() {
    authContainer.style.display = 'block'
    todoContainer.style.display = 'none'
}

function showTodoApp() {
    authContainer.style.display = 'none'
    todoContainer.style.display = 'block'
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

        if (!response.ok) throw new Error('Login failed')

        const data = await response.json()
        token = data.token;
        localStorage.setItem('token', token)
        showTodoApp();
    } catch (error) {
        alert('Login failed. Please try again.')
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Registration failed')

        const data = await response.json()
        token = data.token;
        localStorage.setItem('token', token)
        showTodoApp();
    } catch (error) {
        alert('Registration failed. Please try again.')
    }
}

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch tasks')

        const tasks = await response.json()
        renderTasks(tasks)
    } catch (error) {
        alert('Failed to fetch tasks. Please try again.')
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = ''
    tasks.forEach(task => {
        const li = document.createElement('li')
        li.className = 'list-group-item d-flex justify-content-between align-items-center'
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}', this.checked)">
                <label class="form-check-label ${task.completed ? 'text-muted text-decoration-line-through' : ''}">
                    ${task.title}
                </label>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-light me-2" onclick="editTask('${task._id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `
        taskList.appendChild(li);
        
        setTimeout(() => li.style.opacity = '1', 50 * tasks.indexOf(task));
    })
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
        })

        if (!response.ok) throw new Error('Failed to update task')

        const taskElement = document.querySelector(`[data-task-id="${id}"]`)
        const labelElement = taskElement.querySelector('.form-check-label')
        
        if (completed) {
            labelElement.classList.add('text-muted', 'text-decoration-line-through')
        } else {
            labelElement.classList.remove('text-muted', 'text-decoration-line-through')
        }

        taskElement.style.transition = 'transform 0.3s ease'
        taskElement.style.transform = 'scale(1.05)'
        setTimeout(() => taskElement.style.transform = 'scale(1)', 300)

    } catch (error) {
        alert('Failed to update task. Please try again.')
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Failed to delete task')

        const taskElement = document.querySelector(`[data-task-id="${id}"]`)
        taskElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        taskElement.style.opacity = '0'
        taskElement.style.transform = 'translateX(20px)'
        setTimeout(() => taskElement.remove(), 300)

    } catch (error) {
        alert('Failed to delete task. Please try again.')
    }
}

async function addTask() {
    const title = newTaskInput.value.trim()
    if (!title) return

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        })

        if (!response.ok) throw new Error('Failed to add task')

        const task = await response.json()
        const li = document.createElement('li')
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.setAttribute('data-task-id', task._id)
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" onchange="toggleTask('${task._id}', this.checked)">
                <label class="form-check-label">${task.title}</label>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-light me-2" onclick="editTask('${task._id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `
        li.style.opacity = '0'
        li.style.transform = 'translateY(20px)'
        taskList.insertBefore(li, taskList.firstChild)
        setTimeout(() => {
            li.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
            li.style.opacity = '1'
            li.style.transform = 'translateY(0)'
        }, 50)

        newTaskInput.value = ''
    } catch (error) {
        alert('Failed to add task. Please try again.')
    }
}