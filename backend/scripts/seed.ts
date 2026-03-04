import { AppDataSource } from '../src/database/data-source';
import { Neighborhood } from '../src/database/entities/neighborhood.entity';
import { AdCategory } from '../src/database/entities/ad-category.entity';
import { BusinessCategory } from '../src/database/entities/business-category.entity';
import { User } from '../src/database/entities/user.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // ===== NEIGHBORHOODS =====
    console.log('\n📍 Seeding neighborhoods...');
    const neighborhoodRepo = AppDataSource.getRepository(Neighborhood);
    const neighborhoods = [
      { name: 'Merkez', slug: 'merkez', type: 'neighborhood' as const },
      { name: 'Şehit Halis Şişman', slug: 'sehit-halis-sisman', type: 'neighborhood' as const },
      { name: 'Pazar', slug: 'pazar', type: 'neighborhood' as const },
      { name: 'Savrun', slug: 'savrun', type: 'neighborhood' as const },
      { name: 'Dervişpaşa', slug: 'dervis-pasa', type: 'neighborhood' as const },
    ];

    const existingNeighborhoods = await neighborhoodRepo.find();
    if (existingNeighborhoods.length === 0) {
      for (const neighborhood of neighborhoods) {
        const n = neighborhoodRepo.create(neighborhood);
        await neighborhoodRepo.save(n);
      }
      console.log(`✅ Created ${neighborhoods.length} neighborhoods`);
    } else {
      console.log(`⏭️  Neighborhoods already exist (${existingNeighborhoods.length} found)`);
    }

    // ===== AD CATEGORIES =====
    console.log('\n🛍️  Seeding ad categories...');
    const adCategoryRepo = AppDataSource.getRepository(AdCategory);
    const adCategories = [
      { name: 'Elektronik', slug: 'elektronik', display_order: 1 },
      { name: 'Ev & Bahçe', slug: 'ev-bahce', display_order: 2 },
      { name: 'Araçlar', slug: 'araclar', display_order: 3 },
      { name: 'Giyim', slug: 'giyim', display_order: 4 },
      { name: 'Spor', slug: 'spor', display_order: 5 },
      { name: 'Kitap', slug: 'kitap', display_order: 6 },
      { name: 'Eğitim', slug: 'egitim', display_order: 7 },
      { name: 'İş', slug: 'is', display_order: 8 },
      { name: 'Gıda', slug: 'gida', display_order: 9 },
      { name: 'Oyuncaklar', slug: 'oyuncaklar', display_order: 10 },
    ];

    const existingAdCategories = await adCategoryRepo.find();
    if (existingAdCategories.length === 0) {
      for (const category of adCategories) {
        const cat = adCategoryRepo.create(category);
        await adCategoryRepo.save(cat);
      }
      console.log(`✅ Created ${adCategories.length} ad categories`);
    } else {
      console.log(`⏭️  Ad categories already exist (${existingAdCategories.length} found)`);
    }

    // ===== BUSINESS CATEGORIES =====
    console.log('\n🏢 Seeding business categories...');
    const businessCategoryRepo = AppDataSource.getRepository(BusinessCategory);
    const businessCategories = [
      { name: 'Restoran', slug: 'restoran' },
      { name: 'Kafe', slug: 'kafe' },
      { name: 'Market', slug: 'market' },
      { name: 'Eczane', slug: 'eczane' },
      { name: 'Kuaför', slug: 'kuaför' },
      { name: 'Tamirhane', slug: 'tamirhane' },
      { name: 'Giyim', slug: 'giyim-isletme' },
      { name: 'Kırtasiye', slug: 'kirtasiye' },
      { name: 'İnşaat', slug: 'insaat' },
      { name: 'Hırdavat', slug: 'hirdavat' },
      { name: 'Kasap', slug: 'kasap' },
      { name: 'Manav', slug: 'manav' },
      { name: 'Pastane', slug: 'pastane' },
    ];

    const existingBusinessCategories = await businessCategoryRepo.find();
    if (existingBusinessCategories.length === 0) {
      for (const category of businessCategories) {
        const cat = businessCategoryRepo.create(category);
        await businessCategoryRepo.save(cat);
      }
      console.log(`✅ Created ${businessCategories.length} business categories`);
    } else {
      console.log(`⏭️  Business categories already exist (${existingBusinessCategories.length} found)`);
    }

    // ===== ADMIN USER =====
    console.log('\n👤 Seeding admin user...');
    const userRepo = AppDataSource.getRepository(User);
    const existingAdmin = await userRepo.findOne({ where: { phone: '+905500000001' } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const adminUser = userRepo.create({
        phone: '+905500000001',
        password: hashedPassword,
        username: 'admin',
        role: UserRole.SUPER_ADMIN,
        is_active: true,
      });
      await userRepo.save(adminUser);
      console.log('✅ Created admin user (+905500000001 / Admin123!)');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // ===== TEST USER =====
    console.log('\n👤 Seeding test user...');
    const existingTestUser = await userRepo.findOne({ where: { phone: '05551234567' } });

    if (!existingTestUser) {
      const firstNeighborhood = await neighborhoodRepo.findOne({ where: { slug: 'merkez' } });
      const hashedPassword = await bcrypt.hash('User123!', 10);
      const testUser = userRepo.create({
        phone: '05551234567',
        password: hashedPassword,
        username: 'testuser',
        role: UserRole.USER,
        is_active: true,
        primary_neighborhood_id: firstNeighborhood?.id,
      });
      await userRepo.save(testUser);
      console.log('✅ Created test user (05551234567 / User123!)');
    } else {
      console.log('⏭️  Test user already exists');
    }

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
