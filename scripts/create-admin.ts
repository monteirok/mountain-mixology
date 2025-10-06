#!/usr/bin/env tsx

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from '../src/lib/db';
import { createAdminUser, findAdminByEmail } from '../src/lib/repository';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run create:admin -- <email> <password>');
    process.exit(1);
  }

  const existing = findAdminByEmail(email);
  if (existing) {
    console.log(`Admin account already exists for ${email}`);
    db.close();
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);
  const user = createAdminUser(email, hash);

  if (!user) {
    console.error('Failed to create admin user.');
    db.close();
    process.exit(1);
  }

  console.log(`Created admin account for ${email}`);
  db.close();
}

main().catch(error => {
  console.error('Error creating admin user:', error);
  db.close();
  process.exit(1);
});
