import express from "express";
import morgan from "morgan";
import fs from "fs";
import rfs from "rotating-file-stream";
import path from "path";

//Server stuff
const app = express();
const PORT = 3000;

//Path to the logs folder
const logPath = "../logs";
//Create folder logs if not present
fs.existsSync(logPath) || fs.mkdirSync(logPath);

//Create rotating file stream
let accessLogs = rfs(path.join("serverErrors.log"), {
  interval: "1d",
  path: logPath
});

//Log all errors to
app.use(
  morgan("common", {
    skip: (req, res) => {
      res.statusCode > 400;
    },
    stream: accessLogs
  })
);

app.use(morgan("dev"));

app.get("/api", (req, res) => {
  res.status(200).send("All good");
});

app.listen(PORT, error => {
  if (error) console.log(error);
  console.log(`Listening on port ${PORT}`);
});
