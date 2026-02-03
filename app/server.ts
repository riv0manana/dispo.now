import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { app } from './http/http.ts'

console.log('🚀 Server starting on http://localhost:8000')

serve(app.fetch, { port: 8000 })
