let todos = [
  { id: 1, task: 'Learn Express.js', status: false },
  { id: 2, task: 'Build a Todo App', status: true },
  { id: 3, task: 'Deploy to production', status: false }
];
let nextId = 4;

const getHome = (req, res) => {
  res.render('index', { todos });
};

const addTodo = (req, res) => {
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
};

const updateStatus = (req, res) => {
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
};

const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(todoIndex, 1);
  res.json({ success: true, message: 'Todo deleted successfully' });
};

module.exports = {
  getHome,
  addTodo,
  updateStatus,
  deleteTodo
};