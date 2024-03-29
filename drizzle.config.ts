import type {Config} from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config()



export default {
  schema: './lib/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgresql://craverroy:EkbLohPry38u@ep-wandering-sun-78284268.ap-southeast-1.aws.neon.tech/langchain-youtube-ai?sslmode=require' //process.env.DATABASE_URL!
  }
} satisfies Config

