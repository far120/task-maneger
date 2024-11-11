Acount of user ===>>>> 
email = user@user.com
password = 123456789


Acount of adminserver ===>>>> 
email = adminserver@adminserver.com
password = 123456789

if you want create adminserver 
email = name@adminserver.com



// instruction of	React\\
npx create-react-app name  
npm install react-router-dom
npm install axios
npm install jwt-decode
 run ===>>> npm start  

// instruction of node.js and express\\

npm init -y
npm install express
npm install -g nodemon
npm install mongoose
npm install cors 
npm install dotenv
npm install joi
npm install jsonwebtoken
 run ===>>> npm start  





////Descriepsion\\\\
Authentication (Backend):
User and AdminServer Roles:

POST: Create an account with an image upload (using Multer).
PUT: Update the user account using JWT token-based authentication.
DELETE: AdminServer can delete user accounts.
GET: Retrieve user tasks, with filters for completion status (completed/not completed) and task dates (today, previous days, or next days).
Login: Users can log in to access CRUD operations for task management.
AdminServer Dashboard:

AdminServer can view a dashboard displaying the tasks of all users, including actions like creating, updating, deleting, or completing tasks.
2. Task Manager (Backend):
POST: Create tasks.
PUT: Update tasks (title, description, completed status, due date), done by the user who created the task, using their JWT token.
DELETE: Delete tasks by the user who created the task.
Dark/Light Mode: The application supports both dark and light themes.
Frontend:
Responsive Design: The site is designed to be mobile-friendly and adjusts layout using media queries to ensure proper display on different screen sizes.
This system integrates user authentication and task management with role-based access control, allowing users to manage tasks and giving AdminServer the ability to manage user accounts and tasks.
