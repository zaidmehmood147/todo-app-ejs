const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getHome);
router.post('/todos', todoController.addTodo);
router.put('/todos/:id', todoController.updateStatus);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;