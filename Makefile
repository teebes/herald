.PHONY: docker-push

docker-push:
	docker buildx build --platform linux/amd64,linux/arm64 -t teebes/herald:latest --push .
