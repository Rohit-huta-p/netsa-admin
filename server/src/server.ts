import dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './config/db';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 4000;

connectDb()
  .then(() => {
    createApp().listen(PORT, () => console.log(`admin api listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('failed to start', err);
    process.exit(1);
  });
