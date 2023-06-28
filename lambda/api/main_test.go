package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"github.com/taku2023/tech-blog/api"
)

//use db in  docker-compose.yml
func mockDBDriver() (*sql.DB, error) {
	dns := "root:password@tcp(localhost:3306)/blog_dev"
	conn, err := sql.Open("mysql", dns)
	if err != nil {
		return nil, err
	}
	if err := conn.Ping(); err != nil {
		conn.Close()
		return nil, err
	}
	return conn, err
}

func TestGetBlog(t *testing.T) {
	r := ginRouter(api.MockClient(mockDBDriver))
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/blogs/1", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	var data struct {
		Title string `json:"title"`
	}
	json.Unmarshal(w.Body.Bytes(), &data)
	assert.Equal(t, "How to test golang?", data.Title)
}

func TestSearchBlog(t *testing.T) {
	r := ginRouter(api.MockClient(mockDBDriver))
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/blogs?search=aws", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
	var data struct {
		Blogs []api.Blog `json:"blogs"`
	}
	fmt.Print(w.Body.String())
	json.Unmarshal(w.Body.Bytes(), &data)
	assert.Equal(t, "How to test golang?", data.Blogs[0].Title)
}
