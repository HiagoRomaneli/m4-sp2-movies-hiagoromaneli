import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { Imovie, Pagination, ProductResult } from "./interfaces";

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

  const queryResult: ProductResult = await client.query(queryString);

  const movieAdd: Imovie = queryResult.rows[0];

  return response.status(201).json(movieAdd);
};

export const allMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let page = Number(request.query.page) || 1;
  let perPage = Number(request.query.perPage) || 5;

  const queryTemplate: string = `
        SELECT 
          *
        FROM
          movies
        OFFSET $1 LIMIT $2;
        `;

  const queryString: string = format(`
        SELECT 
          *
        FROM
          movies;
    `);

  const queryAllMovies: ProductResult = await client.query(queryString);

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [perPage * (page - 1), perPage],
  };

  const queryResult: ProductResult = await client.query(queryConfig);

  const baseUrl: string = `http://localhost:3000/movies`;

  let previusPage: string | null = `${baseUrl}?page=${
    page - 1
  }&perPage=${perPage}`;

  let nextPage: string | null = `${baseUrl}?page=${
    page + 1
  }&perPage=${perPage}`;

  if (page - 1 <= 0) {
    previusPage = null;
  }

  const quantityPages: Number = Math.ceil(queryAllMovies.rowCount / perPage);

  if (page + 1 > quantityPages) {
    nextPage = null;
  }

  const pagination: Pagination = {
    previusPage,
    nextPage,
    count: queryResult.rowCount,
    data: queryResult.rows,
  };

  return response.status(200).json(pagination);
};

export const updateMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { body, params } = request;

  const updateColumns: string[] = Object.keys(body);
  const updateValues: string[] = Object.values(body);
  const idMovie: string = params.id;

  const queryTemplate: string = `
    UPDATE
      movies
    SET (%I) = ROW(%L)
    WHERE
      id = $1
    RETURNING *;
  `;

  const queryFormat: string = format(
    queryTemplate,
    updateColumns,
    updateValues
  );

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [idMovie],
  };

  const queryResult: ProductResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

export const deleteMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { params } = request;

  const idMovie: string = params.id;

  const queryString: string = `
    DELETE FROM 
      movies
    WHERE
      id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idMovie],
  };

  const queryResult: ProductResult = await client.query(queryConfig);

  return response.status(204).send();
};
