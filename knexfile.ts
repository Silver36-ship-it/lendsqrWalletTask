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
    client: 'mysql2',
    connection: {
      host: mustGetEnv('DB_HOST'),
      database: mustGetEnv('DB_USER'),
      user:     mustGetEnv('DB_USER'),
      password:  mustGetEnv('DB_NAME'), 

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
