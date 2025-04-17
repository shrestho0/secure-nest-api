
# Prototype Secure-Nest API

This is a prototype project

## Setup and Run 

1. Clone this repo and cd into project root (secure-nest-api)
1. Run `npm i` to install 
1. Create `.env` from `.env.example`
1. Run database from `docker-compose.yml` (command: `docker compose up -d`)
1. Migrate Prisma `npx prisma migrate dev --name init`
1. Generate Prisma Schema `npx prisma generate`
1. Start in dev env: `npm run start:dev`
1. API Endpoint: `http://localhost:3000/`
1. Swagger Url: `http://localhost:3000/swagger`


#### Start the projects
npm run start:dev

