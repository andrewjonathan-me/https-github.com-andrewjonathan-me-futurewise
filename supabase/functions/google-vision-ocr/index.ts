import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_VISION_API_KEY')
    if (!apiKey) {
      throw new Error('Google Vision API key not configured')
    }

    // Prepare the request to Google Cloud Vision API
    const visionRequest = {
      requests: [{
        image: {
          content: image
        },
        features: [{
          type: "TEXT_DETECTION",
          maxResults: 1
        }],
        imageContext: {
          languageHints: ["id", "en"]  // Added language hints for Indonesian and English
        }
      }]
    };

    console.log('Sending request to Google Cloud Vision API...')
    
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionRequest)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Vision API Error Response:', errorData);
      throw new Error(`Google Vision API returned status ${response.status}`);
    }

    const result = await response.json()
    console.log('Google Vision API Response:', JSON.stringify(result, null, 2))

    if (!result.responses?.[0]?.fullTextAnnotation?.text) {
      console.error('No text detected in response:', result);
      throw new Error('No text detected in image')
    }

    const text = result.responses[0].fullTextAnnotation.text

    return new Response(
      JSON.stringify({ 
        text,
        confidence: result.responses[0].fullTextAnnotation.confidence || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Google Vision API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})