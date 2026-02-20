# CMS Headless Self-Hosted

A headless CMS inspired by Sanity, self-hosted, with NestJS backend and Angular Studio frontend.

## Stack

- **Monorepo**: Nx
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Angular 19 (standalone components)
- **Auth**: JWT (Passport)
- **Deploy**: Docker + Docker Compose + Nginx

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend
│   └── studio/       # Angular frontend
├── libs/
│   └── shared/
│       ├── interfaces/   # Shared TypeScript interfaces
│       ├── constants/    # Enums, field types
│       └── utils/        # Helpers
├── docker-compose.yml
├── nginx.conf
└── nx.json
```

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate --schema=apps/api/src/prisma/schema.prisma

# Start PostgreSQL (via Docker)
docker compose up db -d

# Run database migrations
npx prisma migrate dev --schema=apps/api/src/prisma/schema.prisma

# Start API
npm run start:api

# Start Studio
npm run start:studio
```

## Production (Docker)

```bash
# Build the studio
npm run build:studio

# Start all services
docker compose up -d
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register (admin only) |
| GET | /api/schemas | List content types |
| GET | /api/schemas/:name | Get content type |
| GET | /api/content/:type | List documents |
| GET | /api/content/:type/:id | Get document |
| POST | /api/content/:type | Create document |
| PUT | /api/content/:type/:id | Update document |
| PATCH | /api/content/:type/:id/status | Change status |
| DELETE | /api/content/:type/:id | Delete document |
| POST | /api/media/upload | Upload file |
| GET | /api/media | List media |
| DELETE | /api/media/:id | Delete media |
| GET | /api/users | List users (admin) |
| POST | /api/users | Create user (admin) |
| PUT | /api/users/:id | Update user |
