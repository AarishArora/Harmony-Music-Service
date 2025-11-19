import ImageKit from 'imagekit';
import config from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';

const imagekit = new ImageKit({
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY
});

export async function uploadFile(file) {
    const fileName = `${uuidv4()}-${file.originalname}`;

    try {
        const response = await imagekit.upload({
            file: file.buffer,
            fileName: fileName,
            folder: "/music"
        });

        // Save this URL in DB (not fileId)
        return response.url;

    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw error;
    }
}
