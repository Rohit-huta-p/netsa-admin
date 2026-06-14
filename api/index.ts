import mongoose from 'mongoose';
import { createApp } from '../server/src/app';
import { connectDb } from '../server/src/config/db';

const app = createApp();

export default async function handler(req: any, res: any) {
  if (mongoose.connection.readyState === 0) {
    await connectDb();
  }
  return app(req, res);
}
