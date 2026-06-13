import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { seedTemplates } from '../models/Template';

async function run() {
  await connectDb();
  await seedTemplates();
  console.log('templates seeded');
  await mongoose.disconnect();
  process.exit(0);
}
run();
