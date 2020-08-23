const app = require('./config/express');
const mongoose = require('./config/mongoose');
const { server } = require('./config/vars');

mongoose.connect();

const port = 3000;

app.listen(port, () => console.log(`Server running on ${server.uri}`));
