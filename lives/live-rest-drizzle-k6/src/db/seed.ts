import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { faker } from '@faker-js/faker'

import * as schema from "./schema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool, { schema })

async function main() {
    const { todos  } = schema
    console.info("seeding started")
    for(let index = 0; index < 10; index++) {
        await db.insert(todos).values({
            task: faker.lorem.sentence({ min: 3, max: 5 }),
            description: faker.lorem.paragraph(),
            isDone: faker.datatype.boolean(),
            dueDate: faker.date.anytime(),
            doneAt: faker.date.anytime(),
            createdAt: faker.date.anytime(),
            updatedAt: faker.date.anytime(),
        })
    }
    pool.end()
    console.info("seeding finished")
    process.exit(0)
}

(async () => {
    await main()
})()
