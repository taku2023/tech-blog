package jobs

import (
	"bytes"
	"fmt"
	"io"
	"regexp"
	"strings"
)

type Summary struct {
	Title       string
	Description string
	Categories  []string
	Keywords    []string
	Date        string
}

func Extract(reader io.ReadCloser) (*Summary, error) {
	buffer := make([]byte, 1024)
	defer reader.Close()
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

	reTitle := regexp.MustCompile(`title:\s*\"(.+)\"`)
	reDescription := regexp.MustCompile(`description:\s*\"(.*?)\"`)
	reCategories := regexp.MustCompile(`categories:\s*\[(.*?)\]`)
	reKeywords := regexp.MustCompile(`keywords:\s*\[(.*?)\]`)
	reDate := regexp.MustCompile(`date:\s*\"(.*?)\"`)

	summary := &Summary{
		Title:       reTitle.FindStringSubmatch(contents)[1],
		Description: reDescription.FindStringSubmatch(contents)[1],
		Categories:  strings.Split(reCategories.FindStringSubmatch(contents)[1], ","),
		Date:        reDate.FindStringSubmatch(contents)[1],
		Keywords:    strings.Split(reKeywords.FindStringSubmatch(contents)[1], ","),
	}
	return summary, nil
}
