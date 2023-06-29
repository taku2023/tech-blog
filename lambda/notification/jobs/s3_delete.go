package jobs

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/taku2023/s3-notification/driver"
	"strings"
)

func S3Delete(record events.S3EventRecord) error {
	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()
	object_key,_,_ := strings.Cut(record.S3.Object.Key,".")
	
	if _, err := db.Exec("DELETE FROM blogs WHERE object_key = ?", object_key); err != nil {
		return err
	}
	return nil
}
