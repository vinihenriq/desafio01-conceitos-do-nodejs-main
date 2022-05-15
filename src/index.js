const express = require('express');
const { v4: uuidv4 } = require("uuid");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
    const { username } = request.headers;

    const user = users.find(user => user.username === username);

    if(!user) {
        return response.status(404).json({ error: "User not found" });
    }

    request.user = user;

    return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const user = users.find(user => user.username === username);

  if(user) {
        return response.status(400).json({ error: "Username alredy exists!" });
  }

  users.push(
    {
      id: uuidv4(),
      name,
      username,
      todos: [] 
    }
  );

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;

  todoInfomations = {
        id: uuidv4(),
	      title,
	      done: false, 
	      deadline: new Date(deadline), 
	      created_at: new Date()
  }

  user.todos.push(todoInfomations);

  return response.status(201).send().json(user.todos);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    const {id} = request.params;
    const { title, deadline } = request.body;

    const todo = user.todos.find(todo => todo.id === id);

    if(!todo) {
      return response.status(404).json({ error: "ToDo not exists!" });
}

    todo.title = title;
    todo.deadline = new Date(deadline);

    return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } =  request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({ error: "ToDo not exists!" });
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } =  request;
  const { id } = request.params;

  const indexTodo = user.todos.findIndex(todo => todo.id === id);

  if(indexTodo === -1) {
    return response.status(404).json({error: "ToDo not found!"})
  }

  user.todos.splice(indexTodo, 1);

  return response.status(204).send();

});

module.exports = app;