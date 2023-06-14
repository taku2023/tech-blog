package driver

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	//"os"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

func MyConnSQL() *sql.DB {
	// env
	endpoint := "proxy.proxy-cyvufdqsaec6.ap-northeast-1.rds.amazonaws.com" // os.Getenv("endpoint")
	username := "admin" // os.Getenv("username")
	secretName := "rds-secret" // os.Getenv("secret")
	region := "ap-northeast-1"

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Fatal(err)
	}

	// Create Secrets Manager client
	svc := secretsmanager.NewFromConfig(config)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"), // VersionStage defaults to AWSCURRENT if unspecified
	}

	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		// For a list of exceptions thrown, see
		// https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
		log.Fatal(err.Error())
	}

	// Decrypts secret using the associated KMS key.
	var secretString string = *result.SecretString
	fmt.Println("secret " + secretString)

	dns := fmt.Sprintf("%s:%s@/%s", username, secretString, endpoint)
	fmt.Printf("endpoint:%s  dns:%s",endpoint,dns)

	conn, err := sql.Open("mysql", dns)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	return conn
}
