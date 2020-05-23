const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = []

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  if(!isUuid(project.id))
    response.status(400).json({ error: "Project malformed"})

  repositories.push(project)

  response.status(200).json(project)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if(repositoriesIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found" })
  }

  const project = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes
  }

  repositories[repositoriesIndex] = project

  return response.status(200).json(repositories[repositoriesIndex])
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found."})
  }

  repositories.slice(repositoriesIndex, 1)

  return response.status(200).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositoriesIndex < 0)
    return response.status(400).json({ error: "Repositorie not found."})

  const like = {
    id: uuid(),
    date: new Date(),
    repositorie_id: id
  }

  likes.push(like)
  repositories[repositoriesIndex].likes += 1

  response.status(200).json(repositories[repositoriesIndex])

});

module.exports = app;
