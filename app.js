'use strict';

var express = require('express'); // required to create http server
var bodyParser = require('body-parser'); // required to parse incoming request bodies
var app = express().use(bodyParser.json()); // creates http server
var winston = require('winston'); // data logger
var expressWinston = require('express-winston'); // required to create middleware that log http requests
expressWinston.requestWhitelist.push('body');
var port = process.env.PORT || 3000 // setting the port the server should listen to 
process.env.SECRET_HASH = "your-secret-hash" // making the secret hash you set in your dashboard available to the environment variable
app.set('port', port);


/*

using expressWinston to parse webhook http requests to display in the console 
and also write into a .txt file called combined.log.

*/

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        })
    ]
}));


//  Set the port the server is listening to 

app.listen(port, () => console.log('Webhook is listening to port: ' + port));

app.get('/', (req, res) => res.send('Hello World!'))


/* 

Set your webhook url that will be listening for webhook requests from rave server,
This is required to receive requests from rave server, verify the data received from the server 
and give your customer value.

*/

app.post("/webhook-url", function (req, res) {
    /* It is a good idea to log all events received. Add code *
     * here to log the signature and body to db or file       */

    // retrieve the signature from the header
    var hash = req.headers["verif-hash"];

    if (!hash) {
        // discard the request,only a post with rave signature header gets our attention 
        res.send({
            status: "error"
        });
        process.exit(0)
        // console.log("no hash sent");
    }

    // Get signature stored as env variable on your server
    const secret_hash = process.env.SECRET_HASH;

    // check if signatures match

    if (hash !== secret_hash) {
        // silently exit, or check that you are passing the write hash on your server.
        res.send({
            status: "error"
        });
        process.exit(0)
        // console.log("has is not equal sent");
    }

    // Retrieve the request's body
    var request_json = req.body;

    // Give value to your customer but don't give any output
    // Remember that this is a call from rave's servers and 
    // Your customer is not seeing the response here at all

    res.send(200);
});