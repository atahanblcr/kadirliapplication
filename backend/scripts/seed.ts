import { AppDataSource } from '../src/database/data-source';
import { Neighborhood } from '../src/database/entities/neighborhood.entity';
import { AdCategory } from '../src/database/entities/ad-category.entity';
import { BusinessCategory } from '../src/database/entities/business-category.entity';
import { User } from '../src/database/entities/user.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log('🌱 Starting database seeding...');

    // ===== NEIGHBORHOODS =====
    console.log('\n📍 Seeding neighborhoods...');
    const neighborhoods = [
      { name: 'Merkez', slug: 'merkez', type: 'neighborhood' as const, population: 15000, is_active: true },
      { name: 'Akdam', slug: 'akdam', type: 'neighborhood' as const, population: 8000, is_active: true },
      { name: 'Kayadibi', slug: 'kayadibi', type: 'neighborhood' as const, population: 5000, is_active: true },
      { name: 'Yavalı', slug: 'yavalı', type: 'village' as const, population: 3000, is_active: true },
      { name: 'Cumhuriyet', slug: 'cumhuriyet', type: 'village' as const, population: 1500, is_active: true },
    ];

    const neighborhoodRepo = AppDataSource.getRepository(Neighborhood);
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
    const adCategories = [
      { name: 'Elektronik', slug: 'elektronik', display_order: 1, parent_id: undefined },
      { name: 'Ev & Bahçe', slug: 'ev-bahce', display_order: 2, parent_id: undefined },
      { name: 'Araçlar', slug: 'araclar', display_order: 3, parent_id: undefined },
      { name: 'Giyim', slug: 'giyim', display_order: 4, parent_id: undefined },
      { name: 'Spor', slug: 'spor', display_order: 5, parent_id: undefined },
      { name: 'Kitap', slug: 'kitap', display_order: 6, parent_id: undefined },
      { name: 'Eğitim', slug: 'egitim', display_order: 7, parent_id: undefined },
      { name: 'İş', slug: 'is', display_order: 8, parent_id: undefined },
      { name: 'Gıda', slug: 'gida', display_order: 9, parent_id: undefined },
      { name: 'Oyuncaklar', slug: 'oyuncaklar', display_order: 10, parent_id: undefined },
    ];

    const adCategoryRepo = AppDataSource.getRepository(AdCategory);
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
    const businessCategories = [
      { name: 'Gıda', slug: 'gida', display_order: 1 },
      { name: 'Restoran', slug: 'restoran', display_order: 2 },
      { name: 'Eczane', slug: 'eczane', display_order: 3 },
      { name: 'Sağlık', slug: 'saglik', display_order: 4 },
      { name: 'Tekstil', slug: 'tekstil', display_order: 5 },
      { name: 'Elektrik', slug: 'elektrik', display_order: 6 },
      { name: 'Yapı', slug: 'yapi', display_order: 7 },
      { name: 'Oto', slug: 'oto', display_order: 8 },
      { name: 'Güzellik', slug: 'guzellik', display_order: 9 },
      { name: 'Hukuk', slug: 'hukuk', display_order: 10 },
      { name: 'Tarım', slug: 'tarim', display_order: 11 },
      { name: 'Mobilya', slug: 'mobilya', display_order: 12 },
      { name: 'Diğer', slug: 'diger', display_order: 13 },
    ];

    const businessCategoryRepo = AppDataSource.getRepository(BusinessCategory);
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
    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@kadirliapp.com' } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const adminUser = userRepo.create({
        phone: '+905500000001',
        email: 'admin@kadirliapp.com',
        password: hashedPassword,
        username: 'admin',
        role: UserRole.SUPER_ADMIN,
        is_active: true,
      });
      await userRepo.save(adminUser);
      console.log('✅ Created admin user (admin@kadirliapp.com / Admin123!)');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // ===== TEST USER =====
    console.log('\n👤 Seeding test user...');
    const existingTestUser = await userRepo.findOne({ where: { email: 'user@kadirliapp.com' } });

    if (!existingTestUser) {
      // Get first neighborhood for test user
      const firstNeighborhood = await neighborhoodRepo.findOne({ where: { slug: 'merkez' } });

      const hashedPassword = await bcrypt.hash('User123!', 10);
      const testUser = userRepo.create({
        phone: '+905551234567',
        email: 'user@kadirliapp.com',
        password: hashedPassword,
        username: 'testuser',
        role: UserRole.USER,
        is_active: true,
        primary_neighborhood_id: firstNeighborhood?.id,
        age: 30,
        location_type: 'neighborhood' as const,
      });
      await userRepo.save(testUser);
      console.log('✅ Created test user (user@kadirliapp.com / User123!)');
    } else {
      console.log('⏭️  Test user already exists');
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Seed Data Summary:');
    console.log('   - 5 neighborhoods');
    console.log('   - 10 ad categories');
    console.log('   - 13 business categories');
    console.log('   - 1 admin user (admin@kadirliapp.com / Admin123!)');
    console.log('   - 1 test user (user@kadirliapp.com / User123!)');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run seeder
seed();
