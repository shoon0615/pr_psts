import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * @param testDir 테스트 파일이 있는 디렉토리
 * @param fullyParallel 모든 테스트를 병렬로 실행
 * @param forbidOnly CI 환경에서만 테스트를 실행
 * @param retries CI 환경에서 실패한 테스트를 최대 2번까지 재시도
 * @param workers CI 환경에서 1개의 프로세스로 실행
 * @param reporter 테스트 결과를 HTML 파일로 저장
 * @param use 모든 테스트에 공통으로 적용되는 설정
 * @param projects 테스트 실행 시 사용할 브라우저 설정
 * @param webServer 테스트 실행 시 사용할 웹 서버 설정
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  /**
   * 모든 테스트에 공통으로 적용되는 설정
   * @param baseURL 테스트 실행 시 사용할 기본 URL → default: 'http://localhost:3000'
   * @param trace 첫 번째 재시도에서만 트레이스를 수집
   * @param video 첫 번째 재시도에서만 비디오를 수집
   */
  use: {
    // baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  /**
   * 테스트 실행 시 사용할 웹 서버 설정
   * @param command 웹 서버 실행 명령어 → default: 'npm run start'
   * @param url 웹 서버 실행 시 사용할 URL → default: 'http://localhost:3000'
   * @param reuseExistingServer CI 환경에서는 기존 서버를 재사용
   * @param timeout 웹 서버 실행 시간 제한
   */
  webServer: {
    command: 'npm run dev',
    // url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
