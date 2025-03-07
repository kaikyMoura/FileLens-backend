jest.useRealTimers()

import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";

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

    test('Should return the data from api', async () => {

        // let image = '/public/task_list.jpg'

        // const response = await googleGenAiService.getApiResponse(image);

        // expect(response.message).toBe("Consulta realizada com sucesso")
    })
});