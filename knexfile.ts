import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: mustGetEnv('DB_HOST'),
      user: mustGetEnv('DB_USER'),
      password: mustGetEnv('DB_PASSWORD'),
      database: mustGetEnv('DB_NAME'), 
    },

 pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },

  production: {
    client: 'pq',
    connection: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      database: process.env.DATABASE_NAME || 'lendsqr_wallet',
      user:     process.env.DATABASE_USER || 'postgres',
      password:  process.env.DATABASE_PASSWORD ||'', 
      ssl: { rejectUnauthorized: false } 

    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

function mustGetEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export default config;
