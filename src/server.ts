import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import config from "./config/index.js";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");

    app.listen(PORT, () => {
      console.log(`Server is runnning on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
