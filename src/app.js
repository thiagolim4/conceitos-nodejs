const express = require("express");
const cors = require("cors");
const { json } = require("express");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  // receber dentro do corpo da requisicao title, url e techs
  const { title, url, techs } = request.body;

  const newRepository = { 
    id: uuid(), 
    title: title, 
    url: url, 
    techs: techs, 
    likes: 0 
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // procura o repository atraves do id
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  // seta o status do retorno e uma mensagem caso nao encontre
	if (repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories[repositoryIndex] = {...repositories[repositoryIndex], title, url, techs};

  return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

	// procura o repository atraves do id
	const repositoryIndex = repositories.findIndex(repository => repository.id == id);

	// seta o status do retorno e uma mensagem
	if (repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository not found.'})
	}

  // deleta um repositorio da lista
	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  // procura o repository atraves do id
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  // seta o status do retorno e uma mensagem caso nao encontre
	if (repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository not found.'})
  }

  let { likes } = repositories[repositoryIndex];
  likes = likes + 1;

  repositories[repositoryIndex] = {...repositories[repositoryIndex], likes};

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
