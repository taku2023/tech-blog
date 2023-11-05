package api

import (
	"context"
	"fmt"
	"net/http"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/gin-gonic/gin"
)

func (client *DynamoClient) GetBlog(c *gin.Context) (*Blog, *HTTPError) {
	dir := c.Param("dir")
	response, err := client.GetItem(context.TODO(), &dynamodb.GetItemInput{
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{
				Value: "TYPE#Blog",
			},
			"SK": &types.AttributeValueMemberS{
				Value: "DIR#" + dir,
			},
		},
		TableName: &client.TableName,
	})
	if err != nil {
		fmt.Printf("getitem error %v\n", err)
		return nil, &HTTPError{Code: http.StatusNotFound, error: err}
	}
	var blog Blog
	if err = attributevalue.UnmarshalMap(response.Item, &blog); err != nil {
		fmt.Printf("unmarshal error %v\n", err)
		return nil, &HTTPError{Code: http.StatusInternalServerError, error: err}
	}
	return &blog, nil
}

// blogs?limit=10"
func (client *DynamoClient) GetBlogs(c *gin.Context) ([]Blog, *HTTPError) {
	var err error
	results, err := client.Query(context.TODO(), &dynamodb.QueryInput{
		TableName: &client.TableName,
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{
				Value: "TYPE#Blog",
			},
			":sk": &types.AttributeValueMemberS{
				Value: "DIR#",
			},
		},
		KeyConditionExpression: aws.String("PK = :pk AND begins_with( SK , :sk )"),
	})
	if err != nil {
		return nil, &HTTPError{error: err, Code: http.StatusInternalServerError}
	}
	var blogs []Blog
	if err := attributevalue.UnmarshalListOfMaps(results.Items, &blogs); err != nil {
		fmt.Printf("error unmarshal: %v\n", err      )
		return nil, &HTTPError{error: err, Code: http.StatusInternalServerError}
	}
	return blogs, nil
}
