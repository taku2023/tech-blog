package jobs

import (
	"bytes"
	"fmt"
	"io"
	"path"
	"regexp"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/taku2023/s3-notification/driver"
)

type Summary struct {
	Title      string
	Categories []string
	Keywords   []string
	Date       string
}

func Extract(reader io.ReadCloser) (*Summary, error) {
	buffer := make([]byte, 1024)
	if _, err := reader.Read(buffer); err != nil {
		fmt.Printf("error read buffer %s", err.Error())
		return nil, err
	}
	var b bytes.Buffer
	if _, err := b.Write(buffer); err != nil {
		fmt.Printf("error write buffer %s", err.Error())
		return nil, err
	}
	contents := b.String()
	reTitle := regexp.MustCompile(`title:\s*(.*?)\n`)
	reCategories := regexp.MustCompile(`categories:\s*\[(.*?)\]`)
	reKeywords := regexp.MustCompile(`keywords:\s*\[(.*?)\]`)
	reDate := regexp.MustCompile(`date:\s*(.*?)\n`)
	
	summary := Summary{
		Title:      reTitle.FindStringSubmatch(contents)[1],
		Categories: strings.Split(reCategories.FindStringSubmatch(contents)[1], ","),
		Date:       reDate.FindStringSubmatch(contents)[1],
		Keywords:   strings.Split(reKeywords.FindStringSubmatch(contents)[1], ","),
	}
	return &summary, nil
}

func S3UPSert(record events.S3EventRecord, reader io.ReadCloser) error {
	summary, err := Extract(reader)
	if err != nil {
		return err
	}

	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()
	dir:= path.Dir(record.S3.Object.Key)
	title := summary.Title
	categories := strings.Join(summary.Categories, ",")
	keywords := strings.Join(summary.Keywords, ",")
	datetime := summary.Date
	if _, err := db.Exec(`
	INSERT INTO blogs (s3_dir,title,categories,keywords,create_at) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE title = ?, categories = ?, keywords = ?, update_at = ?`,
		dir, title, categories, keywords, datetime, title, categories, keywords,datetime); err != nil {
		return err
	}
	return nil
}
