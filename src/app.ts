import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  allMovies,
  createNewMovie,
  deleteMovies,
  updateMovies,
} from "./functions";

const app: Application = express();
app.use(express.json());

app.post("/movies", createNewMovie);
app.get("/movies", allMovies);
app.patch("/movies/:id", updateMovies);
app.delete("/movies/:id", deleteMovies);

const PORT: number = 3000;

const runningMsg: string = `Server is running on http://localhost:${PORT}`;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
