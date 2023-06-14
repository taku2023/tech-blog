package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
	"github.com/taku2023/tech-blog/articles"
	"github.com/taku2023/tech-blog/driver"
)

var ginLambda *ginadapter.GinLambda

func init() {
	// stdout and stderr are sent to AWS CloudWatch Logs
	log.Printf("Gin cold start")
	r := gin.Default()
	r.GET("/articles/:id", articles.Get)
	//create table if not exist
	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "hello",
		})
	})
	r.GET("/create", func(c *gin.Context) {
		conn, err := driver.Conn()
		if err != nil {
			log.Printf("error connect %s", err.Error())
			return
		}
		defer conn.Close()
		if _, err := conn.Exec("CREATE TABLE IF NOT EXISTS articles(id VARCHAR(32) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, PRIMARY KEY (id))"); err != nil {
			log.Printf("error %s", err.Error())
			c.JSON(500, gin.H{
				"message": "err:" + err.Error(),
			})
			return
		}
		if _, err := conn.Exec("INSERT INTO articles (id,title,category) VALUES (?,?,?)", "ABC", "clean architecture", "kotlin"); err != nil {
			log.Printf("error %s", err.Error())
			c.JSON(500, gin.H{
				"message": "err:" + err.Error(),
			})
			return
		}
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
