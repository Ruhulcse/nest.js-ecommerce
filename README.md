# E-commerce API 

A NestJS-based REST API for e-commerce operations.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:

git clone https://github.com/Ruhulcse/nest.js-ecommerce.git

cd project directory


2. Install dependencies:

npm install


3. Environment Setup:
   
Create a `.env` file in the root directory with the following variables:



DB_HOST=localhost

DB_PORT=5432

DB_USERNAME=your_username

DB_DATABASE=your_database_name

PORT=3000

NODE_ENV=development

## Database Schema?
when you will run the project it will automatically create table in your database from entity file


## Start the application in development mode

npm run start:dev

## Build the application

npm run build


## API Endpoints

The application includes the following modules:

- Products
- Categories
- Orders

For detailed API documentation, run the application and visit:

http://localhost:3000/api


## Testing

### Run unit tests

npm run test


## Project Structure

├── config/           # Configuration files

├── modules/          # Feature modules

│     ├── products/

│     ├── categories/

│   └── orders/

└── app.module.ts     # Main application module
