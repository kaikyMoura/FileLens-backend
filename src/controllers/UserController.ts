import { Request, Response } from "express";
import userService from "../services/UserService";
import { renewToken } from "../utils/token";

class UserController {

    async login(req: Request, res: Response) {
        const user = req.body;

        const result = await userService.generateTokenByUserCrendential(user)

        return res.status(200).json(result.data)
    }

    async createUser(req: Request, res: Response) {
        const user = req.body

        const result = await userService.createUser(user)
        return res.status(200).json(result)
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params

        const result = await userService.deleteUser(id)
        return res.status(200).json(result)
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params
        const user = req.body

        const result = await userService.updateUser(id, user)

        return res.status(200).json(result)
    }

    async renewToken(req: Request, res: Response) {
        const { email } = req.body
        const { token } = req.headers

        const userId = (await userService.retriveUserByEmail(email)).data?.id

        const result = await renewToken(userId!, token?.toString()!)

        return res.status(200).json(result)
    }

}

export default new UserController()