package driver

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

func Conn() (*sql.DB, error) {
	// env
	endpoint := os.Getenv("endpoint")
	username := os.Getenv("username")
	secretName := os.Getenv("secret")
	region := "ap-northeast-1"
	log.Printf("endpoint:%s, username:%s, secretName:%s", endpoint, username, secretName)

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	// Create Secrets Manager client
	svc := secretsmanager.NewFromConfig(config)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"), // VersionStage defaults to AWSCURRENT if unspecified
	}

	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		return nil, err
	}

	// Decrypts secret using the associated KMS key.
	var secretString string = *result.SecretString
	fmt.Println("secret " + secretString)

	dns := fmt.Sprintf("%s:%s@/%s", username, secretString, endpoint)
	fmt.Printf("endpoint:%s  dns:%s", endpoint, dns)

	conn, err := sql.Open("mysql", dns)
	if err != nil {
		return nil, err
	}
	if err := conn.Ping(); err != nil {
		conn.Close()
		return nil, err
	}
	return conn, nil
}
