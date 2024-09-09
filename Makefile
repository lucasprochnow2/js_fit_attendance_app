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
	@docker-compose up

down:
	@echo "Canceling server..."
	@docker-compose down

db-shell:
	@docker-compose exec ${DB_DOCKER_SERVICE} psql -U ${DB_USER} -d ${DB_NAME}

shell:
	@docker-compose exec ${WEB_DOCKER_SERVICE} sh

add-dependency:
	@docker-compose run --rm --no-deps ${WEB_DOCKER_SERVICE} npm i $(dependency)
