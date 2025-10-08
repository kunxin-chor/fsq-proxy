# Foursquare Places API Frontend Test

A simple frontend application to test the Foursquare Places API proxy with `near` and `query` parameters.

## Features

- Search places by location (`near` parameter)
- Filter by search query (`query` parameter)
- Optional limit and radius parameters
- Beautiful, responsive UI
- Real-time results display

## Setup

1. Make sure your Foursquare API proxy server is running:
   ```bash
   cd ../fsq-proxy-api
   npm start
   ```

2. Open `index.html` in your browser:
   - Simply double-click the file, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8080
     
     # Using Node.js http-server
     npx http-server -p 8080
     ```

3. Navigate to `http://localhost:8080` (if using a local server)

## Usage

1. **Location (near)**: Enter a location like "New York, NY", "San Francisco, CA", or "London, UK"
2. **Search Query (q)**: Enter what you're looking for like "coffee", "pizza", "restaurant"
3. **Limit** (optional): Number of results (1-50, default: 10)
4. **Radius** (optional): Search radius in meters (default: 1000)

## Example Searches

- **Location**: "New York, NY" | **Query**: "coffee"
- **Location**: "San Francisco, CA" | **Query**: "pizza"
- **Location**: "London, UK" | **Query**: "restaurant"
- **Location**: "Tokyo, Japan" | **Query**: "sushi"

## API Endpoint

The frontend calls:
```
GET http://localhost:3000/api/places/search?near={location}&query={search_term}
```

## Troubleshooting

- **CORS Error**: Make sure your proxy server has CORS enabled (it should by default)
- **Connection Refused**: Ensure the proxy server is running on port 3000
- **No Results**: Try a different location or broader search query
- **API Key Error**: Check that your Foursquare Service Key is set in the proxy server's `.env` file
