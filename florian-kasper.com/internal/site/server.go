package site

import (
	"compress/gzip"
	"embed"
	"io"
	"io/fs"
	"net/http"
	"path"
	"strconv"
	"strings"
	"sync"
)

func New(distFS embed.FS) http.Handler {
	dist, _ := fs.Sub(distFS, "dist")
	fileServer := http.FileServer(http.FS(dist))

	mux := http.NewServeMux()

	// CV redirects
	mux.HandleFunc("GET /CV.pdf", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/cv/CV.pdf", http.StatusMovedPermanently)
	})
	mux.HandleFunc("GET /CV_de.pdf", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/cv/CV_de.pdf", http.StatusMovedPermanently)
	})

	// Clean URL pages
	pages := []string{"/about", "/clients", "/projects", "/uses", "/privacy"}

	// EN pages
	for _, p := range pages {
		page := p
		mux.HandleFunc("GET "+page, func(w http.ResponseWriter, r *http.Request) {
			r.URL.Path = page + "/index.html"
			fileServer.ServeHTTP(w, r)
		})
	}

	// DE pages
	for _, p := range pages {
		page := p
		mux.HandleFunc("GET /de"+page, func(w http.ResponseWriter, r *http.Request) {
			r.URL.Path = "/de" + page + "/index.html"
			fileServer.ServeHTTP(w, r)
		})
	}

	// DE index
	mux.HandleFunc("GET /de/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/de/" {
			ext := path.Ext(r.URL.Path)
			if ext == "" {
				serve404(w, r, dist)
				return
			}
			fileServer.ServeHTTP(w, r)
			return
		}
		r.URL.Path = "/de/index.html"
		fileServer.ServeHTTP(w, r)
	})

	// DE trailing slash redirects (except /de/ itself)
	for _, p := range pages {
		page := p
		mux.HandleFunc("GET /de"+page+"/", func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "/de"+page, http.StatusMovedPermanently)
		})
	}

	// EN trailing slash redirects
	mux.HandleFunc("GET /about/", redirectNoTrailingSlash)
	mux.HandleFunc("GET /clients/", redirectNoTrailingSlash)
	mux.HandleFunc("GET /projects/", redirectNoTrailingSlash)
	mux.HandleFunc("GET /uses/", redirectNoTrailingSlash)
	mux.HandleFunc("GET /privacy/", redirectNoTrailingSlash)

	// Root + catch-all: Accept-Language detection on /, static files otherwise
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			ext := path.Ext(r.URL.Path)
			if ext == "" {
				serve404(w, r, dist)
				return
			}
			fileServer.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Vary", "Accept-Language")
		if prefersGerman(r) {
			http.Redirect(w, r, "/de/", http.StatusFound)
			return
		}
		fileServer.ServeHTTP(w, r)
	})

	return withHeaders(withGzip(mux))
}

func redirectNoTrailingSlash(w http.ResponseWriter, r *http.Request) {
	target := strings.TrimSuffix(r.URL.Path, "/")
	if target == "" {
		target = "/"
	}
	http.Redirect(w, r, target, http.StatusMovedPermanently)
}

func serve404(w http.ResponseWriter, r *http.Request, fsys fs.FS) {
	name := "404.html"
	if strings.HasPrefix(r.URL.Path, "/de/") {
		name = "de/404.html"
	}
	data, err := fs.ReadFile(fsys, name)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusNotFound)
	w.Write(data)
}

// prefersGerman parses the Accept-Language header and returns true if
// German ("de") has a higher quality value than English ("en").
func prefersGerman(r *http.Request) bool {
	accept := r.Header.Get("Accept-Language")
	if accept == "" {
		return false
	}
	var bestDE, bestEN float64 = -1, -1
	for _, entry := range strings.Split(accept, ",") {
		entry = strings.TrimSpace(entry)
		if entry == "" {
			continue
		}
		tag, q := parseAcceptEntry(entry)
		lang := strings.ToLower(tag)
		switch {
		case strings.HasPrefix(lang, "de"):
			if q > bestDE {
				bestDE = q
			}
		case strings.HasPrefix(lang, "en"):
			if q > bestEN {
				bestEN = q
			}
		}
	}
	if bestDE < 0 {
		return false
	}
	return bestDE > bestEN
}

func parseAcceptEntry(s string) (tag string, q float64) {
	q = 1.0
	parts := strings.SplitN(s, ";", 2)
	tag = strings.TrimSpace(parts[0])
	if len(parts) < 2 {
		return tag, q
	}
	param := strings.TrimSpace(parts[1])
	if strings.HasPrefix(param, "q=") {
		if v, err := strconv.ParseFloat(param[2:], 64); err == nil {
			q = v
		}
	}
	return tag, q
}

func withHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		p := r.URL.Path
		switch {
		case strings.HasPrefix(p, "/assets/"):
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		case strings.HasSuffix(p, ".html") || p == "/" || !strings.Contains(path.Base(p), "."):
			w.Header().Set("Cache-Control", "public, max-age=3600")
		case strings.HasPrefix(p, "/images/") || strings.HasPrefix(p, "/clients/"):
			w.Header().Set("Cache-Control", "public, max-age=86400")
		default:
			w.Header().Set("Cache-Control", "public, max-age=86400")
		}

		next.ServeHTTP(w, r)
	})
}

var gzPool = sync.Pool{
	New: func() any {
		gz, _ := gzip.NewWriterLevel(nil, gzip.DefaultCompression)
		return gz
	},
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func withGzip(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			next.ServeHTTP(w, r)
			return
		}

		ext := path.Ext(r.URL.Path)
		compressible := ext == "" || ext == ".html" || ext == ".css" || ext == ".js" || ext == ".json" || ext == ".xml" || ext == ".svg" || ext == ".txt"
		if !compressible {
			next.ServeHTTP(w, r)
			return
		}

		gz := gzPool.Get().(*gzip.Writer)
		defer gzPool.Put(gz)
		gz.Reset(w)
		defer gz.Close()

		w.Header().Set("Content-Encoding", "gzip")
		w.Header().Del("Content-Length")
		next.ServeHTTP(gzipResponseWriter{Writer: gz, ResponseWriter: w}, r)
	})
}
