package jobs

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type TableBasic struct{
	*dynamodb.Client
	TableName string
}

func NewDynamoClient(table string) *TableBasic{
	config,err :=config.LoadDefaultConfig(context.TODO(),config.WithRegion("ap-northeast-1"))
	if err!=nil{
		return nil
	}
	return &TableBasic{
		Client: dynamodb.NewFromConfig(config),
		TableName: table,
	}
}