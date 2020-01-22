const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

/**
 * Middleware global, que é acionada ao acessar qualquer rota  
 */
server.use(countRequest, (req, res, next) => {
  const method = req.method.toString();
  next();
  if(method != "GET"){
    console.table(projects);
  }
});

/**
 * Middleware que irá contar a quantidade de requisições acionadas
 */
function countRequest(req, res, next){
  console.count("Number of requisitions")
  next();
}

/**
 * Middleware que checa se tem titulo no corpo da requisição 
 */
function titleBodyExist(req, res, next){
  const { title } = req.body;
  if (!title){
    return res.status(400).json({error: "Title of project is required."})
  }
  return next();
}

/**
 * Middleware que verifica se o projeto existe com o ID passado nos parametros
 */
function projectExist(req, res, next){
  const { id } = req.params;
  const project = projects.find( p => p.id == id);
  if (!project){
    return res.status(400).json({error: "Project does not exists."});
  }
  req.project = project;
  return next();
}

/**
 * Rota que lista todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Rota que lista apenas 1 projeto
 */
server.get('/projects/:id', projectExist, (req, res) => {
  return res.json(req.project);
})

/**
 * Rpta que inseri novos projetos
 */
server.post('/projects', titleBodyExist, (req,res) => {
  const {title} = req.body;
  const id = projects.length + 1;
  const project = {
      "id": id,
      "title": title,
      "tasks": []
  }
  projects.push(project);
  return res.json(projects);
});

/**
 * Rota que modifica um projeto de acordo com o ID passado nos parametros
 */
server.put('/projects/:id', projectExist, titleBodyExist, (req,res) => {
  const { title } = req.body;
  req.project.title = title;
  return res.json(projects)
});

/**
 * Rota que apaga um projeto de acordo com o ID passado nos parametros
 */
server.delete('/projects/:id', projectExist, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  return res.send();
});

/**
 * Rota que inseri novas tasks
 */
server.post('/projects/:id/tasks', projectExist, (req,res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  return res.json(req.project)
});

/**
 * Definindo porta e ip do servidor
 */
server.listen(process.env.PORT, process.env.IP);