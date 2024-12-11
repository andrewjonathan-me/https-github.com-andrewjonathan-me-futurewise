import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY')
    if (!newsApiKey) {
      console.error('NEWS_API_KEY is not set')
      throw new Error('NEWS_API_KEY is not set')
    }

    console.log('Fetching news from multiple categories...')
    
    // Fetch news from multiple endpoints with increased pageSize
    const endpoints = [
      `https://newsapi.org/v2/everything?q=pendidikan+OR+education+OR+universitas&language=id&pageSize=10&apiKey=${newsApiKey}`,
      `https://newsapi.org/v2/top-headlines?country=id&category=technology&pageSize=5&apiKey=${newsApiKey}`,
      `https://newsapi.org/v2/top-headlines?country=id&category=science&pageSize=5&apiKey=${newsApiKey}`
    ];

    const responses = await Promise.all(
      endpoints.map(async (url) => {
        console.log(`Fetching from: ${url.replace(newsApiKey, 'HIDDEN_API_KEY')}`);
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`Error fetching from ${url.replace(newsApiKey, 'HIDDEN_API_KEY')}: ${response.status} ${response.statusText}`);
            return { articles: [] };
          }
          const data = await response.json();
          console.log(`Successfully fetched ${data.articles?.length || 0} articles`);
          return data;
        } catch (error) {
          console.error(`Failed to fetch from ${url.replace(newsApiKey, 'HIDDEN_API_KEY')}:`, error);
          return { articles: [] };
        }
      })
    );

    // Combine and deduplicate articles
    const allArticles = responses.flatMap(response => response.articles || []);
    
    // Remove duplicates based on title
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.title, article])).values()
    );

    console.log(`Retrieved ${uniqueArticles.length} unique articles`);

    return new Response(
      JSON.stringify(uniqueArticles),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )
  }
})