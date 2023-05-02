// import library
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
var bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//import route and handlers error
const allRoutes = require("./routes/routes");
const { errorHandler } = require("./controllers/error");

var http = require("http");
var app = express();

//api docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// parse various different custom JSON types as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.disable("x-powered-by");
app.use(helmet());
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  message: "Too many request from this IP, please try again after an in 2 minutes",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // use rate limiter
app.use(allRoutes); // use all routes
app.use(errorHandler); // throw error
http.createServer(app).listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
module.exports = app;
