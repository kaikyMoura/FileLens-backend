export type ResponseModel<T> = {
    message?: string
    data?: T
    token?: string
}