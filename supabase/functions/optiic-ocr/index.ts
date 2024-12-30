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
    
    const apiKey = Deno.env.get('OPTIIC_API')
    if (!apiKey) {
      throw new Error('Optiic API key not configured')
    }

    console.log('Sending request to Optiic API...')
    
    const response = await fetch('https://api.optiic.dev/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${image}`,
        language: 'ind',
        mode: 'ocr'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Optiic API Error Response:', errorData);
      throw new Error(`Optiic API returned status ${response.status}`);
    }

    const result = await response.json()
    console.log('Optiic API Response:', JSON.stringify(result, null, 2))

    if (!result.text) {
      console.error('No text detected in response:', result);
      throw new Error('No text detected in image')
    }

    return new Response(
      JSON.stringify({ 
        text: result.text,
        confidence: result.confidence || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Optiic API Error:', error)
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