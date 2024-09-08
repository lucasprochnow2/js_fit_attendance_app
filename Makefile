WEB_DOCKER_SERVICE=app

# Database
DB_DOCKER_SERVICE=db
DB_USER=root
DB_NAME=fit_attendance

build:
	@echo "Building..."
	@npm install

up:
	@echo "Running server on ${PORT}..."
	@docker-compose up

down:
	@echo "Canceling server..."
	@docker-compose down

db-shell:
	@docker-compose exec ${DB_DOCKER_SERVICE} psql -U ${DB_USER} -d ${DB_NAME}
