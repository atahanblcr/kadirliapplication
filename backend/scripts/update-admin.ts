import { AppDataSource } from '../src/database/data-source';
import { User } from '../src/database/entities/user.entity';

async function updateAdmin() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const admin = await repo.findOne({ where: { role: 'super_admin' as any } });
  if (admin) {
    admin.email = 'admin@kadirliapp.com';
    await repo.save(admin);
    console.log('Admin email updated to admin@kadirliapp.com');
  } else {
    console.log('No admin found');
  }
  process.exit(0);
}

updateAdmin();
