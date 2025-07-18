import { readBody } from 'h3'
import FormData from 'form-data'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const imageUrl = body?.imageUrl
  if (!imageUrl) {
    throw createError({ statusCode: 400, statusMessage: 'imageUrl is required' })
  }
  const config = useRuntimeConfig()
  const apiKey = config.apiKeyPalomosRemoveBg

  // Descarga la imagen
  const imageRes = await fetch(imageUrl)
  if (!imageRes.ok) throw createError({ statusCode: 400, statusMessage: 'No se pudo descargar la imagen' })
  const arrayBuffer = await imageRes.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (!buffer.length) {
    console.error('Buffer vacío al descargar la imagen desde:', imageUrl)
    throw createError({ statusCode: 400, statusMessage: 'La imagen descargada está vacía' })
  }
  console.log('Buffer size:', buffer.length, 'bytes para', imageUrl)

  // Prepara el formData para remove.bg
  const formData = new FormData()

  formData.append('image_file', buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
  })

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey, ...formData.getHeaders() },
    body: formData as any,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('remove.bg error:', errorText)
    throw createError({ statusCode: response.status, statusMessage: errorText })
  }

  const arrayBufferResult = await response.arrayBuffer()
  const resultBuffer = Buffer.from(arrayBufferResult)
  setHeader(event, 'Content-Type', 'image/png')
  return resultBuffer
})