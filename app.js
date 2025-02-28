const columns = document.querySelectorAll('.column');
let draggedTask = null;
let editingTask = null;

// تسک‌های اولیه
// const defaultTasks = {
//     todo: [
//         { text: 'طراحی صفحه اصلی سایت مشتری', status: 'todo' },
//         { text: 'بررسی مشکلات سرور اصلی', status: 'todo' },
//         { text: 'آماده‌سازی ارائه برای تیم فروش', status: 'todo' },
//         { text: 'به‌روزرسانی پکیج‌های پروژه', status: 'todo' }
//     ],
//     doing: [
//         { text: 'کدنویسی ماژول پرداخت آنلاین', status: 'doing' },
//         { text: 'رفع باگ فرم ثبت‌نام کاربران', status: 'doing' },
//         { text: 'تست عملکرد اپلیکیشن موبایل', status: 'doing' }
//     ],
//     done: [
//         { text: 'ارسال ایمیل گزارش هفتگی به مدیر', status: 'done' },
//         { text: 'طراحی لوگوی جدید شرکت', status: 'done' },
//         { text: 'تهیه بکاپ دیتابیس', status: 'done' }
//     ]
// };

// لود تسک‌ها
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || defaultTasks;
    Object.keys(tasks).forEach(status => {
        const column = document.querySelector(`[data-status="${status}"] .tasks`);
        column.innerHTML = '';
        tasks[status].forEach(task => {
            const taskElement = createTaskElement(task.text, task.status);
            column.appendChild(taskElement);
        });
    });
}

// ساخت المنت تسک
function createTaskElement(text, status) {
    const task = document.createElement('div');
    task.className = 'task bg-gray-700 p-4 rounded-lg mb-2 shadow-md hover:bg-gray-600 transition flex justify-between items-center';
    task.draggable = true;
    task.dataset.status = status;
    task.innerHTML = `
        <span>${text}</span>
        <div>
            <button class="edit-btn text-blue-400 hover:text-blue-300 mr-2">✏️</button>
            <button class="delete-btn text-red-400 hover:text-red-300">🗑️</button>
        </div>
    `;

    task.querySelector('.edit-btn').addEventListener('click', () => openEditModal(task));
    task.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task));
    task.addEventListener('dragstart', () => {
        draggedTask = task;
        task.classList.add('dragging');
    });
    task.addEventListener('dragend', () => {
        draggedTask = null;
        task.classList.remove('dragging');
        columns.forEach(col => col.classList.remove('drag-over'));
        saveTasks();
    });

    return task;
}

// حذف تسک
function deleteTask(task) {
    task.remove();
    saveTasks();
}

// باز کردن مدال ویرایش
function openEditModal(task) {
    editingTask = task;
    document.getElementById('edit-task-text').value = task.querySelector('span').textContent;
    document.getElementById('edit-modal').classList.remove('hidden');
}

// ذخیره ویرایش
document.getElementById('save-edit').addEventListener('click', () => {
    if (editingTask) {
        const newText = document.getElementById('edit-task-text').value.trim();
        if (newText) {
            editingTask.querySelector('span').textContent = newText;
            saveTasks();
        }
        closeEditModal();
    }
});

// لغو ویرایش
document.getElementById('cancel-edit').addEventListener('click', closeEditModal);

function closeEditModal() {
    editingTask = null;
    document.getElementById('edit-modal').classList.add('hidden');
}

// ذخیره تسک‌ها
function saveTasks() {
    const tasks = { todo: [], doing: [], done: [] };
    columns.forEach(column => {
        const status = column.dataset.status;
        const taskElements = column.querySelectorAll('.task');
        taskElements.forEach(task => {
            tasks[status].push({
                text: task.querySelector('span').textContent,
                status: status
            });
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// درگ و دراپ
columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        column.classList.add('drag-over');
    });
    column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
    });
    column.addEventListener('drop', () => {
        if (draggedTask) {
            const tasksContainer = column.querySelector('.tasks');
            tasksContainer.appendChild(draggedTask);
            draggedTask.dataset.status = column.dataset.status;
            column.classList.remove('drag-over');
            saveTasks();
        }
    });
});

// اضافه کردن تسک جدید
document.getElementById('add-task').addEventListener('click', () => {
    const taskText = document.getElementById('new-task').value.trim();
    if (taskText) {
        const newTask = createTaskElement(taskText, 'todo');
        document.querySelector('[data-status="todo"] .tasks').appendChild(newTask);
        document.getElementById('new-task').value = '';
        saveTasks();
    }
});

// لود اولیه
loadTasks();