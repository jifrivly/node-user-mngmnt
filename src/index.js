const express = require('express');
const { User } = require('./User');

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/status');
});

app.get('/users', User.readAll);
app.post('/users', User.addUser);

app.get('/status', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Employee Management App running.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running... \ncheck status at: http://localhost:${PORT}/status`);
});

// require('./database/test').connectionTest();
// require('./database/test').test();
