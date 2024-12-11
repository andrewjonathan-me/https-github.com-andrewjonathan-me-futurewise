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
    
    const apiKey = Deno.env.get('OCR_API')
    if (!apiKey) {
      throw new Error('OCR API key not configured')
    }

    // Convert base64 to form data
    const formData = new FormData()
    formData.append('base64Image', image)
    formData.append('language', 'eng')
    formData.append('isOverlayRequired', 'true')
    formData.append('OCREngine', '2')

    console.log('Sending request to OCR.space API...')
    
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
      },
      body: formData
    })

    const result = await response.json()
    console.log('OCR API Response:', result)

    if (result.OCRExitCode !== 1 || result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage || 'OCR processing failed')
    }

    const text = result.ParsedResults[0]?.ParsedText
    if (!text) {
      throw new Error('No text detected in image')
    }

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('OCR API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message, fallback: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})