package jobs

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func (basic *TableBasic) DeleteObject(dir string) (err error) {

	_, err = basic.DeleteItem(context.TODO(), &dynamodb.DeleteItemInput{
		TableName: &basic.TableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{
				Value: "TYPE#Blog",
			},
			"SK": &types.AttributeValueMemberS{
				Value: "DIR#" + dir,
			},
		},
	})
	return
}
