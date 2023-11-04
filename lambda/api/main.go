package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"techblog/api-proxy/api"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda
var client *api.DynamoClient = api.NewDynamoClient(os.Getenv("tablename"))


func ginRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/blogs/:dir", func(ctx *gin.Context) {
		if blog, err := client.GetBlog(ctx); err != nil {
			ctx.JSON(err.Code, gin.H{
				"error": err.Error(),
			})
		} else {
			ctx.JSON(http.StatusOK, gin.H{
				"blog": blog,
			})
		}
	})

	r.GET("/blogs", func(ctx *gin.Context) {
		if blogs, err := client.GetBlogs(ctx); err != nil {
			ctx.JSON(err.Code,gin.H{
				"error": err.Error(),
			})
		}else{
			ctx.JSON(http.StatusOK,gin.H{
				"blogs": blogs,
			})
		}
	})
	return r
}

func init() {
	// stdout and stderr are sent to AWS CloudWatch Logs
	log.Printf("Gin cold start")
	r := ginRouter()
	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
