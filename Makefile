# Variables
DOCKER_COMPOSE = docker compose
PROJECT_NAME = medical-appointment-system

.PHONY: all help build up down restart logs ps clean

# Default target
all: up

# Help target to describe available commands
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build    Build or rebuild services"
	@echo "  up       Create and start containers (in background)"
	@echo "  down     Stop and remove containers, networks, and images"
	@echo "  restart  Restart services"
	@echo "  logs     View output from containers"
	@echo "  ps       List containers"
	@echo "  clean    Stop and remove containers, networks, images, and volumes"

# Build images
build:
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

# Start containers in background
up:
	@echo "Starting Docker containers..."
	$(DOCKER_COMPOSE) up -d

# Stop and remove containers
down:
	@echo "Stopping Docker containers..."
	$(DOCKER_COMPOSE) down

# Restart containers
restart:
	@echo "Restarting Docker containers..."
	$(DOCKER_COMPOSE) restart

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# List containers
ps:
	$(DOCKER_COMPOSE) ps

# Full cleanup
clean:
	@echo "Cleaning up Docker resources..."
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

# --- Development Targets (Local) ---

.PHONY: watch-frontend watch-backend watch install-all

# Run frontend in watch mode
watch-frontend:
	@echo "Starting Frontend in watch mode..."
	cd frontend && npm install && npm run dev

# Run backend in watch mode (requires Maven)
watch-backend:
	@echo "Starting Backend in watch mode..."
	mvn spring-boot:run

# Run both frontend and backend concurrently
watch:
	@$(MAKE) -j2 watch-frontend watch-backend

# Run in Docker with watch mode (using volume mounts)
docker-watch:
	@echo "Stopping existing containers..."
	$(DOCKER_COMPOSE) -f docker-compose.watch.yml down
	@echo "Ensuring fresh official images..."
	$(DOCKER_COMPOSE) -f docker-compose.watch.yml pull
	@echo "Starting services in Docker with watch mode..."
	$(DOCKER_COMPOSE) -f docker-compose.watch.yml up

# Install all dependencies
install-all:
	@echo "Installing all dependencies..."
	mvn install -DskipTests
	cd frontend && npm install
