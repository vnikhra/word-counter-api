import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists("files", (table) => {
    table.uuid("id").primary(); // File ID (UUID)
    table.string("name").notNullable(); // File name (String)
    table
      .enum("status", [
        "requested",
        "initiated",
        "processing",
        "completed",
        "error",
      ])
      .notNullable()
      .defaultTo("requested"); // Processing status
    table.dateTime("created_at").defaultTo(knex.fn.now()); // Created on time (automatic)
    table.dateTime("updated_at").defaultTo(knex.fn.now()); // Updated on time (automatic)
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("files");
}
