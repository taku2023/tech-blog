package jobs

import (
	"bytes"
	"fmt"
	"io"
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
	reTitle := regexp.MustCompile(`title:\s*"(.*?)"`)
	reCategories := regexp.MustCompile(`categories:\s*\[(.*?)\]`)
	reKeywords := regexp.MustCompile(`keywords:\s*\[(.*?)\]`)
	reDate := regexp.MustCompile(`date:\s*"(.*?)"`)

	summary := Summary{
		Title:      reTitle.FindStringSubmatch(contents)[1],
		Categories: strings.Split(reCategories.FindStringSubmatch(contents)[1], ","),
		Date:       reDate.FindStringSubmatch(contents)[1],
		Keywords:   strings.Split(reKeywords.FindStringSubmatch(contents)[1], ","),
	}
	return &summary, nil
}

func S3Post(record events.S3EventRecord, reader io.ReadCloser) error {

	summary, err := Extract(reader)
	if err != nil {
		return err
	}

	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()

	if _, err := db.Exec(`
		INSERT INTO blogs (id,title,categories,keywords) VALUES (?,?,?,?) 
		WHERE NOT EXISTS (SELECT * FROM blogs WHERE id = ? ) `,
		record.S3.Object.Key, summary.Title, strings.Join(summary.Categories, ","), strings.Join(summary.Keywords, ","), record.S3.Object.Key); err != nil {
		return err
	}

	return nil
}

func S3Put(record events.S3EventRecord, reader io.ReadCloser) error {

	summary, err := Extract(reader)
	if err != nil {
		return err
	}

	db, err := driver.Conn()
	if err != nil {
		return err
	}
	defer db.Close()

	if _, err := db.Exec(`UPDATE blogs SET title = ?, categories = ?, keywords = ? WHERE id = ?`, summary.Title, strings.Join(summary.Categories, ","), strings.Join(summary.Keywords, ","), record.S3.Object.Key); err != nil {
		return err
	}

	return nil
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
	id := record.S3.Object.Key
	title := summary.Title
	categories := strings.Join(summary.Categories, ",")
	keywords := strings.Join(summary.Keywords, ",")
	if _, err := db.Exec(`
	INSERT INTO blogs (id,title,categories,keywords) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE title = ?, categories = ?, keywords = ?`,
		id, title, categories, keywords, title, categories, keywords); err != nil {
		return err
	}
	return nil
}
