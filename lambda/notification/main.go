package main

import (
	"context"
	"log"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/taku2023/s3-notification/jobs"
)

func Handler(ctx context.Context, events events.S3Event) error {

	sdkConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("failed to load default config: %s", err)
		return err
	}
	s3Client := s3.NewFromConfig(sdkConfig)
	reDelete := regexp.MustCompile(`ObjectRemoved:.*?`)
	reCreate := regexp.MustCompile(`ObjectCreated:.*?`)

	for _, record := range events.Records {
		//When delete object
		if reDelete.MatchString(record.EventName) {
			err := jobs.S3Delete(record)
			if err != nil {
				log.Printf("ObjectRemoved Failed %s", err)
			}
			return err
		} else if reCreate.MatchString(record.EventName) {
			bucket := record.S3.Bucket.Name
			key := record.S3.Object.URLDecodedKey
			output, err := s3Client.GetObject(ctx, &s3.GetObjectInput{
				Bucket: &bucket,
				Key:    &key,
			})
			if err != nil {
				log.Printf("error getting object %s", err)
				return err
			}
			defer output.Body.Close()
			if err := jobs.S3UPSert(record, output.Body); err != nil {
				log.Printf("error post object %s", err)
			}
		}
	}
	return nil
}

func main() {
	lambda.Start(Handler)
}
