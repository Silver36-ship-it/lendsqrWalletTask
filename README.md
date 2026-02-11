Lendsqr Wallet Service (Backend)
Description

Lendsqr Wallet Service is a backend application built with Node.js and TypeScript that provides basic wallet functionality for a mobile lending platform.
It allows users to create accounts, manage wallet balances, transfer funds, and withdraw money while ensuring data consistency and transaction safety.
The service exposes REST APIs that can be consumed by mobile or web applications.

Features
User account creation with automatic wallet setup
Fund wallet
Transfer funds between users
Withdraw funds from wallet
Transaction logging for audit purposes
Karma blacklist check (mocked for development)
Safe money operations using database transactions
Unit tests for core wallet logic

Tech Stack
Language: TypeScript
Runtime: Node.js (LTS)
Framework: Express.js
Database: MySQL and Postgres(production)
Query Builder / ORM: Knex.js
Testing: Jest
Communication: REST API
Tools: Git, GitHub, Postman

Project Type
Backend service
Designed to be consumed by mobile or web clients

API Overview
POST /users – Create a user and wallet
POST /wallets/fund – Fund a wallet
POST /wallets/transfer – Transfer funds between wallets
POST /wallets/withdraw – Withdraw funds from wallet
