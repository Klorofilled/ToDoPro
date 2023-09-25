const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const port = 3000;

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware Section
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a Schema for To-Do Items
const todoSchema = new mongoose.Schema({
  task: String
});

const Todo = mongoose.model('Todo', todoSchema);

// Define Routes and CRUD Operations
app.get('/', async (req, res) => {
    const todos = await Todo.find({})
    res.render('index', { todos });   
});

// Add a new task
app.post('/add', async (req, res) => {
  const newTask = req.body;
  const todo = new Todo(newTask);
  await todo.save();
  res.redirect('/')
});

// Delete a task
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await Todo.findByIdAndRemove(id);
  res.redirect('/')
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
