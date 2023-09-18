const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const { body, validationResult } = require('express-validator');

  
// Routes
app.get('/', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./data.json'));
  res.render('user-list.ejs', { users });
});


app.get('/user/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./data.json'));
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.render('user-form.ejs', { user });
});


app.post('/user/:id',val(), (req, res) => {

  const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
  
      const errorHtml = htm(errorMessages)

      
      res.status(400).send(errorHtml);
      return;
    }
  const users = JSON.parse(fs.readFileSync('./data.json'));
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);



  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    fs.writeFileSync('./data.json', JSON.stringify(users, null, 2));
  }

  res.redirect('/');
});




app.get('/user-form', (req, res) => {
  res.render('user-form.ejs', { user: null, errors: null});
});


app.post('/user-form',val(), (req, res) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
  
      const errorHtml = htm(errorMessages)
      
      res.status(400).send(errorHtml);
      return;
    }


  const users = JSON.parse(fs.readFileSync('./data.json'));
  const newUserId = users.length + 1;
  const newUser = { id: newUserId, ...req.body };
  users.push(newUser);
  fs.writeFileSync('./data.json', JSON.stringify(users, null, 2));
  res.redirect('/');
});



app.get('/user/delete/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./data.json'));
  const userId = parseInt(req.params.id);
  const updatedUsers = users.filter(u => u.id !== userId);
  fs.writeFileSync('./data.json', JSON.stringify(updatedUsers, null, 2));
  res.redirect('/');
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



function val () {
  return [
    body('fname').notEmpty().withMessage('First name is required and must not be empty')
      .isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),

    body('lname').notEmpty().withMessage('Last name is required and must not be empty')
      .isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),

    body('age').notEmpty().withMessage('Age is required and must not be empty')
      .isInt({ min: 1, max: 120 }).withMessage('Age must be a number between 1 and 120'),

    body('gender').notEmpty().withMessage('Gender is required and must not be empty')
      .isLength({ min: 3 }).withMessage('Gender must be at least 3 characters long'),


    body('education').trim().notEmpty().withMessage('Education field is required and must not be empty')
      .isLength({ max: 20 }).withMessage('Education field cannot exceed 20 characters'),

    body('phoneNumber').trim().notEmpty().withMessage('Phone number is required and must not be empty')
      .isMobilePhone().withMessage('Invalid phone number format'),

    body('email').trim().notEmpty().withMessage('Email is required and must not be empty')
      .isEmail().withMessage('Invalid email format'),
  ];
}


function htm(errorMessages) {
  const messages = errorMessages;

  return `
    <html>
      <head>
        <title>Error Page</title>
        <style>
          body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: #fff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            border-r us: 10px;
            padding: 20px;
            max-width: 400px;
            display: block;
          }
          
          h1 {
            color: #ff0000; /* Change the color to your desired color */
          }
          p {
            color: #333; /* Change the color to your desired color */
            margin: 20px 0; /* Add spacing between each paragraph */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Error Messages</h1>
          ${messages.map(message => `<p>${message}</p>`).join('')}
        </div>
        <div>
        <button class="goback-btn" onclick="goBack()">Change</button>
        </div>
        <script>
          function goBack() {
            window.history.back();
          }
        </script>
      </body>
    </html>
  `;
}



