
const todoList = document.getElementById('todoList');
const addTodoForm = document.getElementById('addTodoForm');
const taskInput = document.getElementById('taskInput');


function updateStats(todos) {
    const total = todos.length;
    const completed = todos.filter(t => t.status).length;
    const pending = total - completed;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;
}


addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    
    if (!task) {
        alert('Please enter a task');
        return;
    }
    
    try {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `task=${encodeURIComponent(task)}`
        });
        
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        alert('Failed to add todo');
        console.error(error);
    }
});


todoList.addEventListener('change', async (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
        const todoItem = e.target.closest('.todo-item');
        const id = todoItem.dataset.id;
        const isChecked = e.target.checked;
        
        
        const taskText = todoItem.querySelector('.task-text');
        const statusBadge = todoItem.querySelector('.status-badge');
        
        taskText.classList.toggle('completed', isChecked);
        statusBadge.textContent = isChecked ? 'Done' : 'Pending';
        statusBadge.className = `status-badge ${isChecked ? 'done' : 'pending'}`;
        
        
        e.target.disabled = true;
        todoItem.classList.add('loading');
        
        try {
            const response = await fetch(`/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: isChecked })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update');
            }
            
            
            const todos = Array.from(todoList.querySelectorAll('.todo-item')).map(item => ({
                status: item.querySelector('.todo-checkbox').checked
            }));
            updateStats(todos);
            
        } catch (error) {
            
            e.target.checked = !isChecked;
            taskText.classList.toggle('completed', !isChecked);
            statusBadge.textContent = !isChecked ? 'Done' : 'Pending';
            statusBadge.className = `status-badge ${!isChecked ? 'done' : 'pending'}`;
            alert('Failed to update status');
        } finally {
            e.target.disabled = false;
            todoItem.classList.remove('loading');
        }
    }
});


todoList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const todoItem = e.target.closest('.todo-item');
        
        if (!confirm('Delete this todo?')) {
            return;
        }
        
        todoItem.classList.add('loading');
        
        try {
            const response = await fetch(`/todos/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete');
            }
            
            todoItem.remove();
            
            const todos = Array.from(todoList.querySelectorAll('.todo-item')).map(item => ({
                status: item.querySelector('.todo-checkbox').checked
            }));
            updateStats(todos);
            
        } catch (error) {
            alert('Failed to delete');
            todoItem.classList.remove('loading');
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const todos = Array.from(todoList.querySelectorAll('.todo-item')).map(item => ({
        status: item.querySelector('.todo-checkbox').checked
    }));
    updateStats(todos);
});