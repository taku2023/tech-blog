package main

import (
	"context"
	"log"
	"os"
	"path"
	"regexp"
	. "tech-blog/s3-events/jobs"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var client = NewDynamoClient(os.Getenv("tablename"))

func Handler(ctx context.Context, events events.S3Event) error {

	sdkConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("failed to load default config: %v\n", err)
		return err
	}
	s3Client := s3.NewFromConfig(sdkConfig)
	reDelete := regexp.MustCompile(`ObjectRemoved:.*?`)
	reCreate := regexp.MustCompile(`ObjectCreated:.*?`)

	for _, record := range events.Records {
		//When delete object
		bucket := record.S3.Bucket.Name
		key := record.S3.Object.Key
		dir := path.Dir(record.S3.Object.URLDecodedKey)

		if reDelete.MatchString(record.EventName) {
			client.DeleteObject(dir)
			if err != nil {
				log.Printf("ObjectRemoved Failed %v\n", err)
				return err
			}
		} else if reCreate.MatchString(record.EventName) {
			output, err := s3Client.GetObject(ctx, &s3.GetObjectInput{
				Bucket: &bucket,
				Key:    &key,
			})
			if err != nil {
				log.Printf("error getting object %v\n", err)
				return err
			}
			defer output.Body.Close()
			summary, err := Extract(output.Body)
			if err != nil {
				log.Printf("error extract body %v\n", err)
			}
			if err := client.UpSertObject(dir, summary); err != nil {
				log.Printf("error post object %v\n", err)
				return err
			}
		}
	}
	return nil
}

func main() {
	lambda.Start(Handler)
}
