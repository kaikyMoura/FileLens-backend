import { Router } from "express";
import userController from "../controllers/UserController";
import authenticateToken from "../middlewares/aunthenticationMiddlware";

const userRoutes = Router()

userRoutes.post('/user/create', (req, res, next) => {
    userController.createUser(req, res, next)
});
userRoutes.post('/user/login', (req, res) => { userController.login(req, res) });
userRoutes.delete('/user/delete/:user_id', authenticateToken, (req, res) => {
    userController.deleteUser(req, res)
});
userRoutes.put('/user/update/:user_id', authenticateToken, (req, res) => {
    userController.updateUser(req, res)
});

export default userRoutes;