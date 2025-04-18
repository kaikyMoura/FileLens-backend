
export default class FileLensUpload {
    userId: string;
    buffer: Buffer;
    mimetype: string;
    originalFileName: string;

    constructor(userId: string | undefined, buffer: Buffer, mimetype: string, originalFileName: string) {
        this.userId = userId!;
        this.buffer = buffer;
        this.mimetype = mimetype;
        this.originalFileName = originalFileName;
    }

    generateUniqueFileName(): string {
        return `user-${this.userId}/${this.originalFileName}`;
    }
}