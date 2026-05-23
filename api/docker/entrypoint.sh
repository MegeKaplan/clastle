#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."

until nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL is ready"

echo "Running migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "Running seed..."
npx prisma db seed

echo "Starting application..."

exec "$@"