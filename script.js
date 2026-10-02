

let tasks = [];

let currentFilter = "all";


// ================================
// DOM ELEMENTS
// ================================

const nameInput = document.getElementById("nameInput");
const welcomeMessage = document.getElementById("welcomeMessage");

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");


// ================================
// SAVE NAME
// ================================

function saveName() {

    const name = nameInput.value.trim();

    // Validation
    if (name === "") {
        alert("Please enter your name");
        return;
    }

    // localStorage
    localStorage.setItem("username", name);

    showName();

    nameInput.value = "";
}


// ================================
// SHOW NAME
// ================================

function showName() {

    const name = localStorage.getItem("username");

    if (name) {

        // Template literal
        welcomeMessage.textContent = `Welcome, ${name}!`;

    } else {

        welcomeMessage.textContent =
            "Welcome! Let's get things done.";
    }
}


// ================================
// ADD TASK
// ================================

function addTask() {

    const title = taskInput.value.trim();
    const date = taskDate.value;


    // Validation
    if (title === "") {

        alert("Please enter a task");

        return;
    }


    if (date === "") {

        alert("Please select a date");

        return;
    }


    // Object
    const task = {

        id: Date.now(),

        title: title,

        date: date,

        completed: false
    };


    // Add object to array
    tasks.push(task);


    saveTasks();

    displayTasks();


    // Clear input
    taskInput.value = "";
}


// ================================
// DISPLAY TASKS
// ================================

function displayTasks() {

    let filteredTasks;


    // filter()
    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }

    else if (currentFilter === "pending") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }

    else {

        filteredTasks = tasks;
    }


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found.
            </div>
        `;

        updateCounters();

        return;
    }


    // map()
    const taskHTML = filteredTasks.map(function(task) {

        return `
            <div class="task-row">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-date">
                    ${task.date}
                </div>

                <div class="status">
                    ${task.completed ? "Done" : "Pending"}
                </div>

                <div class="action-buttons">

                    <button
                        class="complete-btn"
                        onclick="completeTask(${task.id})"
                    >
                        ${task.completed ? "Undo" : "Done"}
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editTask(${task.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    });


    // DOM manipulation
    taskList.innerHTML = taskHTML.join("");


    updateCounters();
}


// ================================
// COMPLETE / UNDO TASK
// ================================

function completeTask(id) {

    // find()
    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (task) {

        task.completed = !task.completed;

        saveTasks();

        displayTasks();
    }
}


// ================================
// EDIT TASK
// ================================

function editTask(id) {

    // find()
    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;
    }


    const newTitle = prompt(
        "Enter new task:",
        task.title
    );


    if (newTitle === null) {

        return;
    }


    if (newTitle.trim() === "") {

        alert("Task cannot be empty");

        return;
    }


    task.title = newTitle.trim();


    saveTasks();

    displayTasks();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");


    if (!confirmDelete) {

        return;
    }


    // filter()
    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();
}


// ================================
// FILTERS
// ================================

function showAll() {

    currentFilter = "all";

    displayTasks();
}


function showCompleted() {

    currentFilter = "completed";

    displayTasks();
}


function showPending() {

    currentFilter = "pending";

    displayTasks();
}


// ================================
// COUNTERS
// ================================

function updateCounters() {

    const total = tasks.length;


    const completed = tasks.filter(function(task) {

        return task.completed === true;

    }).length;


    const remaining = tasks.filter(function(task) {

        return task.completed === false;

    }).length;


    totalCount.textContent = total;

    completedCount.textContent = completed;

    remainingCount.textContent = remaining;
}


// ================================
// LOCAL STORAGE
// ================================

function saveTasks() {

    // Convert array to JSON
    const data = JSON.stringify(tasks);

    localStorage.setItem("tasks", data);
}


function loadTasks() {

    const data = localStorage.getItem("tasks");


    if (data) {

        // Convert JSON back to array
        tasks = JSON.parse(data);

    }


    displayTasks();
}


// ================================
// EVENT LISTENER
// ================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();
        }

    }
);


// ================================
// START
// ================================

showName();

loadTasks();