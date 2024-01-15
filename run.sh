#!/bin/bash

# Generate schema
npx prisma generate

# Run migrations
npx prisma db push

# Build application
npm run build

# Start bot
npm run start