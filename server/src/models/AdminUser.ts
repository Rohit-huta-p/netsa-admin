import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'owner' | 'member';
  comparePassword(plain: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' },
  },
  { timestamps: true }
);

adminUserSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

export const AdminUser = model<IAdminUser>('AdminUser', adminUserSchema);

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}
