import { Prisma, PrismaClient, User } from '@prisma/client';


const prisma = new PrismaClient();

class UserRepository {
    async create(data: Omit<User, 'createdAt' | 'updatedAt' | 'tasks'>): Promise<User> {
        try {
            const response = await prisma.user.create({
                data: {
                    id: data.id,
                    user_name: data.user_name,
                    email: data.email,
                    user_password: data.user_password
                }
            })
            return response
        } catch (err) {
            if (err instanceof Error) {
                throw new Error("Error: " + err.message)
            }
            else {
                throw new Error("Failed to create user")
            }
        }
    }

    async findUnique(id: string): Promise<User> {
        try {
            const data = await prisma.user.findUnique({
                where: { id: id, }
            });
            return data!;
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve user")
        }
    }

    async findUniqueByEmail(email: string): Promise<User> {
        try {
            const data = await prisma.user.findUnique({
                where: { email: email, }
            });
            return data!;
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve user")
        }
    }

    async findMany(): Promise<User[]> {
        try {
            return await prisma.user.findMany();
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve user")
        }
    }

    async update(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            await prisma.user.update({
                where: { id: id },
                data: user && {
                    updatedAt: new Date()
                }
            });
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to update user data")
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id: id },
            });
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to update user data")
        }
    }
}

export default new UserRepository()