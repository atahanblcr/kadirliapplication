import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function createInitialAdmin() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  const existing = await userRepository.findOne({
    where: { email: 'admin@kadirliapp.com' },
  });

  if (existing) {
    console.log('✅ Admin kullanıcısı zaten mevcut!');
    console.log('Email: admin@kadirliapp.com');
    await AppDataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = userRepository.create({
    phone: '05551234567',
    username: 'admin',
    email: 'admin@kadirliapp.com',
    password: hashedPassword,
    role: UserRole.SUPER_ADMIN,
    is_active: true,
    is_banned: false,
  });

  await userRepository.save(admin);

  console.log('✅ İlk admin kullanıcısı oluşturuldu!');
  console.log('Email   : admin@kadirliapp.com');
  console.log('Şifre   : Admin123!');
  console.log('Rol     : SUPER_ADMIN');

  await AppDataSource.destroy();
}

createInitialAdmin().catch((err) => {
  console.error('Seeder hatası:', err);
  process.exit(1);
});
