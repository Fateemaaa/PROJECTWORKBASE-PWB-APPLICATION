const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const session = require('express-session');
app.use(session({
  secret: 'fatima',
  resave: false,
  saveUninitialized: true
}));


const pool = mysql.createPool({
  host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'pwb',
});
var connection = require('./database');

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('login');
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  


  connection.query('SELECT * FROM pwb.users WHERE user_email = ? AND user_password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.send('Error occurred during authentication');
      return;
    }
    if (results.length > 0) {
      req.session.userId = results[0].user_id;
      req.session.userRole = results[0].user_role;
      res.redirect('/home');
    } else {
      res.send('Invalid credentials!');
    }
  });
});

app.get('/projects', (req, res) => {
  const authenticated = req.session.userId ? true : false;
  const userId = req.session.userId || null;

  if (!authenticated) {
    res.render('projects', { authenticated: false });
    return;
  }

  pool.query('SELECT * FROM pwb.projects WHERE team_lead_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.send('Error occurred while fetching projects');
      return;
    }

    const projects = results;

    res.render('projects', { authenticated: true, user: userId, projects });
  });
});

app.get('/home', (req, res) => {
  const authenticated = req.session.userId ? true : false;
  const userId = req.session.userId || null;

  if (!authenticated) {
    res.render('home', { authenticated: false });
    return;
  }

  pool.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.send('Error occurred while fetching user details');
      return;
    }

    const user = results[0];

    res.render('home', { authenticated: true, user });
  });
});


app.get('/issues', (req, res) => {
  const authenticated = req.session.userId ? true : false;
  const userId = req.session.userId || null;

  if (!authenticated) {
    res.render('issues', { authenticated: false });
    return;
  }

  pool.query('SELECT * FROM issues WHERE assigned_to_user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.send('Error occurred while fetching issues');
      return;
    }

    const issues = results;

    res.render('issues', { authenticated: true, issues });
  });
});

app.get('/projects/:projectId', function(req, res) {
  const authenticated = req.session.userId ? true : false;
  var projectId = req.params.projectId;
  console.log(projectId);
  pool.query('SELECT * FROM pwb.projects WHERE project_id = ?', [projectId], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.send('Error occurred while fetching projects');
      return;
    }
  var project = results
  console.log(results);
  res.render('project-details', { authenticated: true, project});
});

});

// app.js

// ...

// Create Project Page
app.get('/create-project', (req, res) => {

  const authenticated = req.session.userId ? true : false;
  if (!authenticated) {
    return res.render('create-project', { authenticated: false });
  }
  // Check if user is an admin
  if (req.session.userRole !== 'admin') {
    return res.render('create-project', { authenticated: true, isAdmin: false });
  }

  return res.render('create-project', { authenticated: true, isAdmin: true });
});

// Handle Project Creation Form Submission
app.post('/create-project', (req, res) => {
  const authenticated = req.session.userId ? true : false;
  if (!authenticated || req.session.userRole !== 'admin') {
    return res.redirect('/create-project');
  }

  // Extract project data from the request body
  const { projectName, projectDescription, startDate, endDate, teamLeadId } = req.body;

  // Create the new project object
  const newProject = {
    project_name: projectName,
    project_description: projectDescription,
    start_date: startDate,
    end_date: endDate,
    team_lead_id: teamLeadId
  };

  // Insert the new project into the database
  connection.query('INSERT INTO pwb.projects SET ?', newProject, (error, results) => {
    if (error) {
      console.error('Failed to create project:', error);
      return res.redirect('/create-project');
    }

    // Redirect to the project page after successful creation
    res.redirect('/projects');
  });
});

// ...


app.listen(3000, function() {
    connection.connect(function(err){
        if(err) throw err;
        console.log('Database connected!');
    })
});
