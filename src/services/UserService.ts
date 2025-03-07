import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ResponseModel } from '../model/ResponseModel';
import userRepository from "../repositories/UserRepository";
import generateToken from '../utils/token';

const saltRounds = 10;
class UserService {

    async retriveUserById(userId: string): Promise<ResponseModel<Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>>> {
        try {
            if (!userId) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            const retrivedUser = await userRepository.findUniqueByEmail(userId)

            if (!retrivedUser) {
                throw new Error("USER_NOT_FOUND")
            }

            return {
                data: {
                    id: retrivedUser.id,
                    user_name: retrivedUser.user_name,
                    email: retrivedUser.email,
                }
            }
        }
        catch (err) {
            console.error(err)
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async retrieveUserByCredentials(user: Omit<User, 'id' | 'user_name' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<String> {
        try {
            if (!user || !user.email || !user.user_password) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            const retrivedUser = await userRepository.findUniqueByEmail(user.email)

            if (!retrivedUser) {
                throw new Error("USER_NOT_FOUND")
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || retrivedUser.email != user.email || !await compare(user.user_password, retrivedUser.user_password)) {
                throw new Error("INVALID_CREDENTIALS");
            }

            const token = generateToken(retrivedUser.id);

            return token
        }
        catch (err) {
            console.error(err)
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>): Promise<ResponseModel<Omit<User, 'id' | 'user_avatar_options' | 'user_avatar_url' | 'user_password' | 'createdAt' | 'updatedAt' | 'tasks'>>> {

        try {

            if (!user.user_name || !user.email) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                throw new Error("INVALID_CREDENTIALS");
            }

            await userRepository.create({
                id: uuidv4(),
                user_name: user.user_name,
                email: user.email,
                user_password: await hash(user.user_password, saltRounds)
            })

            return {
                message: "User created successfully",
                data: {
                    user_name: user.user_name,
                    email: user.email,
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async deleteUser(id: string): Promise<ResponseModel<string>> {
        try {

            if (!await userRepository.findUnique(id)) {
                throw new Error("NOT_FOUND")
            }

            await userRepository.remove(id)

            return {
                message: "User deleted with success."
            }
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async updateUser(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        try {

            if (!await userRepository.findUnique(id)) {
                throw new Error("NOT_FOUND")
            }

            const response = await userRepository.update(id, user)

            return {
                message: "Task updated with success.",
                data: response
            }
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }
}

export default new UserService();