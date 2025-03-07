import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

class TaskRepository {

    async create(data: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task> {
        try {
            const response = await prisma.task.create({ data })
            return response
        } catch (error) {
            console.error(error)
            throw new Error("Failed to create task")
        }
    }

    async findUnique(id: string): Promise<Task> {
        try {
            const data = await prisma.task.findUnique({
                where: { id: id, }
            });
            return data!;
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve task")
        }
    }

    async findMany(): Promise<Task[]> {
        try {
            return await prisma.task.findMany();
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve task")
        }
    }

    async findAllUserTasks(userId: string): Promise<Task[]> {
        try {
            return await prisma.task.findMany({
                where: {
                    userId: userId
                }
            });
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to retrieve task")
        }
    }

    async update(id: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            await prisma.task.update({
                where: { id: id },
                data: task && {
                    updatedAt: new Date()
                }
            });
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to update task data")
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await prisma.task.delete({
                where: { id: id },
            });
        }
        catch (error) {
            console.error(error)
            throw new Error("Failed to update task data")
        }
    }
}

export default new TaskRepository()