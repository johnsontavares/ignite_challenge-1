const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
// const todos = [];

function checksExistsUserAccount(request, response, next) {
  const {username } = request.headers;

  const user = users.find((user) => user.username === username)

  if(!user){
    return response.status(400).json({error: "User not found! "})
  }

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  const{name, username} = request.body

  const checkeUserAlreadyExists = users.find((user) => user.username === username)

  if(checkeUserAlreadyExists){
    return response.status(400).json({error: "Usuário já cadastrado! "})
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos : []
  }

  users.push(user)

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const{user} = request
  return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const{title, deadline} = request.body
  const{user} = request

  const todo = {
    id : uuidv4(),
    title, 
    done : false,
    deadline: new Date(deadline),
    created_at : new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user } = request
  const{ title, deadline} = request.body
  const {id } = request.params

  const userTodo = user.todos.find((user) => user.id === id)

  if(!userTodo){
    return response.status(404).json({error: "Todo não encontrado! "})
  }
  userTodo.title = title
  userTodo.deadline = deadline

  return response.status(201).json(userTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const{user} = request
  // const { done } = request.body
  const{id} = request.params

  const userDone = user.todos.find((element) => element.id === id)

  if(!userDone){
    return response.status(404).json({error: "Usuário não encontrado! "})
  }

  userDone.done = true

  return response.status(201).json(userDone)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {


  const{user} = request
  const{id} = request.params

  const Todo = user.todos.find((user) => user.id === id)

  if(!Todo){
    return response.status(404).json({error: "Todo não encontrado! "})
  }

  user.todos.splice(Todo, 1)
  return response.status(204).send()
});

module.exports = app;