#!/bin/sh
go build -o server server.go
GOOS=windows GOARCH=amd64 go build -o server.exe server.go
