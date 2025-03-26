export interface Error {
  message: string
}

export interface ValidationError {
  message: string
  field?: string
}
