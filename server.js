const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


let todos = [
  { id: 1, task: 'Learn Express.js', status: false },
  { id: 2, task: 'Build a Todo App', status: true },
  { id: 3, task: 'Deploy to production', status: false }
];

let nextId = 4;


app.get('/', (req, res) => {
  res.render('index', { todos });
});


app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task cannot be empty' });
  }
  
  const newTodo = {
    id: nextId++,
    task: task.trim(),
    status: false
  };
  todos.push(newTodo);
  res.redirect('/');
});


app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  if (typeof status !== 'boolean') {
    return res.status(400).json({ error: 'Status must be a boolean' });
  }
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos[todoIndex].status = status;
  res.json({ 
    success: true, 
    todo: todos[todoIndex],
    message: `Todo status updated to ${status}`
  });
});


app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.json({ success: true, message: 'Todo deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});