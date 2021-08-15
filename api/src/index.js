const express = require('express');
const app = express();

const port = 3080;
app.get('/', (req, res) => res.send('My first Node API!'));
app.listen(port, () => {
    console.log('Listening on port ' + port);
});
