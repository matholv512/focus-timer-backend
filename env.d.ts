declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    URI: string
    URI_TEST: string
    JWT_SECRET: string
    NODE_ENV: 'production' | 'development' | 'test'
  }
}
