    const BASE_URL = '/.netlify/functions/weather';
    
    // 2. DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const errorDiv  = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');
    const currentDiv = document.getElementById('currentWeather');
    const forecastDiv = document.getElementById('forecast');
    const forecastGrid = document.getElementById('forecastGrid');
    
    // 3. EVENT LISTENERS
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    
    // Load default city on page load
    window.addEventListener('load', () => {
      cityInput.value = 'Bardhaman';
      handleSearch();
    });
    
    // 4. MAIN SEARCH FUNCTION - HTTP Requests + Error Handling
    async function handleSearch() {
      const city = cityInput.value.trim();
      if (!city) return showError('Please enter a city name');
      
      hideError();
      showLoading();
      currentDiv.style.display = 'none';
      forecastDiv.style.display = 'none';
      
      try {
        const [currentData, forecastData] = await Promise.all([
          fetchWeather('weather', { q: city, units: 'metric' }),
          fetchWeather('forecast', { q: city, units: 'metric' })
        ]);
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
      } catch (err) {
        showError(err.message);
      } finally {
        hideLoading();
      }
    }
    
    // 5. HTTP REQUEST FUNCTION - Core API concept
    async function fetchWeather(endpoint, params = {}) {
      const query = new URLSearchParams({ endpoint, ...params });
      const response = await fetch(`${BASE_URL}?${query.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('City not found. Check spelling.');
        if (response.status === 401) throw new Error('Invalid API key.');
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      return await response.json();
    }
    
    // 6. DISPLAY CURRENT WEATHER - JSON Parsing
    function displayCurrentWeather(data) {
      document.getElementById('cityName').textContent = data.name;
      document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById('description').textContent = data.weather[0].description;
      document.getElementById('humidity').textContent = data.main.humidity;
      document.getElementById('wind').textContent = data.wind.speed;
      document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
      currentDiv.style.display = 'block';
    }
    
    // 7. DISPLAY 5-DAY FORECAST - More JSON Parsing
    function displayForecast(data) {
      forecastGrid.innerHTML = '';
      
      // API returns 40 items, 3-hour intervals. We want 1 per day at 12:00
      const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      
      dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        
        const card = document.createElement('div');
        card.className = 'forecast-card-item';
        card.innerHTML = `
          <div class="forecast-day">${dayName}</div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
          <div class="forecast-temp">${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</div>
          <p>${day.weather[0].main}</p>
        `;
        forecastGrid.appendChild(card);
      });
      
      forecastDiv.style.display = 'block';
    }
    
    // 8. UI HELPERS
    function showError(msg) {
      errorDiv.textContent = msg;
      errorDiv.style.display = 'block';
    }
    function hideError() { errorDiv.style.display = 'none'; }
    function showLoading() { loadingDiv.style.display = 'block'; }
    function hideLoading() { loadingDiv.style.display = 'none'; }