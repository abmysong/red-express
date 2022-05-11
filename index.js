const express = global.express = require('express');
const app = express();

// Swagger
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

// Mock data
global.mocks = {
  members: require('./mocks/members.json'),
  items: require('./mocks/items.json'),
};

// CROSS, Methods, Headers
app.use(function(request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API router
app.use(express.json());
app.use('/api/v1/members', require('./routes/members.js'));
app.use('/api/v1/search', require('./routes/search.js'));
app.use('/api/v1/items', require('./routes/items.js'));

// Start server
global.location = new URL('http://localhost:3100');
app.listen(global.location.port, function() {
  console.log('Express server listening on ' + global.location.origin + '/api/v1/members');
  console.log('Swagger on ' + global.location.origin + '/api-docs');
});
