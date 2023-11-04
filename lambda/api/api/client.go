package api

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type Blog struct {
	Dir         string    `json:"s3_dir" dynamodbav:"dir"`
	Title       string    `json:"title" dynamodbav:"title"`
	Description string    `json:"description" dynamodbav:"description"`
	Categories  []string  `json:"categories" dynamodbav:"categories"`
	Keywords    []string  `json:"keywords" dynamodbav:"keywords"`
	CreateAt    time.Time `json:"create_at" dynamodbav:"create_datetime"`
	UpdateAt    time.Time `json:"update_at" dynamodbav:"udpate_datetime,omitempty"`
}

type DynamoClient struct {
	*dynamodb.Client
	TableName string
}

func NewDynamoClient(table string) *DynamoClient {
	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("ap-northeast-1"))
	if err != nil {
		log.Printf("load config error %v\n", err)
		return nil
	}
	return &DynamoClient{
		Client:    dynamodb.NewFromConfig(config),
		TableName: table,
	}
}
