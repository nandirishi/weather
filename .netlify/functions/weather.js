export default async (request, context) => {
  const API_KEY = Netlify.env.get('OPENWEATHER_API_KEY'); // v2 syntax
  
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not defined' }), { status: 500 });
  }
  
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  url.searchParams.delete('endpoint');
  const openWeatherUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?${url.searchParams.toString()}&appid=${API_KEY}`;

  const response = await fetch(openWeatherUrl);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
};