import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from 'zod'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Función para extraer el video ID de una URL de YouTube
function extractVideoId(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl)
    
    // Para URLs como https://www.youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      return url.searchParams.get('v')
    }
    
    // Para URLs como https://youtu.be/VIDEO_ID
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1) // Remover el slash inicial
    }
    
    // Para URLs con formato de embed
    if (url.pathname.includes('/embed/')) {
      const parts = url.pathname.split('/')
      return parts[parts.length - 1]
    }
    
    return null
  } catch (error) {
    return null
  }
}

// Función para leer el token desde archivo o variable de entorno
function getApiToken(): string {
  // Primero intentar desde variable de entorno
  const envToken = process.env.SUPADATA_API_KEY
  if (envToken) {
    return envToken.trim()
  }
  
  // Luego intentar desde archivo token_api.txt
  try {
    const tokenPath = join(process.cwd(), 'token_api.txt')
    const token = readFileSync(tokenPath, 'utf-8').trim()
    return token
  } catch (error) {
    throw new Error(
      'No se pudo encontrar el token de API. ' +
      'Asegúrate de tener el archivo token_api.txt en el directorio raíz ' +
      'o definir la variable de entorno SUPADATA_API_KEY.'
    )
  }
}

// Crear el servidor MCP
const server = new McpServer({
  name: 'youtube-transcript',
  version: '1.0.0',
})

// Registrar el tool get_transcript
server.registerTool(
  'get_transcript',
  {
    description: 'Get transcript from a YouTube video and save to a .txt file. Returns filename for use in subsequent operations.',
    inputSchema: {
      youtube_url: z.string().describe('YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)'),
      filename: z.string().optional().describe('Optional custom filename (without extension). If not provided, uses video ID as filename.'),
    }
  },
  async ({ youtube_url, filename }) => {
    try {
      const videoId = extractVideoId(youtube_url)
      if (!videoId) {
        return {
          content: [{
            type: 'text',
            text: `Error: No se pudo extraer el video ID de la URL: ${youtube_url}`
          }]
        }
      }
      
      const apiToken = getApiToken()
      const apiUrl = `https://api.supadata.ai/v1/transcript?url=https://www.youtube.com/watch?v=${videoId}&lang=en&text=true&mode=auto`
      
      console.error(`Fetching transcript for video ID: ${videoId}`)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiToken,
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        return {
          content: [{
            type: 'text',
            text: `Error de API (${response.status}): ${errorText}`
          }]
        }
      }
      
      const data = await response.json() as any
      
      if (!data.content) {
        return {
          content: [{
            type: 'text',
            text: `Error: La API no devolvió contenido. Respuesta: ${JSON.stringify(data)}`
          }]
        }
      }
      
      // Determine filename: use provided one or fall back to video ID
      const baseFilename = filename || videoId
      const txtFilename = baseFilename.endsWith('.txt') ? baseFilename : `${baseFilename}.txt`
      
      // Save transcript to file
      try {
        writeFileSync(txtFilename, data.content, 'utf-8')
        console.error(`Transcript saved to: ${txtFilename}`)
        
        // Return both the content and the filename for orchestrator use
        return {
          content: [{
            type: 'text',
            text: data.content
          }],
          _meta: {
            filename: txtFilename,
            videoId: videoId
          }
        }
      } catch (fileError) {
        console.error('Error saving transcript to file:', fileError)
        return {
          content: [{
            type: 'text',
            text: `Error saving transcript to file: ${fileError instanceof Error ? fileError.message : 'Error desconocido'}\n\nTranscript content:\n${data.content}`
          }]
        }
      }
      
    } catch (error) {
      console.error('Error fetching transcript:', error)
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
        }]
      }
    }
  }
)

// Registrar el tool get_transcript_and_save
server.registerTool(
  'get_transcript_and_save',
  {
    description: 'Get transcript from a YouTube video and save it to the specified filepath',
    inputSchema: {
      youtube_url: z.string().describe('YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)'),
      filepath: z.string().describe('Full filepath including filename and .txt extension (e.g., "C:/Users/User/Documents/TEO/test/my_transcript.txt")'),
    }
  },
  async ({ youtube_url, filepath }) => {
    try {
      // Extraer video ID
      const videoId = extractVideoId(youtube_url)
      if (!videoId) {
        return {
          content: [{
            type: 'text',
            text: `Error: No se pudo extraer el video ID de la URL: ${youtube_url}`
          }]
        }
      }
      
      // Obtener token de API
      const apiToken = getApiToken()
      
      // Construir URL de la API de Supadata
      const apiUrl = `https://api.supadata.ai/v1/transcript?url=https://www.youtube.com/watch?v=${videoId}&lang=en&text=true&mode=auto`
      
      console.error(`Fetching transcript for video ID: ${videoId}`)
      
      // Hacer la solicitud a la API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiToken,
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        return {
          content: [{
            type: 'text',
            text: `Error de API (${response.status}): ${errorText}`
          }]
        }
      }
      
      const data = await response.json() as any
      
      // Verificar que la respuesta tenga el formato esperado
      if (!data.content) {
        return {
          content: [{
            type: 'text',
            text: `Error: La API no devolvió contenido. Respuesta: ${JSON.stringify(data)}`
          }]
        }
      }
      
      try {
        // Asegurar que el directorio padre existe
        const parentDir = join(filepath, '..')
        if (!existsSync(parentDir)) {
          mkdirSync(parentDir, { recursive: true })
          console.error(`Created directory: ${parentDir}`)
        }
        
        // Guardar el transcript en el archivo
        writeFileSync(filepath, data.content, 'utf-8')
        console.error(`Transcript saved to: ${filepath}`)
        
        return {
          content: [{
            type: 'text',
            text: `Transcript saved to ${filepath}`
          }]
        }
      } catch (fileError) {
        console.error('Error saving transcript to file:', fileError)
        return {
          content: [{
            type: 'text',
            text: `Error saving transcript to file: ${fileError instanceof Error ? fileError.message : 'Error desconocido'}`
          }]
        }
      }
      
    } catch (error) {
      console.error('Error fetching transcript:', error)
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
        }]
      }
    }
  }
)

// Iniciar el servidor con transporte stdio
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('YouTube Transcript MCP Server running on stdio')
  console.error(`Token cargado: ${getApiToken().substring(0, 10)}...`)
}

// Manejar cierre limpio
process.on('SIGINT', () => {
  console.error('\nShutting down MCP server...')
  process.exit(0)
})

// Iniciar el servidor
main().catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
})