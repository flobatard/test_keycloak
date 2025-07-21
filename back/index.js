require("dotenv").config();
const express = require("express")
const app = express()

const http = require("http")
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const correlator = require('express-correlation-id');
const logger = require("./logger/logger");
const config = require('./config');
initializeRedisClient().then(p => p).catch(err =>console.error(err));

var server = http.createServer(app);

const errorHandler = (err, req, res, next) =>
{
  if (res.headerSent){
    return next(err)
  }
  if (err.status)
  {
    if (err.status !== 401 && err.status !== 404)
    {
      const completeURL = req.protocol + '://' + req.get('host') + req.originalUrl;
      const urlWithoutParams = new URL(completeURL).pathname
      telegramInfoMessage( `Unexcpected Error while handling request: ${urlWithoutParams} : Error: ${err.code} - ${err.status} - ${err.name} - ${err.message} \n ${err.stack}`)
      logger.warn({message: `Error while running ${urlWithoutParams} : ${err.status} : ${err.message}`})
    }
    res.status(err.status).json(err)
  }
  else
  {
    const completeURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    const urlWithoutParams = new URL(completeURL).pathname
    logger.error({
      message: `Error while handling request: ${urlWithoutParams} : Error: ${err.code} - ${err.status} -  ${err.name} - ${err.message} \n ${err.stack}`, 
      error: {name: err.name, message: err.message, stack: err.stack}
    })
    telegramAlertMessage( `Unknown error while handling request: ${urlWithoutParams} : Error: ${err.code} - ${err.status} - ${err.name} - ${err.message} \n ${err.stack}`)
    res.status(500).json({code: err.status, error: "Unkown error"})
  }
}

const catch404 = (req, res, next) =>
{
  if (res.headerSent){
    exitLogger(req, res, next)
  }
  else
  {
    next()
  }
}

const corsOptions = {
  origin: config.frontRedirection,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json([]));
app.use(cookieParser())
app.get("/", (req, res, next) => {
  logger.info("Sniffing call at /")
  res.status(200).json({
    name: "back boc preprod",
    message: "Hello World",
    env: process.env.ENV,
    version: "1.0",
    process: process.pid
  })
});

app.use(errorHandler)
app.use(catch404)


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.debug(`Server Running: http://localhost:${PORT}`);
});

/**
 * The SIGTERM signal is a generic signal used to cause program 
 * termination. Unlike SIGKILL , this signal can be blocked, 
 * handled, and ignored. It is the normal way to politely ask a 
 * program to terminate. The shell command kill generates 
 * SIGTERM by default.
 */
process.on('SIGTERM', () => {
  server.close(() => {
      logger.warn('Server Close: Process Terminated!');
  });
});