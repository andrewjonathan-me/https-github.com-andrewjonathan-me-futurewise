import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const serpApiKey = Deno.env.get('SERP_API');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received search query:', query);

    if (!serpApiKey) {
      console.error('SERP_API key is not set');
      throw new Error('SERP API key is not configured');
    }

    // Using SERP API with proper parameters for educational content
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}+site:.edu+OR+site:.ac.id&api_key=${serpApiKey}&num=5&hl=id`;
    console.log('Requesting URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('SERP API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`SERP API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('SERP API response structure:', Object.keys(data));

    // Check if we have organic results
    if (!data.organic_results || !Array.isArray(data.organic_results)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from SERP API');
    }

    // Transform SERP API results to match our expected format
    const formattedResults = data.organic_results.map(result => ({
      title: result.title || 'Untitled',
      category: "Pendidikan",
      summary: result.snippet || 'No description available',
      content: result.snippet || 'No content available',
      url: result.link
    }));

    // If no results found, provide a fallback
    if (formattedResults.length === 0) {
      formattedResults.push({
        title: "Tidak Ada Hasil",
        category: "Informasi",
        summary: "Maaf, tidak ada hasil yang ditemukan untuk pencarian ini.",
        content: "Silakan coba dengan kata kunci yang berbeda.",
        url: "#"
      });
    }

    console.log('Formatted results:', formattedResults);

    return new Response(JSON.stringify(formattedResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check Edge Function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});