const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { globalErrorHandler } = require("./utils/error");
const authRoutes = require('./routes/authRouter');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("combined"));

  // 기본 경로
  app.get('/', (req, res) => {
    res.send(`
      <h1>OAuth</h1>
      <a href="/login">Log in</a>
      <a href="/signup">Sign up</a>
    `);
  });

  // OAuth 경로
  app.use('/', authRoutes);

  app.use(routes);

  app.use(globalErrorHandler);

  return app;
};

module.exports = { createApp };
