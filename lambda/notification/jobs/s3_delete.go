package jobs

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/taku2023/s3-notification/driver"
)

func S3Delete(record events.S3EventRecord) error {
	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()

	if _, err := db.Exec("DELETE FROM blogs WHERE id = ?", record.S3.Object.Key); err != nil {
		return err
	}
	return nil
}
