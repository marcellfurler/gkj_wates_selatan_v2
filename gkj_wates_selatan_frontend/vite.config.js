import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    allowedHosts: ['jimm.labjaringanukdw.my.id'],
    host: true, // Or '0.0.0.0'
    port: 3000, // Optional: change the default port if needed
  },
})
