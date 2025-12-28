import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/lib/env.server";
import { createLogger } from "../logger";

const logger = createLogger("db-migrate");

async function runMigrations() {
  logger.info({}, "Iniciando migrações");

  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: "lib/db/migrations" });

    logger.info({}, "Migrações aplicadas com sucesso");
  } catch (error) {
    logger.error({ error }, "Erro ao aplicar migrações");

    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigrations();
