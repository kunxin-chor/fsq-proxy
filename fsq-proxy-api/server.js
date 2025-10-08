require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const FSQ_API_KEY = process.env.FSQ_API_KEY;
const FSQ_BASE_URL = 'https://places-api.foursquare.com/places';
const FSQ_API_VERSION = '2025-06-17';

if (!FSQ_API_KEY) {
  console.error('Error: FSQ_API_KEY is not set in .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Create axios instance with common headers for LATEST Foursquare Places API
const fsqClient = axios.create({
  baseURL: FSQ_BASE_URL,
  headers: {
    'Authorization': `Bearer ${FSQ_API_KEY}`,
    'Accept': 'application/json',
    'X-Places-Api-Version': FSQ_API_VERSION
  }
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Foursquare Places API Proxy is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Foursquare Places API Proxy',
    version: '1.0.0',
    endpoints: {
      search: '/api/places/search',
      nearby: '/api/places/nearby',
      details: '/api/places/:fsq_id',
      photos: '/api/places/:fsq_id/photos',
      tips: '/api/places/:fsq_id/tips',
      autocomplete: '/api/autocomplete'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// Place Search - Search for places using various parameters
app.get('/api/places/search', async (req, res, next) => {
  try {
    const response = await fsqClient.get('/search', { params: req.query });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// Nearby Search - Get places near a location
app.get('/api/places/nearby', async (req, res, next) => {
  try {
    const { ll, limit = 50, radius, categories, fields } = req.query;
    
    if (!ll) {
      return res.status(400).json({ error: 'll (latitude,longitude) parameter is required' });
    }

    const params = { ll };
    if (limit) params.limit = parseInt(limit);
    if (radius) params.radius = parseInt(radius);
    if (categories) params.categories = categories;
    if (fields) params.fields = fields;

    const response = await fsqClient.get('/nearby', { params });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// Get Place Details
app.get('/api/places/:fsq_id', async (req, res, next) => {
  try {
    const { fsq_id } = req.params;
    const { fields } = req.query;

    const params = {};
    if (fields) params.fields = fields;

    const response = await fsqClient.get(`/${fsq_id}`, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// Get Place Photos
app.get('/api/places/:fsq_id/photos', async (req, res, next) => {
  try {
    const { fsq_id } = req.params;
    const { limit = 5, classifications } = req.query;

    const params = { limit: parseInt(limit) };
    if (classifications) params.classifications = classifications;

    const response = await fsqClient.get(`/${fsq_id}/photos`, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// Get Place Tips
app.get('/api/places/:fsq_id/tips', async (req, res, next) => {
  try {
    const { fsq_id } = req.params;
    const { limit = 5, sort = 'POPULAR' } = req.query;

    const params = { 
      limit: parseInt(limit),
      sort 
    };

    const response = await fsqClient.get(`/${fsq_id}/tips`, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// Autocomplete - Get autocomplete suggestions
app.get('/api/autocomplete', async (req, res, next) => {
  try {
    const { query, ll, radius, limit = 10, types } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const params = { query };
    if (ll) params.ll = ll;
    if (radius) params.radius = parseInt(radius);
    if (limit) params.limit = parseInt(limit);
    if (types) params.types = types;

    const response = await fsqClient.get('/autocomplete', { params });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data
      });
    }
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
