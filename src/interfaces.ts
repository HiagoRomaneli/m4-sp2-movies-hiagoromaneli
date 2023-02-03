import { QueryResult } from "pg";

export interface Imovie {
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface ImovieId extends Imovie {
  id: number;
}

export type ProductResult = QueryResult<Imovie>;

export type requiredKeys = "name" | "description" | "duration" | "price";
