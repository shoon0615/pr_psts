import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // baseUrl: 'http://localhost:5173',  // Vite
    baseUrl: 'http://localhost:3000', // Next.js
    viewportWidth: 1280,
    viewportHeight: 720,
    // video: true,   // Headless 모드로 테스트 실행 시, 비디오 녹화를 자동으로 진행 → npm run cy:run
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
