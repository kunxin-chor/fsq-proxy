# Foursquare Places API Proxy & Test Frontend

A complete Express.js proxy server for the Foursquare v3 Places API (v2025-06-17) with a frontend testing interface.

## Project Structure

```
windsurf-project-2/
├── fsq-proxy-api/          # Express proxy server
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── README.md           # API documentation
├── fsq-frontend-test/      # Frontend testing interface
│   ├── index.html          # Test UI
│   ├── app.js              # Frontend logic
│   └── README.md           # Frontend docs
└── README.md               # This file
```

## Setup for GitHub Codespaces

### 1. Create Codespace

1. Push this repository to GitHub
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for the environment to load

### 2. Install Dependencies

```bash
cd fsq-proxy-api
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your Foursquare Service Key
nano .env
```

Add your Foursquare Service Key:
```
PORT=3000
FSQ_API_KEY=your_foursquare_service_key_here
```

Get your Service Key from: https://foursquare.com/developers/apps

### 4. Start the Proxy Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

### 5. Configure Port Forwarding

In Codespaces:
1. Go to the **PORTS** tab (bottom panel)
2. Port `3000` should be automatically forwarded
3. Make sure the **Visibility** is set to **Public** (click the lock icon)
4. Copy the forwarded URL (e.g., `https://username-project-xxxxx.githubpreview.dev`)

### 6. Update Frontend Configuration

Open `fsq-frontend-test/app.js` and update the API base URL:

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:3000';

// To your Codespace forwarded URL:
const API_BASE_URL = 'https://your-codespace-url-xxxxx.githubpreview.dev';
```

### 7. Open Frontend

In Codespaces, you can:
- **Option A**: Right-click `fsq-frontend-test/index.html` → **Open with Live Server**
- **Option B**: Use Python's built-in server:
  ```bash
  cd fsq-frontend-test
  python3 -m http.server 8080
  ```
  Then open the forwarded port 8080 in your browser

## Local Development Setup

### 1. Install Dependencies

```bash
cd fsq-proxy-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Foursquare Service Key
```

### 3. Start Proxy Server

```bash
npm start
```

### 4. Open Frontend

Simply open `fsq-frontend-test/index.html` in your browser, or use a local server:

```bash
cd fsq-frontend-test
python -m http.server 8080
# or
npx http-server -p 8080
```

## Modifying the Frontend

### Change API Endpoint

Edit `fsq-frontend-test/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000';  // Change this
```

### Add New Parameters

1. **Add input field** in `index.html`:
```html
<div class="form-group">
    <label for="new_param">new_param</label>
    <input type="text" id="new_param" name="new_param" placeholder="Description">
</div>
```

2. **No JavaScript changes needed** - the form automatically sends all non-empty fields!

### Customize Results Display

Edit the `displayResults()` function in `app.js`:

```javascript
function displayResults(data) {
    const results = data.results || [];
    
    resultsDiv.innerHTML = results.map(place => {
        // Customize how each place is displayed
        return `
            <div class="place-item">
                <div class="place-name">${place.name}</div>
                <!-- Add more fields here -->
            </div>
        `;
    }).join('');
}
```

## API Endpoints

### Place Search
```
GET /api/places/search
```

**All Foursquare Parameters Supported:**
- `ll`, `near`, `ne`, `sw` - Location
- `query` - Search term
- `fsq_category_ids`, `fsq_chain_ids` - Filters
- `limit`, `radius`, `sort` - Options
- `open_now`, `open_at` - Hours filters
- `min_price`, `max_price` - Price range
- `fields` - Response fields
- And more...

### Other Endpoints
- `GET /api/places/nearby` - Nearby places
- `GET /api/places/:fsq_id` - Place details
- `GET /api/places/:fsq_id/photos` - Place photos
- `GET /api/places/:fsq_id/tips` - Place tips
- `GET /api/autocomplete` - Autocomplete suggestions

## Troubleshooting

### Codespaces Issues

**CORS Errors:**
- Make sure port 3000 visibility is set to **Public**
- Check that the frontend is using the correct forwarded URL

**Port Not Forwarding:**
- Manually add port in PORTS tab: Click **Forward a Port** → Enter `3000`

**Frontend Can't Connect:**
- Verify the proxy server is running: `curl http://localhost:3000/health`
- Check `app.js` has the correct `API_BASE_URL`

### Local Development Issues

**FSQ_API_KEY not set:**
- Make sure `.env` file exists in `fsq-proxy-api/` folder
- Verify the key is a valid Foursquare Service Key (not API Key)

**CORS Errors:**
- The proxy has CORS enabled by default
- If issues persist, check browser console for specific errors

**No Results:**
- Check that you're using valid location parameters (`ll`, `near`, or `ne`+`sw`)
- Verify your Foursquare Service Key is active

## API Documentation

- **Foursquare Places API**: https://docs.foursquare.com/fsq-developers-places/reference/place-search
- **Get Service Key**: https://foursquare.com/developers/apps
- **Categories**: https://location.foursquare.com/places/docs/categories
- **Chains**: https://location.foursquare.com/places/docs/chains

## License

MIT
