FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
COPY data/ ../data/
RUN LOCALE=en npx vite build && LOCALE=de npx vite build && node generate-sitemap.js

FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod ./
COPY . .
COPY --from=frontend /app/cmd/server/dist ./cmd/server/dist
COPY cv_en.pdf ./cmd/server/dist/cv/CV.pdf
COPY cv_de.pdf ./cmd/server/dist/cv/CV_de.pdf
COPY cv_en.docx ./cmd/server/dist/cv/CV.docx
COPY cv_de.docx ./cmd/server/dist/cv/CV_de.docx
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

FROM gcr.io/distroless/static-debian12
COPY --from=builder /server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
