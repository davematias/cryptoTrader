const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

module.exports.init = function init() {
    // Parsers for POST data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Cross Origin middleware
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/api', (req, res) => {
        res.send('api started');
    });

    // Set our api router
    //app.use('/api', api);

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../frontend/web-ui/build')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname+'../frontend/web-ui/build/index.html'));
    });

    const port = process.env.PORT || 5000;
    app.listen(port);

    console.log(`Server listening on ${port}`);
}