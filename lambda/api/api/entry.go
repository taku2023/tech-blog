package api

import (
	"database/sql"
	"log"
	"strings"

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
	ID         string   `json:"id"`
	Title      string   `json:"title"`
	Keywords   []string `json:"keywords"`
	Categories []string `json:"categories"`
}

func (client *Api) GetBlog(c *gin.Context) {
	id := c.Param("id")
	conn, err := client.conn()
	if err != nil {
		log.Printf("error connect %s", err.Error())
		return
	}
	defer conn.Close()
	var title string
	if err := conn.QueryRow("SELECT title from blogs WHERE id = ? LIMIT 1", id).Scan(&title); err != nil {
		log.Printf("error query %s", err.Error())
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"title": title,
		})
	}
}

//
func (client *Api) SearchBlogs(c *gin.Context) {
	search, has := c.GetQuery("search")
	if !has {
		c.JSON(400, gin.H{
			"message": "request must contains search query",
		})
		return
	}
	conn, err := client.conn()
	if err != nil {
		log.Printf("error connect %s", err.Error())
		return
	}
	defer conn.Close()
	rows, err := conn.Query("SELECT id,title,categories,keywords FROM blogs WHERE title LIKE CONCAT('%',?,'%') OR keywords LIKE CONCAT('%',?,'%')  ", search, search)
	if err != nil {
		log.Printf("error query %s", err.Error())
		c.JSON(400, gin.H{
			"message": err.Error(),
		})
	} else {
		defer rows.Close()
		var blogs []Blog
		for rows.Next() {
			var blog Blog
			var keywords string
			var categories string
			if err := rows.Scan(&blog.ID, &blog.Title, &categories, &keywords); err != nil {
				c.JSON(500, gin.H{
					"message": err.Error(),
				})
				return
			}
			blog.Categories = strings.Split(categories, ",")
			blog.Keywords = strings.Split(keywords, ",")
			blogs = append(blogs, blog)
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
