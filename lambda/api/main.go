package main

import (
	"io"
	"net/http"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
	//"github.com/gorilla/mux"
	//"github.com/taku2023/tech-blog/client"
)

func main() {	
	//r := mux.NewRouter()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		//conn := client.MyConnSQL()
		//defer conn.Close()
		//conn.Query("select * from table ")
		io.WriteString(w, "Hello")
	})
	//blogs/search?q=
	//search 
	/*r.HandleFunc("/blogs/search",func(w http.ResponseWriter, r *http.Request) {
		//query := r.URL.Query()
		//q :=query.Get("q")
		conn := client.MyConnSQL()
		defer conn.Close()
		conn.Query("select * from ")

	}).Methods("GET")*/

	//r.HandleFunc("/blogs/{title}")
	//http.HandleFunc("/blogs/:id",func)
	lambda.Start(httpadapter.New(http.DefaultServeMux).ProxyWithContext)
	//http.ListenAndServe(":8080", r)
		
	//conn:=client.MyConnSQL()
	//conn.Close()
}
