create database pwb;
use pwb;
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(255) NOT NULL
);

CREATE TABLE pwb.projects (
  project_id INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(255) NOT NULL,
  project_description VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  team_lead_id INT NOT NULL,
  FOREIGN KEY (team_lead_id) REFERENCES users (user_id)
);

CREATE TABLE teams (
  team_id INT PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  team_lead_id INT NOT NULL,
  FOREIGN KEY (team_lead_id) REFERENCES users (user_id)
);

CREATE TABLE issues (
  issue_id INT PRIMARY KEY,
  issue_type VARCHAR(255) NOT NULL,
  issue_summary VARCHAR(255) NOT NULL,
  issue_description VARCHAR(255) NOT NULL,
  assigned_to_user_id INT NOT NULL,
  current_state VARCHAR(255) NOT NULL,
  priority_level VARCHAR(255) NOT NULL,
  expected_completion_date DATE NOT NULL,
  created_date DATE NOT NULL,
  updated_date DATE NOT NULL,
  FOREIGN KEY (assigned_to_user_id) REFERENCES users (user_id)
);
CREATE TABLE comments (
  comment_id INT PRIMARY KEY,
  comment_text VARCHAR(255) NOT NULL,
  issue_id INT NOT NULL,
  user_id INT NOT NULL,
  created_date DATE NOT NULL,
  updated_date DATE NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issues (issue_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE attachments (
  attachment_id INT PRIMARY KEY,
  attachment_name VARCHAR(255) NOT NULL,
  issue_id INT NOT NULL,
  user_id INT NOT NULL,
  created_date DATE NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issues (issue_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);
INSERT INTO Users (user_id, user_name, user_email, user_password, user_role) VALUES (1, 'Ali Ahmed', 'ali.ahmed@yahoo.com', 'password', 'ali');
INSERT INTO pwb.Projects (project_id, project_name, project_description, start_date, end_date, team_lead_id) VALUES (1, 'Project X', 'This is project X', '2022-01-01', '2022-12-31', 1);
INSERT INTO pwb.Issues (issue_id, issue_type, issue_summary, issue_description, assigned_to_user_id, current_state, priority_level, expected_completion_date) VALUES (1, 'Bug', 'Login not working', 'User is unable to login to the system', 1, 'Open', 'High', '2022-03-15'), (2, 'Task', 'Create new homepage', 'Redesign the homepage of the website', 1, 'In Progress', 'Medium', '2022-04-30');
INSERT INTO pwb.Users (user_id, user_name, user_email, user_password, user_role) VALUES (2, 'fatima', 'fatima.khan@hotmail.com', 'password', 'admin');
delete pwb.projects;