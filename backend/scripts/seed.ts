import { AppDataSource } from '../src/database/data-source';
import { Neighborhood } from '../src/database/entities/neighborhood.entity';
import { AdCategory } from '../src/database/entities/ad-category.entity';
import { BusinessCategory } from '../src/database/entities/business-category.entity';
import { User } from '../src/database/entities/user.entity';
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
      { name: 'Merkez', slug: 'merkez', type: 'urban', population: 15000, is_active: true },
      { name: 'Akdam', slug: 'akdam', type: 'urban', population: 8000, is_active: true },
      { name: 'Kayadibi', slug: 'kayadibi', type: 'urban', population: 5000, is_active: true },
      { name: 'Yavalı', slug: 'yavalı', type: 'suburban', population: 3000, is_active: true },
      { name: 'Cumhuriyet', slug: 'cumhuriyet', type: 'rural', population: 1500, is_active: true },
    ];

    const neighborhoodRepo = AppDataSource.getRepository(Neighborhood);
    const existingNeighborhoods = await neighborhoodRepo.find();

    if (existingNeighborhoods.length === 0) {
      for (const neighborhood of neighborhoods) {
        const n = neighborhoodRepo.create({
          id: uuidv4(),
          ...neighborhood,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await neighborhoodRepo.save(n);
      }
      console.log(`✅ Created ${neighborhoods.length} neighborhoods`);
    } else {
      console.log(`⏭️  Neighborhoods already exist (${existingNeighborhoods.length} found)`);
    }

    // ===== AD CATEGORIES =====
    console.log('\n🛍️  Seeding ad categories...');
    const adCategories = [
      { name: 'Elektronik', slug: 'elektronik', display_order: 1, parent_id: null },
      { name: 'Telefonlar', slug: 'telefonlar', display_order: 1, parent_id: null }, // Will be set as child after
      { name: 'Ev & Bahçe', slug: 'ev-bahce', display_order: 2, parent_id: null },
      { name: 'Araçlar', slug: 'araclar', display_order: 3, parent_id: null },
      { name: 'Mobil Telefonlar', slug: 'mobil-telefonlar', display_order: 1, parent_id: null },
      { name: 'Giyim', slug: 'giyim', display_order: 4, parent_id: null },
      { name: 'Spor', slug: 'spor', display_order: 5, parent_id: null },
      { name: 'Kitap', slug: 'kitap', display_order: 6, parent_id: null },
      { name: 'Eğitim', slug: 'egitim', display_order: 7, parent_id: null },
      { name: 'İş', slug: 'is', display_order: 8, parent_id: null },
    ];

    const adCategoryRepo = AppDataSource.getRepository(AdCategory);
    const existingAdCategories = await adCategoryRepo.find();

    if (existingAdCategories.length === 0) {
      for (const category of adCategories) {
        const cat = adCategoryRepo.create({
          id: uuidv4(),
          ...category,
          created_at: new Date(),
          updated_at: new Date(),
        });
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
      { name: 'Eğitim', slug: 'egitim', display_order: 10 },
      { name: 'Hukuk', slug: 'hukuk', display_order: 11 },
      { name: 'Tarım', slug: 'tarim', display_order: 12 },
      { name: 'Mobilya', slug: 'mobilya', display_order: 13 },
      { name: 'Diğer', slug: 'diger', display_order: 14 },
    ];

    const businessCategoryRepo = AppDataSource.getRepository(BusinessCategory);
    const existingBusinessCategories = await businessCategoryRepo.find();

    if (existingBusinessCategories.length === 0) {
      for (const category of businessCategories) {
        const cat = businessCategoryRepo.create({
          id: uuidv4(),
          ...category,
          created_at: new Date(),
          updated_at: new Date(),
        });
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
        id: uuidv4(),
        email: 'admin@kadirliapp.com',
        password: hashedPassword,
        username: 'admin',
        role: 'SUPER_ADMIN',
        is_active: true,
        is_verified: true,
        primary_neighborhood_id: null, // Will be updated after neighborhoods are seeded
        created_at: new Date(),
        updated_at: new Date(),
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
        id: uuidv4(),
        email: 'user@kadirliapp.com',
        password: hashedPassword,
        username: 'testuser',
        role: 'USER',
        is_active: true,
        is_verified: true,
        primary_neighborhood_id: firstNeighborhood?.id || null,
        phone: '+905551234567',
        age: 30,
        location_type: 'house',
        created_at: new Date(),
        updated_at: new Date(),
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
    console.log('   - 14 business categories');
    console.log('   - 1 admin user (admin@kadirliapp.com)');
    console.log('   - 1 test user (user@kadirliapp.com)');

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
