const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Adjust if your routes are in other files
};

const spec = swaggerJsdoc(options);
fs.writeFileSync('openapi.json', JSON.stringify(spec, null, 2));
console.log('openapi.json generated');
