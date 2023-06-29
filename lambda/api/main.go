package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
	"github.com/taku2023/tech-blog/api"
)

var ginLambda *ginadapter.GinLambda

func ginRouter(client api.Api) *gin.Engine {
	r := gin.Default()
	//blogs title is unique(it should be)
	r.GET("/blogs/:key", client.GetBlog)
	// blogs?search={text}&category={category?}
	r.GET("/blogs", client.SearchBlogs)
	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "hello",
		})
	})
	return r
}

func init() {
	// stdout and stderr are sent to AWS CloudWatch Logs
	log.Printf("Gin cold start")
	r := ginRouter(api.NewClient())
	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
