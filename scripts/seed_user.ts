
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { CreateUserUseCase } from "@/core/application/usecases/CreateUserUseCase.ts";
import { db } from "@/infra/database/client.ts";
import { container } from "@/core/container/container.ts";

const idGenerator = {
  generate: () => crypto.randomUUID(),
};

async function main() {
  const email = Deno.env.get("APP_USER");
  const password = Deno.env.get("APP_PASSWORD");

  if (!email || !password) {
    console.error("Error: APP_USER and APP_PASSWORD must be set in .env");
    Deno.exit(1);
  }

  console.log(`Seeding user: ${email}...`);

  const createUserUseCase = container.get('CreateUserUseCase') as CreateUserUseCase;

  try {
    const result = await createUserUseCase.execute({ email, password });
    console.log(`User created successfully! ID: ${result.id}`);
  } catch (error: any) {
    if (error.message === "UserAlreadyExists") {
      console.log("User already exists. Skipping creation.");
    } else {
      console.error("Error creating user:", error);
      Deno.exit(1);
    }
  }

  Deno.exit(0);
}

main();
