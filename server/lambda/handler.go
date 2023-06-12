package lambda

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Println("Processing request", request.RequestContext.RequestID)
	return events.APIGatewayProxyResponse{
			Body:       "Hello, World!",
			StatusCode: http.StatusOK,
	}, nil
}

func main() {
	lambda.Start(handleRequest)
}