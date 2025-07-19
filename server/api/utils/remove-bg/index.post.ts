
import { readMultipartFormData } from 'h3'
import FormData from 'form-data'
import axios from 'axios'


export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const imageFile = form?.find(f => f.name === 'image')

  if (!imageFile || !imageFile.data) {
    throw createError({ statusCode: 400, statusMessage: 'image file is required' })
  }

  const config = useRuntimeConfig()
  
  const apiKey = String(
    config.apiKeyPalomosRemoveBg ||
    config.public?.apiKeyPalomosRemoveBg ||
    process.env.API_KEY_PALOMOS_REMOVE_BG
  )

  if (!apiKey || apiKey === 'undefined') {
    throw createError({ statusCode: 500, statusMessage: 'API Key for remove.bg is missing' })
  }

  // imageFile.data es un Buffer
  const buffer = imageFile.data

  if (!buffer.length) {
    throw createError({ statusCode: 400, statusMessage: 'The image buffer is empty' })
  }

  const formData = new FormData();

  formData.append('image_file', buffer, {
    filename: imageFile.filename || 'image.jpg',
    contentType: 'image/jpeg',
  });

  // Calculate Content-Length to avoid issues with remove.bg
  const headers = formData.getHeaders();
  try {
    const length = await new Promise<number>((resolve, reject) => {
      formData.getLength((err, len) => {
        if (err) reject(err); else resolve(len);
      });
    });
    headers['Content-Length'] = length;
  } catch (e) {
    console.warn('Could not calculate Content-Length:', e);
  }

  let resultBuffer: Buffer;

  try {
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': apiKey,
          ...headers
        },
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    resultBuffer = Buffer.from(response.data);

    setHeader(event, 'Content-Type', 'application/json');
    return { base64: resultBuffer.toString('base64') };

  } catch (error: any) {
    const errorText = error?.response?.data?.toString() || error?.message || 'Unknown error';
    throw createError({ statusCode: error?.response?.status || 500, statusMessage: errorText });
  }
})