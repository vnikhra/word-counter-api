import knex from "knex";
import * as knexConfig from "../../knexfile";

// Create a Knex instance with your database configuration
const db = knex(knexConfig.development);

export default db;
