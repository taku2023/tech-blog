package jobs

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func (basic *TableBasic) UpSertObject(dir string, summary *Summary) error {
	//if items already exists, update update_time
	output, _ := basic.GetItem(context.TODO(), &dynamodb.GetItemInput{
		TableName: aws.String(basic.TableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{
				Value: "TYPE#Blog",
			},
			"SK": &types.AttributeValueMemberS{
				Value: "DIR#" + dir,
			},
		},
	})
	if output.Item != nil {
		_, err := basic.UpdateItem(context.TODO(), &dynamodb.UpdateItemInput{
			TableName: aws.String(basic.TableName),
			Key: map[string]types.AttributeValue{
				"PK": &types.AttributeValueMemberS{
					Value: "TYPE#Blog",
				},
				"SK": &types.AttributeValueMemberS{
					Value: "DIR#" + dir,
				},
			},
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":update": &types.AttributeValueMemberS{
					Value: time.Now().Format(time.RFC3339),
				},
			},
			UpdateExpression: aws.String("SET update_datetime = :update"),
		})
		return err
	}

	if _, err := basic.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName: aws.String(basic.TableName), Item: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{
				Value: "TYPE#Blog",
			},
			"SK": &types.AttributeValueMemberS{
				Value: "DIR#" + dir,
			},
			"LSI1SK": &types.AttributeValueMemberS{
				Value: "DATE#" + summary.Date,
			},
			"dir": &types.AttributeValueMemberS{
				Value: dir,
			},
			"title": &types.AttributeValueMemberS{
				Value: summary.Title,
			},
			"description": &types.AttributeValueMemberS{
				Value: summary.Description,
			},
			"categories": &types.AttributeValueMemberSS{
				Value: summary.Categories,
			},
			"keywords": &types.AttributeValueMemberSS{
				Value: summary.Keywords,
			},
			"create_datetime": &types.AttributeValueMemberS{
				Value: summary.Date,
			},
		},
	}); err != nil {
		log.Printf("Cloudn't add item to table. Here's why: %v\n", err)
		return err
	}
	return nil
}
