function getTodayKey() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // e.g., "2025-06-26"
}

function getLast7DaysKeys() {
    const keys = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        keys.push(date.toISOString().split('T')[0]);
    }
    return keys;
}

function saveTodayProgress(percent) {
    const key = getTodayKey();
    let history = JSON.parse(localStorage.getItem("taskHistory") || "{}");
    history[key] = percent;
    localStorage.setItem("taskHistory", JSON.stringify(history));
}

function loadBarChart() {
    const barChart = document.getElementById('barChart');
    barChart.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("taskHistory") || "{}");
    const days = getLast7DaysKeys();

    days.forEach(day => {
        const percent = history[day] || 0;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = percent + "%";
        bar.textContent = percent + "%";
        barChart.appendChild(bar);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === "") return;

    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = updateProgress;

    const span = document.createElement('span');
    span.textContent = taskText;
    span.className = "task-text";

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.onclick = function () {
        li.remove();
        updateProgress();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    document.getElementById('taskList').appendChild(li);
    input.value = '';
    updateProgress();
}

function updateProgress() {
    const tasks = document.querySelectorAll('#taskList li');
    const completed = document.querySelectorAll('#taskList li input:checked');

    const total = tasks.length;
    const done = completed.length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    // Update pie chart
    const pie = document.getElementById('pieChart');
    pie.style.background = `conic-gradient(teal 0% ${percent}%, #e0e0e0 ${percent}% 100%)`;

    // Update text
    document.getElementById('percentText').textContent = `${percent}% Done`;

    // Save and update chart
    saveTodayProgress(percent);
    loadBarChart();
}

// On page load, show weekly chart
window.onload = function () {
    loadBarChart();
};
