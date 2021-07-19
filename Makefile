GOCMD:=go
GORUN:=${GOCMD} run
GOBUILD:=${GOCMD} build
GOTEST:=${GOCMD} test

run:
	${GORUN} main.go
test-all:
	${GOTEST} ./internal/...
test-v-c:
	${GOTEST} -v -cover ./internal/merchandise_catalog/repository/
doc:
	swag init
dev-migrate-up:
	sql-migrate up -env="development"
dev-migrate-down:
	sql-migrate down -env="development"
seed-for-catalog:
	${GORUN} cmd/seeder/main.go

.PHONY: doc dev-migrate-up dev-migrate-down seed-for-catalog