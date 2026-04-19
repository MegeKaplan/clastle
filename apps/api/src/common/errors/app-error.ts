export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public details: any = null
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}