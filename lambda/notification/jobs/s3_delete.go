package jobs

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/taku2023/s3-notification/driver"
	"path"
)

func S3Delete(record events.S3EventRecord) error {
	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()
	s3_dir := path.Dir(record.S3.Object.Key)
	
	if _, err := db.Exec("DELETE FROM blogs WHERE s3_dir = ?", s3_dir); err != nil {
		return err
	}
	return nil
}
