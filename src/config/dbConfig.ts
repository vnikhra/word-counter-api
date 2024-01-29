import Knex from "knex";
import * as knexConfig from "../../knexfile";

let db:any = null;
export default async function getPostgresConnection(): Promise<any> {
    if(db !== null){
        return db;
    }
    db = Knex(knexConfig.development);

    const retryDelay = 1000;

    while (true) {
        try {
            console.log('Attempting to connect to PostgreSQL...');
            await db.raw('SELECT 1'); // Test connection
            console.log('Connected to PostgreSQL!');
            return db;
        } catch (error) {
            console.error('Failed to connect to PostgreSQL:', error);
            console.log(`Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}
