import { CustomError } from "./CustomError"

export type ResponseModel<T> = {
    message?: string
    data?: T
    token?: string
    error?: CustomError
}