package driver

import (
	"context"
	"database/sql"
	"encoding/json"
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
	dbName := os.Getenv("dbname")
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
	var jsonMap map[string]any
	json.Unmarshal([]byte(secretString), &jsonMap)
	password := jsonMap["password"]
	//dbName := jsonMap["dbInstanceIdentifier"]

	fmt.Println("secret " + secretString)

	//user:password@tcp(your-database-instance-name:port-number)/dbname
	dns := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, endpoint, "3306", dbName)
	fmt.Printf("dns:%s", dns)
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
