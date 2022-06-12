const express = require('express');
const app = require("./app");
const mongoose = require("mongoose");

const config = require("./config");
const logger = require("./library/helpers/loggerHelpers");

app.use(express.static("public"))

app.get('/', (req,res) =>{
  res.send('index')
})




const port = process.env.PORT || 5000;

mongoose
  .connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    logger.info(`
        ++++++++++++++++++++++++++++++++++++++++++++++++
          MongoDB succesfully connected
        ++++++++++++++++++++++++++++++++++++++++++++++++
      `)
  )
  .catch((err) => logger.info(err));

// app.get("/", (req, res) => {
//   res.send(`<h2>App Name: My E Store 101</h2>
// 			  <h3>Desc: An ecommerce app</h3>
// 			  <h3>Payload: mailTo :(The Recepient) - mailFrom :(The Sender) - subject:(The Message title) - text :(The main content) </h3>
// 			  <h3>Endpoint: https://email-sender-01.herokuapp.com/api/mail/send </h3>
// 			  <h3>Request Method: POST REQUEST</h3>
  
  
// 	`);
// });

const server = app.listen(config.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
    return;
  }
  logger.info(`
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        Server is running on port: ${config.port}
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    `);
});

// Cluster API has a variety of events.
// Here we are creating a new process if a worker die.

// cluster.on('exit', function(worker) {
// 	logger.info(`Worker ${worker.id} died'`);
// 	logger.info(`Staring a new one...`);
// 	cluster.fork();
// });
