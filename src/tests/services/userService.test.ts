jest.useRealTimers()

import { PrismaClient, User } from "@prisma/client";

import { config } from "dotenv";
import userService from '../../services/UserService';

const prisma = new PrismaClient();

config({ path: '.env.test' })


describe('Testing user service operations', () => {
    beforeEach(async () => {
        try {
            await prisma.user.deleteMany();
        } catch (error) {
            console.error('Erro connecting to database: ' + error);
        }
    });

    afterAll(async () => {
        await prisma.$disconnect()
    })

    test('POST /user/create, should create a new user and return a json', async () => {
        const newUser = {
            user_name: "JoaoGrilo123",
            email: "testt@gmail.com",
            user_password: "123456",
            user_avatar_options: null
        }
        const response = await userService.createUser(newUser);

        expect(response.message).toBe("User created successfully")
        expect(response.data?.user_name).toBe(newUser.user_name);
        expect(response.data?.email).toBe(newUser.email);
    })
});