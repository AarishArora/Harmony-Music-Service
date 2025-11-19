import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    FRONTEND_URL : process.env.FRONTEND_URL,
    PORT: process.env.PORT,
}

export default Object.freeze(_config);