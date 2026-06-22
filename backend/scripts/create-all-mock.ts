import { AppDataSource } from '../src/database/data-source';
import { Event } from '../src/database/entities/event.entity';
import { Place } from '../src/database/entities/place.entity';
import { TaxiDriver } from '../src/database/entities/taxi-driver.entity';
import { Announcement } from '../src/database/entities/announcement.entity';
import { AnnouncementType } from '../src/database/entities/announcement-type.entity';
import { User } from '../src/database/entities/user.entity';

async function seedMocks() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const userRepo = AppDataSource.getRepository(User);
    const admin = await userRepo.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.log('No admin found, aborting');
      process.exit(1);
    }
    const adminId = admin.id;

    // Seed Announcement
    const annTypeRepo = AppDataSource.getRepository(AnnouncementType);
    let type: any = await annTypeRepo.findOne({ where: { slug: 'genel' } });
    if (!type) {
      type = annTypeRepo.create({ name: 'Genel', slug: 'genel' } as any);
      await annTypeRepo.save(type);
    }
    const annRepo = AppDataSource.getRepository(Announcement);
    if ((await annRepo.count()) === 0) {
      const ann = annRepo.create({
        title: 'Su Kesintisi',
        body: 'Merkez mahallesinde 14:00 - 18:00 arası su kesintisi olacaktır.',
        type_id: type.id,
        is_active: true,
        created_by: adminId,
      } as any);
      await annRepo.save(ann);
      console.log('✅ Created mock announcement');
    }

    // Seed Event
    const eventRepo = AppDataSource.getRepository(Event);
    if ((await eventRepo.count()) === 0) {
      const ev = eventRepo.create({
        title: 'Kadirli Yaz Festivali',
        description: 'Bu yaz Kadirli konserlerle coşuyor.',
        venue_name: 'Şehir Stadyumu',
        event_date: '2026-07-15',
        event_time: '19:00',
        created_by: adminId,
        status: 'published',
      } as any);
      await eventRepo.save(ev);
      console.log('✅ Created mock event');
    }

    // Seed Place
    const placeRepo = AppDataSource.getRepository(Place);
    if ((await placeRepo.count()) === 0) {
      const pl = placeRepo.create({
        name: 'Tarihi Karatepe Aslantaş Açık Hava Müzesi',
        description: 'Türkiye\'nin ilk açık hava müzesi.',
        address: 'Kızyusuflu Köyü',
        latitude: 37.28,
        longitude: 36.24,
        is_active: true,
        created_by: adminId,
      } as any);
      await placeRepo.save(pl);
      console.log('✅ Created mock place');
    }

    // Seed TaxiDriver
    const taxiRepo = AppDataSource.getRepository(TaxiDriver);
    if ((await taxiRepo.count()) === 0) {
      const td = taxiRepo.create({
        name: 'Ahmet Şoför',
        phone: '+905559998877',
        station_name: 'Merkez Taksi',
        plaka: '80 T 0001',
        is_active: true,
        is_verified: true,
        user_id: adminId,
      } as any);
      await taxiRepo.save(td);
      console.log('✅ Created mock taxi driver');
    }

    console.log('✨ Mock data population complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding mocks:', err);
    process.exit(1);
  }
}

seedMocks();
