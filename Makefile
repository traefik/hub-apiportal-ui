default: build

IMAGE_NAME := hub-portal-ui
TAG_NAME := $(shell git tag -l --contains HEAD)
SHA := $(shell git rev-parse --short HEAD)
VERSION ?= $(if $(TAG_NAME),$(TAG_NAME),$(SHA))

lint:
	yarn lint

start:
	yarn install && yarn start

build: lint
	yarn install && yarn build

image:
	docker build -t $(IMAGE_NAME):$(VERSION) .

clean:
	rm -rf ./build

.PHONY: start lint build image clean
