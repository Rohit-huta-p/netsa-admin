import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { AdminUser, hashPassword } from '../models/AdminUser';

async function run() {
  await connectDb();
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || 'Owner';
  if (!email || !password) {
    console.error('Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env');
    process.exit(1);
  }
  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', email);
  } else {
    await AdminUser.create({ email: email.toLowerCase(), name, role: 'owner', passwordHash: await hashPassword(password) });
    console.log('Created owner admin:', email);
  }
  await mongoose.disconnect();
  process.exit(0);
}
run();
