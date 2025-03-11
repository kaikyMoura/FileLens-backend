import fs from "fs";
import path from "path";
import FileLensUpload from "../model/FileLensUpload";
import ConvertAPI from "convertapi";

type FileType = "pdf" | "pptx" | "png" | "jpg" | "svg" | "xlsx" | "csv" | "html" | "docx";

const convertapi = new ConvertAPI(process.env.CONVERT_API_KEY!, { conversionTimeout: 60 });

export const convertTo = async (to: FileType, file: FileLensUpload): Promise<{
    buffer: Buffer;
    fileName: string;
    mimeType: string;
}> => {
    const tempDir = path.join(__dirname, "temp");
    const outputDir = path.join(tempDir, "converted");
    
    const inputFilePath = path.join(tempDir, file.originalFileName);
    const outputFileName = file.originalFileName.replace(path.extname(file.originalFileName), `.${to}`);
    const outputFilePath = path.join(outputDir, outputFileName);

    [tempDir, outputDir].forEach((dir) => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true }));

    try {
        fs.writeFileSync(inputFilePath, file.buffer);

        const result = await convertapi.convert(to, { File: inputFilePath });

        await result.file.save(outputFilePath);

        const mimeType = ["png", "jpg", "jpeg", "svg"].includes(to)
        ? `image/${to}`
        : to === "pdf"
        ? "application/pdf"
        : to === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/octet-stream";

        return {
            buffer: fs.readFileSync(outputFilePath),
            fileName: outputFileName,
            mimeType: mimeType,
        };
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "INTERNAL_SERVER_ERROR");
    } finally {
        [inputFilePath, outputFilePath].forEach((filePath) => fs.existsSync(filePath) && fs.unlinkSync(filePath));
    }
};