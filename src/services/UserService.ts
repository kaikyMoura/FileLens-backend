import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../model/CustomError';
import { ResponseModel } from '../model/ResponseModel';
import userRepository from "../repositories/UserRepository";
import { generateToken } from '../utils/token';

class UserService {

    private saltRounds = 10;

    async retriveUserById(userId: string): Promise<ResponseModel<Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>>> {
        if (!userId) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.")
        }

        const retrivedUser = await userRepository.findUnique(userId)

        if (!retrivedUser) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found")
        }

        return {
            data: {
                id: retrivedUser.id,
                user_name: retrivedUser.user_name,
                email: retrivedUser.email,
            }
        }
    }

    async retrieveUserByCredentials(user: Omit<User, 'id' | 'user_name' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<{ token: string, expiresIn: string }> {
        if (!user || !user.email || !user.user_password) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.")
        }

        const retrivedUser = await userRepository.findUniqueByEmail(user.email)

        if (!retrivedUser) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found")
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || retrivedUser.email != user.email || !await compare(user.user_password, retrivedUser.user_password)) {
            throw new CustomError("INVALID_CREDENTIALS", 401, "Please check your credentials before trying again.");
        }

        const data = await generateToken(retrivedUser.id);

        return {
            token: data.token,
            expiresIn: data.expiresIn
        }
    }

    async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<ResponseModel<Omit<User, 'id' | 'user_avatar_options' | 'user_avatar_url' | 'user_password' | 'createdAt' | 'updatedAt' | 'tasks'>>> {
        if (!user.user_name || !user.email) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.")

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new CustomError("INVALID_CREDENTIALS", 401, "Please check your credentials before trying again.");
        }

        if (await userRepository.findUniqueByEmail(user.email)) {
            throw new CustomError("USER_ALREADY_REGISTERED", 401, "Try logging in. If you don't remember your password, please use the 'Forgot password' option.")
        }

        await userRepository.create({
            id: uuidv4(),
            user_name: user.user_name,
            email: user.email,
            user_password: await hash(user.user_password, this.saltRounds)
        })

        return {
            message: "User created successfully",
            data: {
                user_name: user.user_name,
                email: user.email,
            }
        }
    }

    async deleteUser(id: string): Promise<ResponseModel<string>> {
        if (!await userRepository.findUnique(id)) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found")
        }

        await userRepository.remove(id)

        return {
            message: "User deleted with success."
        }
    }

    async updateUser(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        if (!await userRepository.findUnique(id)) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found")
        }

        const response = await userRepository.update(id, user)

        return {
            message: "Task updated with success.",
            data: response
        }
    }
}

export default new UserService();