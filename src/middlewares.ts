import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { Imovie } from "./interfaces";

export const verifyNameExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const { id } = request.params;

  const queryFilterId: string = `
        SELECT
            *
        FROM
            "movies"
        WHERE
            id = $1;
  `;
  const queryConfigFilterId: QueryConfig = {
    text: queryFilterId,
    values: [id],
  };

  const queryResultFilterId: QueryResult<Imovie> = await client.query(
    queryConfigFilterId
  );

  if (queryResultFilterId.rowCount <= 0) {
    const message: string = `Movie id: ${id} not exists!`;
    return response.status(404).json(message);
  }

  const queryString: string = `
        SELECT
             *
        FROM
            "movies"
        WHERE
            name = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const QueryResult: QueryResult<Imovie> = await client.query(queryConfig);

  const selectedMovie: Imovie = QueryResult.rows[0];

  if (selectedMovie) {
    const message: string = `Movie name:${name} already exists.`;
    return response.status(409).json(message);
  }

  next();
};
