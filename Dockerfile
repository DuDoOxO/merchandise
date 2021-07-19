
# merchandise-backend-server

# stage 1 builder
FROM golang:alpine AS builder
RUN mkdir -p /app
WORKDIR /app
# ENV GO111MODULE=on
COPY . .
RUN go mod download
# RUN apk add --no-cache curl git
RUN go build -o /app/gotest

# stage 2 cert stage
FROM alpine AS certs
RUN apk --update add --no-cache ca-certificates

# stage 3 production
FROM alpine
RUN apk update && apk add --no-cache bash curl git
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /app/gotest .
COPY --from=builder /app/.env .
COPY --from=builder /app/Makefile .
EXPOSE 9999
ENTRYPOINT [ "./gotest" ]