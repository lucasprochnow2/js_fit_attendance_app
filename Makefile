WEB_DOCKER_SERVICE=app

# Database
DB_DOCKER_SERVICE=db
DB_USER=root
DB_NAME=fit_attendance

build:
	@echo "Building..."
	@docker-compose run --rm --no-deps ${WEB_DOCKER_SERVICE} npm install

build-no-cache:
	@docker-compose build --no-cache --pull
	@docker-compose run --rm --no-deps ${WEB_DOCKER_SERVICE} npm install

up:
	@echo "Running server on ${PORT}..."
	@docker-compose up -d ${DB_DOCKER_SERVICE}
	@npm run dev

down:
	@echo "Canceling server..."
	@docker-compose down

db-shell:
	@docker-compose exec ${DB_DOCKER_SERVICE} psql -U ${DB_USER} -d ${DB_NAME}

db-migrate:
	@npm run db-migrate-dev

db-pull:
	@npm run db-pull

db-seed:
	@npx prisma db seed

shell:
	@docker-compose exec ${WEB_DOCKER_SERVICE} sh

add-dependency:
	@docker-compose run --rm --no-deps ${WEB_DOCKER_SERVICE} npm i $(dependency)

prisma-studio:
	@npx prisma studio
