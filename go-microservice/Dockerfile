FROM golang:1.21

WORKDIR /app
COPY . .
RUN go mod tidy 
RUN cd cmd/freight && \
  go build -buildvcs=false -o main . 
EXPOSE 8080
CMD [ "./cmd/freight/main" ]