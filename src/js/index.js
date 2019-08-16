import express from "express";

const app = express();

const PORT = 3000;

app.get("/api", (req, res) => {
  res.status(200).send("All good");
});

app.listen(PORT, error => {
  if (error) console.log(error);
  console.log(`Listening on port ${PORT}`);
});
