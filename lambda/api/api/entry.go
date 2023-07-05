package api

import (
	"database/sql"
	"log"
	"strings"
	"time"

	//"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/taku2023/tech-blog/driver"
)

type Conn = func() (*sql.DB, error)

type Api struct {
	conn Conn
}

func NewClient() Api {
	return Api{
		conn: driver.Conn,
	}
}

func MockClient(conn Conn) Api {
	return Api{
		conn: conn,
	}
}

type Blog struct {
	Key        string    `json:"object_key"`
	Title      string    `json:"title"`
	Categories []string  `json:"categories"`
	Keywords   []string  `json:"keywords"`
	CreateAt   time.Time `json:"create_at"`
	UpdateAt   time.Time `json:"update_at"`
	Viewer     int       `json:"viewer"`
}

func New(key string, title string, categories string, keywords string, createAt time.Time, updateAt sql.NullTime, viewr int) Blog {
	//updateAt := updateAt.Valid
	update := time.Time{}
	if updateAt.Valid {
		update = updateAt.Time
	}

	return Blog{
		Key:        key,
		Title:      title,
		Categories: strings.Split(categories, ","),
		Keywords:   strings.Split(keywords, ","),
		CreateAt:   createAt,
		UpdateAt:   update,
		Viewer:     viewr,
	}
}

func (client *Api) GetBlog(c *gin.Context) {
	object_key := c.Param("key")
	conn, err := client.conn()
	if err != nil {
		log.Printf("error connect %s", err.Error())
		return
	}
	defer conn.Close()

	var blog struct {
		Key        string
		Title      string
		Categories string
		Keywords   string
		CreateAt   time.Time
		UpdateAt   sql.NullTime
		Viewer     int
	}
	if err := conn.QueryRow("SELECT * from blogs WHERE object_key = ?", object_key).Scan(&blog.Key, &blog.Title, &blog.Categories, &blog.Keywords, &blog.CreateAt, &blog.UpdateAt, &blog.Viewer); err != nil {
		log.Printf("error query %s", err.Error())
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		blog := New(blog.Key, blog.Title, blog.Categories, blog.Keywords, blog.CreateAt, blog.UpdateAt, blog.Viewer)
		c.JSON(200, gin.H{
			"blog": blog,
		})
	}
}

//
func (client *Api) SearchBlogs(c *gin.Context) {

	search, hasSearch := c.GetQuery("search")
	category, hasCategory := c.GetQuery("cateogry")
	if !hasSearch && !hasCategory {
		c.JSON(400, gin.H{
			"message": "query must contain either 'search' or 'category' parameter",
		})
		return
	}

	conn, err := client.conn()
	if err != nil {
		log.Printf("error connect %s", err.Error())
		c.JSON(500, gin.H{
			"message": "database connect error : " + err.Error(),
		})
		return
	}
	defer conn.Close()

	var rows *sql.Rows
	switch {
	//case !hasSearch && !hasCategory:
	case !hasSearch:
		statement := "SELECT * FROM blogs WHERE categories LIKE CONCAT('%',?,'%')"
		rows, err = conn.Query(statement, category)
	case !hasCategory:
		statement := "SELECT * FROM blogs WHERE title LIKE CONCAT('%',?,'%') OR keywords LIKE CONCAT('%',?,'%')"
		rows, err = conn.Query(statement, search, search)
	default:
		statement := "SELECT * FROM blogs WHERE title LIKE CONCAT('%',?,'%') OR keywords LIKE CONCAT('%',?,'%') AND categories LIKE CONCAT('%',?,'%')"
		rows, err = conn.Query(statement, search, search, category)
	}

	if err != nil {
		log.Printf("error query %s", err.Error())
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		defer rows.Close()
		var blogs []Blog
		for rows.Next() {
			var blog struct {
				Key        string
				Title      string
				Categories string
				Keywords   string
				CreateAt   time.Time
				UpdateAt   sql.NullTime
				Viewer     int
			}
			if err := rows.Scan(&blog.Key, &blog.Title, &blog.Categories, &blog.Keywords, &blog.CreateAt, &blog.UpdateAt, &blog.Viewer); err != nil {
				c.JSON(500, gin.H{
					"message": err.Error(),
				})
				return
			}
			blogs = append(blogs, New(blog.Key, blog.Title, blog.Categories, blog.Keywords, blog.CreateAt, blog.UpdateAt, blog.Viewer))
		}
		if len(blogs) == 0 {
			c.JSON(404, gin.H{
				"message": "not found",
			})
		} else {
			c.JSON(200, gin.H{
				"blogs": blogs,
			})
		}
	}
}

//keywords
func (client *Api) GetCategories(c *gin.Context) {
	conn, err := client.conn()
	if err != nil {
		log.Printf("error connect%s", err.Error())
		return
	}
	defer conn.Close()

	rows, err := conn.Query("SELECT categories FROM blogs")
	if err != nil {
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		defer rows.Close()
		//var categories []string
		allKeys := make(map[string]bool)
		var keys []string

		for rows.Next() {
			var categories string
			if err := rows.Scan(&categories); err != nil {
				c.JSON(500, gin.H{
					"message": err.Error(),
				})
				return
			}
			for _, category := range strings.Split(categories, ",") {
				if _, err := allKeys[category]; !err {
					allKeys[category] = true
					keys = append(keys, category)
				}
			}
		}

		c.JSON(200, gin.H{
			"categories": keys,
		})
	}
}
