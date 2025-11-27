const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize"); 

module.exports = function (app) {
  
  app.use(helmet());

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use(hpp());

  
  app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(xssClean());

  app.use(mongoSanitize());

  app.use("/api/login",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: "Too many login attempts"
    })
  );

  app.use("/api/",
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100
    })
  );
};
