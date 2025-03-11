import { Document, Packer, Paragraph, TextRun } from "docx";
import { writeFileSync } from "fs";

export async function generateDocx(text: string): Promise<Buffer> {
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