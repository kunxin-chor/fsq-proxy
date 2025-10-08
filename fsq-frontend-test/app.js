// Configuration
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const resultsDiv = document.getElementById('results');
const resultsCount = document.getElementById('resultsCount');
const searchBtn = document.getElementById('searchBtn');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// Handle Search Form Submission
async function handleSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const params = new URLSearchParams();
    
    // Add all non-empty form fields to params
    for (const [key, value] of formData.entries()) {
        if (value && value.trim() !== '') {
            params.append(key, value.trim());
        }
    }
    
    // Show loading state
    showLoading();
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/places/search?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
            // Display Foursquare error as-is
            showError(JSON.stringify(data, null, 2));
        } else {
            displayResults(data);
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showError(`Error: ${error.message}`);
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search Places';
    }
}

// Display Results
function displayResults(data) {
    resultsContainer.style.display = 'block';
    
    const results = data.results || [];
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h3>No places found</h3>
                <p>Try adjusting your search parameters</p>
            </div>
        `;
        resultsCount.textContent = '0 places';
        return;
    }
    
    resultsCount.textContent = `${results.length} place${results.length !== 1 ? 's' : ''}`;
    
    resultsDiv.innerHTML = results.map(place => {
        const name = place.name || 'Unknown Place';
        const category = place.categories?.[0]?.name || 'Uncategorized';
        const address = formatAddress(place.location);
        const distance = place.distance ? `${place.distance}m away` : '';
        const fsqId = place.fsq_place_id || place.fsq_id || 'N/A';
        
        return `
            <div class="place-item">
                <div class="place-name">${escapeHtml(name)}</div>
                <span class="place-category">${escapeHtml(category)}</span>
                ${address ? `<div class="place-address">📍 ${escapeHtml(address)}</div>` : ''}
                ${distance ? `<div class="place-distance">📏 ${distance}</div>` : ''}
                <div style="font-size: 12px; color: #999; margin-top: 8px;">
                    ID: ${escapeHtml(fsqId)}
                </div>
            </div>
        `;
    }).join('');
}

// Format Address
function formatAddress(location) {
    if (!location) return '';
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.locality) parts.push(location.locality);
    if (location.region) parts.push(location.region);
    if (location.postcode) parts.push(location.postcode);
    
    return parts.join(', ');
}

// Show Loading State
function showLoading() {
    resultsContainer.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Searching for places...</p>
        </div>
    `;
}

// Show Error
function showError(message) {
    resultsContainer.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="error">
            <strong>⚠️ Error:</strong> ${escapeHtml(message)}
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Log API info on load
console.log('Foursquare Places API Test');
console.log('API Base URL:', API_BASE_URL);
console.log('Make sure your proxy server is running on port 3000');
