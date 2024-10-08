/* Uncaught Exception */
process.on("uncaughtException", (err) => {
  console.log("err in code", err);
});
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import cors from "cors";
import express from "express";
import dbConnections from "./database/db.connections.js";
import bootstrap from "./src/modules/bootstrap.js";
import AppError from "./src/utils/appError.js";
import globalErrorHandler from "./src/utils/globalError.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
/* Database Connection */
dbConnections();

/* Middleware */
app.use(express.json());
/* Routes */

bootstrap(app);

/* Err Handel Routes */
app.use("*", (req, res, next) => {
  next(new AppError(`route not found ${req.originalUrl}`, 404));
});

/* Err Handling */
app.use(globalErrorHandler);

/* Unhandled Rejection */
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});

/* Listen */
app.get("/", (req, res) => res.send("Abdelrhman"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
