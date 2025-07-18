import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function removeBackground(imageUrl: string): Promise<string> {
  const response = await fetch('/api/utils/remove-bg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  })

  if (!response.ok) {
    throw new Error(await response.text() || 'No data returned from remove-bg API')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}