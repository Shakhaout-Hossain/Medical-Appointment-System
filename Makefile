.PHONY: all build run clean

IMAGE_NAME := medical-appointment-system
CONTAINER_NAME := medical-appointment-system-container
PORT := 8080

all: build run

build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) .

run:
	@echo "Running Docker container..."
	docker run --rm --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME)

clean:
	@echo "Stopping and removing Docker container (if running)..."
	-docker stop $(CONTAINER_NAME) 2>/dev/null || true
	-docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "Removing Docker image..."
	-docker rmi $(IMAGE_NAME) 2>/dev/null || true

.DEFAULT_GOAL := all
