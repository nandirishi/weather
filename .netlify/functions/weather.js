export default async (request) => {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  const apiKey =
    Netlify.env.get('OPENWEATHER_API_KEY') ||
    Netlify.env.get('API_KEY') ||
    process.env.OPENWEATHER_API_KEY ||
    process.env.API_KEY;

  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Missing endpoint' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not defined' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const params = new URLSearchParams(url.searchParams);
  params.delete('endpoint');
  params.set('appid', apiKey);

  const openWeatherUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?${params.toString()}`;
  const response = await fetch(openWeatherUrl);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
};