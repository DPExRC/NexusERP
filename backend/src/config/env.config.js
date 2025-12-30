import dotenv from 'dotenv';
dotenv.config();

export const envs = {
    USER : process.env.DB_USER,
    HOST : process.env.DB_HOST,
    NAME : process.env.DB_NAME,
    PASSWORD : process.env.DB_PASSWORD,
    PORT: process.env.PORT || 3000,

};