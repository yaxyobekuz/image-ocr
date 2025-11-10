# Poor Image OCR API 😎

A REST API for extracting text from images using Optical Character Recognition (OCR).  
Built with Node.js, Express, and Tesseract.js.

---

## Features

- Extract text from images using OCR
- Accurate text extraction with confidence scores
- Multi-language support (English, Spanish, French, German, etc.)
- RESTful API endpoints
- File validation (type and size)
- Interactive Swagger/OpenAPI documentation
- Secure file uploads
- Rate limiting and security rules
- Efficient memory usage with worker pooling

---

## Requirements

- **Node.js** >= 18.0.0
- **npm** or **yarn**

---

## Installation

```bash
npm install
```

---

## Environment Configuration

Create a `.env` file:

```env
NODE_ENV=development
PORT=3000
HOST=localhost
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/png,image/jpeg,image/jpg,image/webp
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
LOG_LEVEL=info
```

---

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server URL: `http://localhost:3000`
API Docs: `http://localhost:3000/api-docs`

---

## API Endpoints

### OCR Processing

**POST** `/api/ocr/process`

#### Request

* `image` (file, required): PNG, JPG, JPEG, WEBP (Max 10MB)
* `language` (string, optional): OCR language (default: `eng`)

#### Response

```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "text": "Extracted text from image...",
    "confidence": 95.67,
    "language": "eng",
    "processingTime": 1234
  }
}
```

---

### Health Check

**GET** `/api/health`

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-10T10:30:45.123Z",
  "uptime": 123.45
}
```

---

## Supported Languages

* `eng` – English
* `spa` – Spanish
* `fra` – French
* `deu` – German
* `rus` – Russian
* `chi_sim` – Chinese (Simplified)
* `jpn` – Japanese

Additional Tesseract traineddata files can be installed for more languages.

---

## Technologies Used

* Node.js
* Express.js
* Tesseract.js
* Multer (file upload)
* Helmet (security)
* Swagger (API documentation)

---

## Security

* Helmet HTTP headers protection
* CORS configuration
* Rate limiting (100 requests / 15 min)
* File type and size validation
* Input validation

---

## Project Structure

```
image-ocr/
  src/
    config/          # Configuration files
    controllers/     # Route controllers
    middleware/      # Express middlewares
    routes/          # API routes
    services/        # Business logic
    utils/           # Helper utilities
    app.js           # Express app setup
    server.js        # Server entry point
  uploads/           # Temporary uploaded files
  .env               # Environment variables
  package.json
  README.md
```

---

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:3000/api/ocr/process \
  -F "image=@/path/to/image.png" \
  -F "language=eng"
```

---

### JavaScript (Fetch API)

```js
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('language', 'eng');

fetch('http://localhost:3000/api/ocr/process', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### Python (requests)

```python
import requests

url = 'http://localhost:3000/api/ocr/process'
files = {'image': open('image.png', 'rb')}
data = {'language': 'eng'}

response = requests.post(url, files=files, data=data)
print(response.json())
```

---

## License

MIT

---

**Author:** Yaxyobek (Yakhyobek)
**Year:** 2025