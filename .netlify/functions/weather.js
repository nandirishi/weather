       // netlify/functions/weather.js
   exports.handler = async (event) => {
     const API_KEY = process.env.OPENWEATHER_API_KEY; // Secret, stored in Netlify
     const { endpoint, units = 'metric', q, lat, lon } = event.queryStringParameters;

     if (!API_KEY) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'API key not configured' })
       };
     }

     // Build OpenWeather URL
     let url = `https://api.openweathermap.org/data/2.5/${endpoint}?appid=${API_KEY}&units=${units}`;
     if (q) url += `&q=${encodeURIComponent(q)}`;
     if (lat && lon) url += `&lat=${lat}&lon=${lon}`;

     try {
       const response = await fetch(url);
       const data = await response.json();

       return {
         statusCode: response.status,
         headers: {
           'Access-Control-Allow-Origin': '*',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
       };
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Failed to fetch weather data' })
       };
     }
   };