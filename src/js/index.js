import express from "express";
import morgan from "morgan";
import fs from "fs";
import rfs from "rotating-file-stream";
import path from "path";
import helmet from "helmet";
import config from "config";

//Server stuff
const app = express();
const PORT = process.env.port || 3000;

//Set the development flag
let devFlag = app.get("env") === "development";

//Use helmet to set http headers
app.use(helmet());

//Only listen to JSON post requests
app.use(express.json());

//Create folder logs if not present
fs.existsSync(config.get("paths.dirPaths.logsPath")) ||
  fs.mkdirSync(config.get("paths.dirPaths.logsPath"));

//Create rotating file stream
let accessLogs = rfs(path.join(config.get("files.serverErrors")), {
  interval: "1d",
  path: config.get("paths.dirPaths.logsPath")
});

//Log all errors
app.use(
  morgan("common", {
    skip: (req, res) => {
      res.statusCode > 400;
    },
    stream: accessLogs
  })
);

if (devFlag.devFlag) {
  app.use(morgan("dev"));
}

app.get("/api", (req, res) => {
  res.status(200).send("All good");
});

app.listen(PORT, error => {
  if (error) {
    console.log(error);
    return;
  }

  if (devFlag) {
    console.log("Logging Enabled...");
    console.log(`Listening on port ${PORT}`);
  }
});

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});
