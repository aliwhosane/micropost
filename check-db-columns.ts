
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking columns in Post table...");
        // Raw query to check columns in information_schema
        const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Post';
    `;
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
