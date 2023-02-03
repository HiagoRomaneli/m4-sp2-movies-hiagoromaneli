import { Client } from "pg";

export const client: Client = new Client({
  user: "hi_ag",
  password: "31039217",
  host: "localhost",
  database: "entrega_movies",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();

  console.log("Database connected!");
};
