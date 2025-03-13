import { NextFunction, Request, Response } from "express";
import userService from "../services/UserService";
import { catchErrorResponse } from "../exception/CatchErrorResponse";

class UserController {

    async login(req: Request, res: Response) {
        const user = req.body;

        try {
            const result = await userService.retrieveUserByCredentials(user)
            return res.status(200).json({ token: result })
        }
        catch (err) {
            console.error(err)
            if (err === "REQUIRED_PROPERTIES_MISSING") {
                throw catchErrorResponse(res, 400, "REQUIRED_PROPERTIES_MISSING", "Missing required properties", "Some required properties are missing from the request.")
            }
            else {
                throw catchErrorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error",
                    "An error occurred while processing the operation. Please try again or contact support if the issue persists.")
            }
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        const user = req.body

        try {
            const result = await userService.createUser(user)
            return res.status(200).json(result)
        }
        catch (err) {
            next(err)
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await userService.deleteUser(id)
            return res.status(200).json(result)
        }
        catch (err) {
            console.error(err)
            if (err instanceof Error) {
                throw catchErrorResponse(res, 404, "NOT_FOUND", "Not found", "User not found")
            }
            else {
                throw catchErrorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error",
                    "An error occurred while processing the operation. Please try again or contact support if the issue persists.")
            }
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params
        const user = req.body
        try {
            const result = await userService.updateUser(id, user)
            return res.status(200).json(result)
        }
        catch (err) {
            if (err === "NOT_FOUND") {
                throw catchErrorResponse(res, 404, "NOT_FOUND", "No task found", "No tasks created by this user")
            }
            else {
                throw catchErrorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error",
                    "An error occurred while processing the operation. Please try again or contact support if the issue persists.")
            }
        }
    }

}

export default new UserController()