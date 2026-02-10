import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();         
    table.integer('wallet_id').unsigned().notNullable(); 
    table.enum('type', ['FUND', 'WITHDRAW', 'TRANSFER', 'TRANSFER_IN', 'TRANSFER_OUT']).notNullable(); // ADD TRANSFER_IN and TRANSFER_OUT
    table.decimal('amount', 14, 2).notNullable();  
    table.integer('from_wallet_id').unsigned().nullable(); 
    table.integer('to_wallet_id').unsigned().nullable();   
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('wallet_id').references('id').inTable('wallets').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
