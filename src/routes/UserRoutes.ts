import { Router } from "express";
import userController from "../controllers/UserController";
import authenticateToken from "../middlewares/authenticateToken";

const userRoutes = Router()

userRoutes.post('/user/create', async (req, res) => {
    await userController.createUser(req, res);
});
userRoutes.post('/user/login', async (req, res) => {
    await userController.login(req, res);
});

userRoutes.delete('/user/delete/:user_id', authenticateToken, async (req, res) => {
    await userController.deleteUser(req, res);

});

userRoutes.put('/user/update/:user_id', authenticateToken, async (req, res) => {
    await userController.updateUser(req, res);
});

userRoutes.post('/user/renew-token', authenticateToken, async (req, res) => {
    await userController.renewToken(req, res);
})

export default userRoutes;