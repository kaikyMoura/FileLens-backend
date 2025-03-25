import { config } from "dotenv"
import request from "supertest"
import app from "../../app"
import path from "path"

jest.useRealTimers()

config({ path: '.env.test' })

// Integration tests for the File Controller
describe("File Controller", () => {
    test("should return 400 if no file is uploaded", async () => {
        const response = await request(app)
            .post("/api/v1/file/extract-data")
            .expect(400);

        expect(response.body.error).toBe({"details": "The requested file could not be found. Please verify the request and try again, or contact support for assistance.", "name": "CustomError", "statusCode": 404});
    });
    
    test("should return 200 and process the file", async () => {
        const response = await request(app)
            .post("/api/v1/file/extract-data")
            .attach("file", path.join(__dirname, "loginScreenshot.png"))
            .expect(200);

        expect(response.body.error).toHaveProperty("message", "Data extracted successfully.");
    });
});
