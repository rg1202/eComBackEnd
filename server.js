const express = require('express');
const routes = require('./routes');

// import sequelize connection
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync then turn on the server
app.listen(PORT, () => {
  console.log(`Success! Listening on port ${PORT}!`);
});