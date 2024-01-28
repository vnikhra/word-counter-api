import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable("files");
  if (!tableExists) {
    await knex.schema.createTable("files", (table) => {
      table.uuid("id").primary(); // File ID (UUID)
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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("files");
}
