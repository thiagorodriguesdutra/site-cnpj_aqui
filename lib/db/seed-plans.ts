import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const plansData = [
  {
    name: "Plano Gratuito",
    slug: "trial",
    type: "trial" as const,
    price: "0.00",
    credits: 3,
    isActive: true,
  },
  {
    name: "Pacote 5",
    slug: "package-5",
    type: "package" as const,
    price: "4.90",
    credits: 5,
    isActive: true,
  },
  {
    name: "Pacote 50",
    slug: "package-50",
    type: "package" as const,
    price: "34.90",
    credits: 50,
    isActive: true,
  },
  {
    name: "Pacote 100",
    slug: "package-100",
    type: "package" as const,
    price: "59.90",
    credits: 100,
    isActive: true,
  },
  {
    name: "Plano Mensal",
    slug: "monthly",
    type: "monthly" as const,
    price: "39.90",
    credits: 120,
    isActive: true,
  },
  {
    name: "Plano Anual",
    slug: "yearly",
    type: "yearly" as const,
    price: "399.90",
    credits: 1800,
    isActive: true,
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida");
  }

  const client = postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
  });
  const db = drizzle(client, { schema });

  console.log("Inserindo planos...");

  for (const plan of plansData) {
    await db
      .insert(schema.plans)
      .values(plan)
      .onConflictDoUpdate({
        target: schema.plans.slug,
        set: {
          name: plan.name,
          type: plan.type,
          price: plan.price,
          credits: plan.credits,
          isActive: plan.isActive,
        },
      });
    console.log(`✓ Plano "${plan.name}" inserido/atualizado`);
  }

  console.log("\n✓ Seed concluído com sucesso!");
  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Erro ao executar seed:", error);
  process.exit(1);
});
