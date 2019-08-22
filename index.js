const express = require("express");
const server = express();
server.listen(3000);
server.use(express.json());

let numberOfRequests = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(obj => obj.id === id);

  if (projects.length <= 0 || !project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.use((req, res, next) => {
  numberOfRequests++;
  console.log(`Number of requests: ${numberOfRequests}`);
  next();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(obj => obj.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(obj => obj.id === id);

  project.title = title;

  return res.json(project);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id === id);

  project.tasks.push(title);

  return res.json(project);
});
