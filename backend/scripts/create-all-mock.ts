import { AppDataSource } from '../src/database/data-source';
import { Event } from '../src/database/entities/event.entity';
import { Place, PlaceCategory } from '../src/database/entities/place.entity';
import { TaxiDriver } from '../src/database/entities/taxi-driver.entity';
import { Announcement } from '../src/database/entities/announcement.entity';
import { AnnouncementType } from '../src/database/entities/announcement-type.entity';
import { Ad } from '../src/database/entities/ad.entity';
import { AdCategory } from '../src/database/entities/ad-category.entity';
import {
  Cemetery,
  Mosque,
  DeathNotice,
} from '../src/database/entities/death-notice.entity';
import { Business } from '../src/database/entities/business.entity';
import { BusinessCategory } from '../src/database/entities/business-category.entity';
import { Campaign } from '../src/database/entities/campaign.entity';
import {
  Pharmacy,
  PharmacySchedule,
} from '../src/database/entities/pharmacy.entity';
import { GuideCategory, GuideItem } from '../src/database/entities/guide.entity';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../src/database/entities/transport.entity';
import { User } from '../src/database/entities/user.entity';

/**
 * Kapsamlı sahte (mock) veri üreticisi.
 *
 * KRİTİK: Her kayıt, ilgili public endpoint'in görünürlük filtresini geçecek
 * şekilde oluşturulur — aksi halde admin panelde veri olsa bile mobil uygulama
 * "Veri Yok" gösterir. Filtreler (public servislerden doğrulandı):
 *   announcements/events → status = 'published'
 *   ads/deaths/campaigns → status = 'approved'
 *   taxi                 → is_verified = true AND is_active = true
 *   places/guide/transport/pharmacy → is_active = true
 *   campaigns            → ek olarak start_date <= bugün <= end_date
 *   pharmacy (bugünkü)   → duty_date = bugün
 *
 * Idempotent: her tablo yalnızca boşsa doldurulur (count === 0).
 */
async function seedMocks() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
    const todayStr = iso(today);
    const plusDays = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return iso(d);
    };

    const userRepo = AppDataSource.getRepository(User);
    const admin = await userRepo.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.log('❌ No admin found. Run `npm run seed` first.');
      process.exit(1);
    }
    const adminId = admin.id;

    // ── ANNOUNCEMENTS ─────────────────────────────────────────────────────
    const annTypeRepo = AppDataSource.getRepository(AnnouncementType);
    let annType = await annTypeRepo.findOne({ where: { slug: 'genel' } });
    annType ??= await annTypeRepo.save(
      annTypeRepo.create({ name: 'Genel', slug: 'genel' }),
    );
    const annRepo = AppDataSource.getRepository(Announcement);
    if ((await annRepo.count()) === 0) {
      await annRepo.save(
        annRepo.create([
          {
            title: 'Su Kesintisi',
            body: 'Merkez mahallesinde 14:00 - 18:00 arası su kesintisi olacaktır.',
            type_id: annType.id,
            priority: 'high',
            target_type: 'all',
            status: 'published', // ← public filtre
            sent_at: new Date(),
            created_by: adminId,
          },
          {
            title: 'Belediye Meclis Toplantısı',
            body: 'Bu ayki olağan meclis toplantısı Cuma günü saat 10:00’da yapılacaktır.',
            type_id: annType.id,
            priority: 'normal',
            target_type: 'all',
            status: 'published',
            sent_at: new Date(),
            created_by: adminId,
          },
        ] as any),
      );
      console.log('✅ Announcements (2)');
    }

    // ── EVENTS ────────────────────────────────────────────────────────────
    const eventRepo = AppDataSource.getRepository(Event);
    if ((await eventRepo.count()) === 0) {
      await eventRepo.save(
        eventRepo.create([
          {
            title: 'Kadirli Yaz Festivali',
            description: 'Bu yaz Kadirli konserlerle coşuyor.',
            venue_name: 'Şehir Stadyumu',
            venue_address: 'Merkez, Kadirli',
            city: 'Osmaniye',
            event_date: plusDays(15),
            event_time: '19:00',
            is_free: true,
            organizer: 'Kadirli Belediyesi',
            status: 'published',
            created_by: adminId,
          },
          {
            title: 'Kitap Fuarı',
            description: 'Yerel yazarlar ve yayınevleriyle kitap fuarı.',
            venue_name: 'Kültür Merkezi',
            city: 'Osmaniye',
            event_date: plusDays(30),
            event_time: '10:00',
            is_free: true,
            status: 'published',
            created_by: adminId,
          },
        ] as any),
      );
      console.log('✅ Events (2)');
    }

    // ── PLACES ────────────────────────────────────────────────────────────
    const placeCatRepo = AppDataSource.getRepository(PlaceCategory);
    let placeCat = await placeCatRepo.findOne({ where: { slug: 'tarihi' } });
    placeCat ??= await placeCatRepo.save(
      placeCatRepo.create({
        name: 'Tarihi Yerler',
        slug: 'tarihi',
        is_active: true,
      }),
    );
    const placeRepo = AppDataSource.getRepository(Place);
    if ((await placeRepo.count()) === 0) {
      await placeRepo.save(
        placeRepo.create([
          {
            category_id: placeCat.id,
            name: 'Tarihi Karatepe Aslantaş Açık Hava Müzesi',
            description: "Türkiye'nin ilk açık hava müzesi.",
            address: 'Kızyusuflu Köyü, Kadirli',
            latitude: 37.28,
            longitude: 36.24,
            is_free: false,
            entrance_fee: 50,
            is_active: true,
            created_by: adminId,
          },
          {
            category_id: placeCat.id,
            name: 'Ala Camii (Halil Bey Camii)',
            description: 'Tarihi taş işçiliğiyle ünlü cami.',
            address: 'Merkez, Kadirli',
            latitude: 37.374,
            longitude: 36.097,
            is_free: true,
            is_active: true,
            created_by: adminId,
          },
        ] as any),
      );
      console.log('✅ Places (2)');
    }

    // ── TAXI DRIVERS ──────────────────────────────────────────────────────
    const taxiRepo = AppDataSource.getRepository(TaxiDriver);
    if ((await taxiRepo.count()) === 0) {
      await taxiRepo.save(
        taxiRepo.create([
          {
            name: 'Ahmet Şoför',
            phone: '+905559998877',
            vehicle_info: 'Merkez Taksi - Şahin',
            plaka: '80 T 0001',
            is_active: true,
            is_verified: true,
            user_id: adminId,
          },
          {
            name: 'Mehmet Şoför',
            phone: '+905559998866',
            vehicle_info: 'Garaj Taksi - Doblo',
            plaka: '80 T 0002',
            is_active: true,
            is_verified: true,
            user_id: adminId,
          },
        ] as any),
      );
      console.log('✅ Taxi drivers (2)');
    }

    // ── ADS ───────────────────────────────────────────────────────────────
    const adCatRepo = AppDataSource.getRepository(AdCategory);
    const adCat = await adCatRepo.findOne({ where: { slug: 'elektronik' } });
    const adRepo = AppDataSource.getRepository(Ad);
    if (adCat && (await adRepo.count()) === 0) {
      await adRepo.save(
        adRepo.create([
          {
            category_id: adCat.id,
            title: 'iPhone 13 Satılık',
            description: 'Temiz kullanılmış, kutulu iPhone 13.',
            price: 22000,
            user_id: adminId,
            seller_name: 'Ahmet Y.',
            contact_phone: '05551112233',
            status: 'approved', // ← public filtre
            approved_by: adminId,
            approved_at: new Date(),
            expires_at: new Date(today.getTime() + 30 * 86400000),
          },
          {
            category_id: adCat.id,
            title: 'Bisiklet',
            description: '28 jant şehir bisikleti, az kullanılmış.',
            price: 3500,
            user_id: adminId,
            seller_name: 'Veli K.',
            contact_phone: '05551114455',
            status: 'approved',
            approved_by: adminId,
            approved_at: new Date(),
            expires_at: new Date(today.getTime() + 30 * 86400000),
          },
        ] as any),
      );
      console.log('✅ Ads (2)');
    }

    // ── DEATH NOTICES ─────────────────────────────────────────────────────
    const cemeteryRepo = AppDataSource.getRepository(Cemetery);
    let cemetery = await cemeteryRepo.findOne({ where: {} });
    cemetery ??= await cemeteryRepo.save(
      cemeteryRepo.create({
        name: 'Asri Mezarlık',
        address: 'Merkez, Kadirli',
        is_active: true,
      }),
    );
    const mosqueRepo = AppDataSource.getRepository(Mosque);
    let mosque = await mosqueRepo.findOne({ where: {} });
    mosque ??= await mosqueRepo.save(
      mosqueRepo.create({
        name: 'Ulu Camii',
        address: 'Merkez, Kadirli',
        is_active: true,
      }),
    );
    const deathRepo = AppDataSource.getRepository(DeathNotice);
    if ((await deathRepo.count()) === 0) {
      await deathRepo.save(
        deathRepo.create([
          {
            deceased_name: 'Hüseyin Demir',
            age: 78,
            funeral_date: todayStr,
            funeral_time: '13:00',
            cemetery_id: cemetery.id,
            mosque_id: mosque.id,
            status: 'approved', // ← public filtre
            added_by: adminId,
            approved_by: adminId,
            approved_at: new Date(),
            // NOT NULL, DB default yok — admin akışıyla aynı: cenaze + 7 gün
            auto_archive_at: new Date(today.getTime() + 7 * 86400000),
          },
        ] as any),
      );
      console.log('✅ Death notices (1)');
    }

    // ── BUSINESS + CAMPAIGNS ──────────────────────────────────────────────
    const bizCatRepo = AppDataSource.getRepository(BusinessCategory);
    const bizCat = await bizCatRepo.findOne({ where: { slug: 'restoran' } });
    const bizRepo = AppDataSource.getRepository(Business);
    let business = await bizRepo.findOne({ where: {} });
    business ??= await bizRepo.save(
      bizRepo.create({
        business_name: 'Kadirli Kebap Salonu',
        category_id: bizCat?.id,
        address: 'Merkez, Kadirli',
        phone: '03227141234',
        is_verified: true,
      }),
    );
    const campaignRepo = AppDataSource.getRepository(Campaign);
    if ((await campaignRepo.count()) === 0) {
      await campaignRepo.save(
        campaignRepo.create([
          {
            business_id: business.id,
            title: 'Öğle Menüsünde %20 İndirim',
            description: 'Hafta içi öğle menülerinde geçerlidir.',
            discount_percentage: 20,
            discount_code: 'OGLE20',
            start_date: plusDays(-5),
            end_date: plusDays(25),
            status: 'approved', // ← public filtre
            approved_by: adminId,
            approved_at: new Date(),
          },
        ] as any),
      );
      console.log('✅ Campaigns (1)');
    }

    // ── PHARMACY + SCHEDULE (bugünkü nöbetçi) ─────────────────────────────
    const pharmacyRepo = AppDataSource.getRepository(Pharmacy);
    let pharmacy = await pharmacyRepo.findOne({ where: {} });
    pharmacy ??= await pharmacyRepo.save(
      pharmacyRepo.create({
        name: 'Merkez Eczanesi',
        address: 'Cumhuriyet Cad. No:12, Kadirli',
        phone: '03227141010',
        latitude: 37.374,
        longitude: 36.097,
        pharmacist_name: 'Ecz. Ayşe Kaya',
        is_active: true,
      }),
    );
    const scheduleRepo = AppDataSource.getRepository(PharmacySchedule);
    if ((await scheduleRepo.count()) === 0) {
      await scheduleRepo.save(
        scheduleRepo.create([
          {
            pharmacy_id: pharmacy.id,
            duty_date: todayStr, // ← bugünkü nöbetçi
            start_time: '18:00',
            end_time: '09:00',
            source: 'manual',
          },
          {
            pharmacy_id: pharmacy.id,
            duty_date: plusDays(1),
            start_time: '18:00',
            end_time: '09:00',
            source: 'manual',
          },
        ] as any),
      );
      console.log('✅ Pharmacy schedules (2)');
    }

    // ── GUIDE (rehber) ────────────────────────────────────────────────────
    const guideCatRepo = AppDataSource.getRepository(GuideCategory);
    let guideCat = await guideCatRepo.findOne({ where: { slug: 'saglik' } });
    guideCat ??= await guideCatRepo.save(
      guideCatRepo.create({
        name: 'Sağlık',
        slug: 'saglik',
        icon: 'medical_services',
        is_active: true,
      }),
    );
    const guideItemRepo = AppDataSource.getRepository(GuideItem);
    if ((await guideItemRepo.count()) === 0) {
      await guideItemRepo.save(
        guideItemRepo.create([
          {
            category_id: guideCat.id,
            name: 'Kadirli Devlet Hastanesi',
            phone: '03227141500',
            address: 'Savrun Mah., Kadirli',
            working_hours: '7/24',
            is_active: true,
          },
          {
            category_id: guideCat.id,
            name: 'İlçe Sağlık Müdürlüğü',
            phone: '03227141600',
            address: 'Merkez, Kadirli',
            working_hours: '08:00 - 17:00',
            is_active: true,
          },
        ] as any),
      );
      console.log('✅ Guide items (2)');
    }

    // ── TRANSPORT (şehir dışı + şehir içi) ────────────────────────────────
    const intercityRepo = AppDataSource.getRepository(IntercityRoute);
    const intercitySchedRepo = AppDataSource.getRepository(IntercitySchedule);
    if ((await intercityRepo.count()) === 0) {
      const route = await intercityRepo.save(
        intercityRepo.create({
          destination: 'Adana',
          company: 'Kadirli Seyahat',
          company_name: 'Kadirli Seyahat',
          from_city: 'Kadirli',
          price: 120,
          duration_minutes: 120,
          contact_phone: '03227142000',
          is_active: true,
        } as any) as any,
      );
      await intercitySchedRepo.save(
        intercitySchedRepo.create([
          {
            route_id: (route as any).id,
            departure_time: '08:00',
            days_of_week: [1, 2, 3, 4, 5, 6, 7],
            is_active: true,
          },
          {
            route_id: (route as any).id,
            departure_time: '14:00',
            days_of_week: [1, 2, 3, 4, 5, 6, 7],
            is_active: true,
          },
        ] as any),
      );
      console.log('✅ Intercity route + schedules');
    }

    const intracityRepo = AppDataSource.getRepository(IntracityRoute);
    const intracityStopRepo = AppDataSource.getRepository(IntracityStop);
    if ((await intracityRepo.count()) === 0) {
      const route = await intracityRepo.save(
        intracityRepo.create({
          route_number: '1',
          route_name: 'Merkez - Savrun Hattı',
          color: '#2E7D32',
          first_departure: '06:30',
          last_departure: '22:00',
          frequency_minutes: 20,
          fare: 15,
          is_active: true,
        } as any) as any,
      );
      await intracityStopRepo.save(
        intracityStopRepo.create([
          { route_id: (route as any).id, stop_name: 'Merkez Durağı', stop_order: 1 },
          { route_id: (route as any).id, stop_name: 'Pazar Durağı', stop_order: 2 },
          { route_id: (route as any).id, stop_name: 'Savrun Durağı', stop_order: 3 },
        ] as any),
      );
      console.log('✅ Intracity route + stops');
    }

    console.log('\n✨ Mock data population complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding mocks:', err);
    process.exit(1);
  }
}

seedMocks();
