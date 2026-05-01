import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Default build output is `dist/` — Apache vhost serves that folder directly.
export default defineConfig({
  plugins: [react()],
})
