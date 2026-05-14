import "dotenv/config";
import { createDb } from "@repo/database";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

async function seed() {
  const env = process.argv[2] || "dev";
  const adminUrl =
    env === "prod"
      ? process.env.DATABASE_URL_PROD_ADMIN
      : process.env.DATABASE_URL_DEV_ADMIN;

  if (!adminUrl) {
    console.error(
      `Error: DATABASE_URL_${env === "prod" ? "PROD" : "DEV"}_ADMIN is not set`
    );
    process.exit(1);
  }

  const db = createDb(adminUrl);

  const auth = betterAuth({
    database: { db, type: "postgres" },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async () => {
        // No-op during seeding to skip email sending
      },
      sendOnSignUp: false, // Disable sending emails during seed
      autoSignInAfterVerification: true,
    },
    plugins: [admin()],
  });

  const envLabel = env === "prod" ? "production" : "development";

  console.log(`Seeding semantic metadata in ${envLabel} database...\n`);

  try {
    //
    // USERS (Better Auth compatible)
    //
    const userData = [
      {
        name: "Admin User",
        username: "admin",
        email: "admin@example.com",
        password: "password123",
      },
    ];

    const createdUsers: Array<{
      id: string;
      email: string;
    }> = [];

    await Promise.all(
      userData.map(async (userInfo) => {
        try {
          const result = await auth.api.signUpEmail({
            body: {
              email: userInfo.email,
              password: userInfo.password,
              name: userInfo.name,
            },
          });

          if ("error" in result) {
            console.error(
              `Error creating user ${userInfo.email}:`,
              result.error
            );
            return;
          }

          createdUsers.push({
            id: result.user.id,
            email: userInfo.email,
          });

          console.log(`✓ Created user: ${userInfo.email}`);
        } catch (error) {
          console.error(`Exception creating user ${userInfo.email}:`, error);
        }
      })
    );
  } catch (error) {
    console.error("Exception seeding database:", error);
  } finally {
    console.log("✓ Seeded database");
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
