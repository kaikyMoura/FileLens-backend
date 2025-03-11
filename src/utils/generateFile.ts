import { Document, Packer, Paragraph, TextRun } from "docx";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function createDocxFromText(text: string): Promise<Buffer> {
    try {
        const paragraphs = text.split("\n").map(line =>
            new Paragraph({
                children: [new TextRun(line)],
            })
        );

        const doc = new Document({
            sections: [{ properties: {}, children: paragraphs }],
        });

        const buffer = await Packer.toBuffer(doc);
        return buffer
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

export async function createPdfFromText(text: string): Promise<Buffer> {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        const x = 50;
        const y = 350;

        page.drawText(text, {
            x,
            y,
            font: timesRomanFont,
            size: 12,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        return Buffer.from(pdfBytes.buffer)
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


export async function generateTxt(text: string, fileTitle?: string): Promise<Buffer> {

    const tempDir = path.join(__dirname, "temp");
    const outputDir = path.join(tempDir, "converted");

    const inputFilePath = path.join(tempDir, fileTitle!);
    const outputFileName = `${fileTitle}.txt`;

    try {

        // fs.writeFileSync(inputFilePath, File.buffer);
        const paragraphs = text.split("\n").map(line =>
            new Paragraph({
                children: [new TextRun(line)],
            })
        );

        const doc = new Document({
            sections: [{ properties: {}, children: paragraphs }],
        });

        const buffer = await Packer.toBuffer(doc);
        return buffer
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