import { AppDataSource } from '../src/database/data-source';
import { Ad } from '../src/database/entities/ad.entity';
import { AdCategory } from '../src/database/entities/ad-category.entity';
import { User } from '../src/database/entities/user.entity';
import { Neighborhood } from '../src/database/entities/neighborhood.entity';

async function createMockAds() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const categoryRepo = AppDataSource.getRepository(AdCategory);
    const adRepo = AppDataSource.getRepository(Ad);
    const neighborhoodRepo = AppDataSource.getRepository(Neighborhood);

    const testUser = await userRepo.findOne({ where: { phone: '05551234567' } });
    const categories = await categoryRepo.find();
    const neighborhood = await neighborhoodRepo.findOne({ where: { slug: 'merkez' } });

    if (!testUser || categories.length === 0) {
      console.log('❌ Test user or categories not found. Run seed first.');
      return;
    }

    console.log('🚀 Creating mock ads...');

    const adsData = [
      {
        title: 'Satılık iPhone 13 Pro',
        description: 'Tertemiz, kutulu faturalı. Hiç tamir görmedi.',
        price: 35000,
        category: categories.find(c => c.slug === 'elektronik'),
      },
      {
        title: '2015 Model Volkswagen Golf',
        description: 'Düşük kilometre, servis bakımlı. Değişensiz.',
        price: 850000,
        category: categories.find(c => c.slug === 'araclar'),
      },
      {
        title: 'Mimar Sinan Mahallesinde Kiralık Daire',
        description: '3+1, geniş balkonlu, merkezi konumda.',
        price: 12000,
        category: categories.find(c => c.slug === 'ev-bahce'),
      },
    ];

    for (const data of adsData) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const ad = adRepo.create({
        user_id: testUser.id,
        category_id: data.category?.id,
        title: data.title,
        description: data.description,
        price: data.price,
        status: 'approved',
        expires_at: expiresAt,
        contact_phone: '+905551234567',
        seller_name: 'Test Satıcı',
        view_count: Math.floor(Math.random() * 100),
      });

      await adRepo.save(ad);
      console.log(`✅ Created ad: ${data.title}`);
    }

    console.log('✨ All mock ads created!');

  } catch (error) {
    console.error('❌ Error creating mock ads:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

createMockAds();
