import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { Imovie, ProductResult } from "./interfaces";

export const createNewMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = format(
    `    
        INSERT INTO "movies"
            (%I)
        VALUES
            (%L)
        RETURNING *;
     `,
    Object.keys(request.body),
    Object.values(request.body)
  );

  const QueryResult: ProductResult = await client.query(queryString);

  const movieAdd: Imovie = QueryResult.rows[0];

  return response.status(201).json(movieAdd);
};

export const allMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = format(`
        SELECT *
        FROM
        "movies"
        `);
  const QueryResult: ProductResult = await client.query(queryString);

  const movies = QueryResult.rows;

  return response.status(200).json(movies);
};

export const updateMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  return response.status(200).json();
};

export const deleteMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  return response.status(200).json();
};
