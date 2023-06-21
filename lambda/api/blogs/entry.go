package blogs

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/taku2023/tech-blog/driver"
)

func Get(c *gin.Context) {
	id := c.Param("id")
	conn, err := driver.Conn()
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

func Put(c *gin.Context) {
	// create table articles(id varchar(32) unique, title varchar(32) )
}
