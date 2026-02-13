package main

import (
	"embed"
	"log"
	"net/http"
	"os"

	"github.com/nirnanaaa/florian-kasper.com/internal/site"
)

//go:embed all:dist
var distFS embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := site.New(distFS)
	log.Printf("listening on :%s", port)
	if err := http.ListenAndServe(":"+port, srv); err != nil {
		log.Fatal(err)
	}
}
