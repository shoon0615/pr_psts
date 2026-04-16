/** 환경변수를 자동완성 */
export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JSON_SERVER_API_URL: string
    }
  }
}