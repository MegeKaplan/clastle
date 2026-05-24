#!/usr/bin/env bash
set -e

echo
echo "-------------------"
echo "| Install Clastle |"
echo "-------------------"
echo

echo "Step 1: npm ci (api)"
cd api
npm ci
cd ..
echo

echo "Step 2: npm ci (web)"
cd web
npm ci
cd ..
echo

echo "Step 3: create .env files"
cp -n api/.env.example api/.env.development
cp -n api/.env.example api/.env.production
cp -n web/.env.example web/.env.development
cp -n web/.env.example web/.env.production
echo "Created .env files. Update them before running."
echo

echo "Start application? [y/n]"
printf "> "
read -r start_choice
echo

if [[ "${start_choice,,}" != "y" ]]; then
  echo "Installation complete. You can check the README.md for how to start the application later."
  exit 0
fi

echo "Select environment:"
echo "  1) dev"
echo "  2) prod"
printf "> "
read -r env_choice
echo

echo "Run containers in detached mode? [y/n]"
printf "> "
read -r detach_choice
echo

case "${env_choice,,}" in
  1|dev|development)
    ENV="dev"
    ;;
  2|prod|production)
    ENV="prod"
    ;;
  *)
    echo "Invalid selection. Choose dev or prod."
    exit 1
    ;;
esac

detach_flag=""
if [[ "${detach_choice,,}" == "y" ]]; then
  detach_flag="-d"
fi

echo "Step 4: docker compose ($ENV)"
docker compose -f infra/compose.yaml -f infra/compose.$ENV.yaml up --build $detach_flag
