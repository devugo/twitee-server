import * as dotenv from 'dotenv';
// get config vars
dotenv.config();

// access config var
const {
  JWT_SECRET,
  SEND_GRID_KEY,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  STAGE,
  PORT,
  CLIENT_URL,
  JWT_EXPIRE_DURATION,
} = process.env;

export {
  JWT_SECRET,
  SEND_GRID_KEY,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  STAGE,
  PORT,
  CLIENT_URL,
  JWT_EXPIRE_DURATION,
};
