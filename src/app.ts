import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  allMovies,
  createNewMovie,
  deleteMovies,
  updateMovies,
} from "./functions";
import { verifyNameExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", verifyNameExists, createNewMovie);
app.get("/movies", allMovies);
app.patch("/movies/:id", verifyNameExists, updateMovies);
app.delete("/movies/:id", verifyNameExists, deleteMovies);

const PORT: number = 3000;

const runningMsg: string = `Server is running on http://localhost:${PORT}`;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
