# AWS go Lambda for handling request sent by APIGateway.

## What's in this folder

Handle API request and connect to mysql.

- **./blogs**
  handle https://xxx/blogs access. CURD blog information from db and return.
- **./driver/connect.go**
  go driver for mysql.
  Test driver are also included
- **./initdb.d**
  mysql statement for initialize mysql setup by docker
- **./main.go**
  entry for aws lambda

## Integration Test

For Integration Test, you must setup mysql susbstitute for AWS RDS.
To do this, `docker-compose up ./docker-compose.yml` and you can connect local mysql server.
