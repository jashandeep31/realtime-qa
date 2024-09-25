import express from "express";
import dotenv from "dotenv";
import passport, { session } from "passport";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
