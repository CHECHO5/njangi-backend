# Njangi Backend API Contract (v1)

Base URL: http://localhost:8080

Auth:
- Header: `x-api-key: <API_KEY>`
- Required for all `/payments*` endpoints
- Not required for `/` and `/health`

---

## GET /

Response 200
```json
{ "ok": true, "service": "njangi-backend" }
