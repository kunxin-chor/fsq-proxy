# Foursquare Places API Proxy

A simple Express.js proxy server for the Foursquare v3 Places API that helps you securely access the API from your frontend applications.

## Features

- Search for places by location and query
- Get place details by Foursquare ID
- Retrieve place photos
- CORS enabled
- Request logging
- Environment variable configuration

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Foursquare API key (get one from [Foursquare Developer Portal](https://foursquare.com/developers/))

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Foursquare API key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and replace `your_foursquare_api_key_here` with your actual API key from the [Foursquare Developer Console](https://foursquare.com/developers/apps)

## Running the Server

- Development (with auto-reload):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### 1. Search Places
Search for places using various parameters including location, query, categories, and filters.

```
GET /api/places/search
```

**Location Parameters (at least one required):**
- `ll`: Latitude and longitude in format "lat,lng" (e.g., "40.7128,-74.0060")
- `near`: Geocodable locality (e.g., "New York, NY")
- `ne` & `sw`: Northeast and Southwest corners for rectangular boundary

**Search Parameters:**
- `query`: Search query (e.g., "coffee", "restaurant", "pizza")
- `categories`: Comma-separated category IDs or codes
- `chains`: Comma-separated chain IDs or slugs
- `fields`: Comma-separated list of fields to return

**Filter Parameters:**
- `limit` (default: 50, max: 50): Number of results to return
- `radius`: Search radius in meters (max: 100000)
- `sort` (default: RELEVANCE): Sort order (RELEVANCE, RATING, DISTANCE, POPULARITY)
- `open_now`: Filter for currently open places (true/false)
- `min_price`: Minimum price tier (1-4)
- `max_price`: Maximum price tier (1-4)

**Example:**
```
GET /api/places/search?ll=40.7128,-74.0060&query=coffee&limit=10&open_now=true
```

### 2. Nearby Search
Get places near a specific location.

```
GET /api/places/nearby?ll=LATITUDE,LONGITUDE
```

**Parameters:**
- `ll` (required): Latitude and longitude in format "lat,lng"
- `limit` (default: 50, max: 50): Number of results to return
- `radius`: Search radius in meters
- `categories`: Comma-separated category IDs
- `fields`: Comma-separated list of fields to return

**Example:**
```
GET /api/places/nearby?ll=40.7128,-74.0060&categories=13065&limit=20
```

### 3. Get Place Details
Retrieve comprehensive information about a specific place.

```
GET /api/places/:fsq_id
```

**Parameters:**
- `fsq_id` (required): Foursquare place ID
- `fields`: Comma-separated list of fields to return (e.g., "name,location,rating,hours,photos")

**Example:**
```
GET /api/places/4b0588f0f964a520f4a522e3?fields=name,location,rating,hours
```

### 4. Get Place Photos
Retrieve photos for a specific place.

```
GET /api/places/:fsq_id/photos
```

**Parameters:**
- `fsq_id` (required): Foursquare place ID
- `limit` (default: 5): Number of photos to return
- `classifications`: Filter by photo classifications

**Example:**
```
GET /api/places/4b0588f0f964a520f4a522e3/photos?limit=10
```

### 5. Get Place Tips
Get user-generated tips and reviews for a place.

```
GET /api/places/:fsq_id/tips
```

**Parameters:**
- `fsq_id` (required): Foursquare place ID
- `limit` (default: 5): Number of tips to return
- `sort` (default: POPULAR): Sort order (POPULAR, NEWEST)

**Example:**
```
GET /api/places/4b0588f0f964a520f4a522e3/tips?limit=10&sort=NEWEST
```

### 6. Autocomplete
Get autocomplete suggestions for places, addresses, and searches.

```
GET /api/autocomplete?query=SEARCH_TERM
```

**Parameters:**
- `query` (required): Search query string
- `ll`: Latitude and longitude for location bias
- `radius`: Search radius in meters
- `limit` (default: 10): Number of results to return
- `types`: Filter by result types (place, geo, address, search)

**Example:**
```
GET /api/autocomplete?query=starbucks&ll=40.7128,-74.0060&limit=5
```

## Common Category IDs

Here are some frequently used Foursquare category IDs:

- **13065** - Coffee Shop
- **13145** - Fast Food Restaurant
- **13031** - Burger Joint
- **13034** - Café
- **13035** - Cafeteria
- **13003** - Bar
- **13025** - Breakfast Spot
- **13064** - Chinese Restaurant
- **13236** - Italian Restaurant
- **13276** - Mexican Restaurant
- **13302** - Pizza Place
- **13347** - Sushi Restaurant
- **17069** - Hotel
- **16032** - Gym / Fitness Center
- **10032** - Nightclub

For a complete list of categories, visit the [Foursquare Category Documentation](https://docs.foursquare.com/data-products/docs/categories).

## Example Requests

See `examples.http` file for sample API requests you can use with REST Client extensions.

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes. Errors include a message and status code.

**Example Error Response:**
```json
{
  "error": {
    "message": "Invalid API key",
    "status": 401
  }
}
```

## Security

- Never commit your `.env` file
- Keep your Foursquare API key secure
- Consider adding rate limiting in production

## License

MIT
