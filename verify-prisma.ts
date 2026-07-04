
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Check if we can query strictly for hallOfFame without error
        // We don't need real data, just need to see if the query builder accepts the field
        console.log("Checking if hallOfFame is in Post model...");
        // Just try to access the type definition if possible or run a raw query
        // Or just try a findFirst with the field
        const post = await prisma.post.findFirst({
            where: {
                hallOfFame: true
            }
        });
        console.log("Query successful (result might be null):", post);
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
