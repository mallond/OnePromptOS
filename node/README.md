# Node HTTP Echo Server

This is a minimal HTTP server that exposes a single `echo` endpoint.

## Run

```
node index.js
```

## Endpoint behavior

- `POST /echo` takes `{ "message": "..." }` and returns `here is your message: ...`.

Example:

```
curl -X POST http://127.0.0.1:8787/echo ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"hello\"}"
```
