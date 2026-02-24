export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Duyurular',
    href: '/announcements',
    icon: 'Megaphone',
  },
  {
    title: 'İlanlar',
    href: '/ads',
    icon: 'FileText',
  },
  {
    title: 'Vefat İlanları',
    href: '/deaths',
    icon: 'Heart',
  },
  {
    title: 'Kampanyalar',
    href: '/campaigns',
    icon: 'Gift',
  },
  {
    title: 'Nöbetçi Eczane',
    href: '/pharmacy',
    icon: 'Pill',
  },
  {
    title: 'Rehber',
    href: '/guide',
    icon: 'BookOpen',
  },
  {
    title: 'Mekanlar',
    href: '/places',
    icon: 'MapPin',
  },
  {
    title: 'Ulaşım',
    href: '/transport',
    icon: 'Bus',
  },
  {
    title: 'Etkinlikler',
    href: '/events',
    icon: 'Calendar',
  },
  {
    title: 'Taksi',
    href: '/taxi',
    icon: 'Car',
  },
  {
    title: 'Mahalleler',
    href: '/neighborhoods',
    icon: 'Home',
  },
  {
    title: 'Kullanıcılar',
    href: '/users',
    icon: 'Users',
  },
  {
    title: 'Şikayetler',
    href: '/complaints',
    icon: 'MessageSquareWarning',
  },
  {
    title: 'Admin Yönetimi',
    href: '/staff',
    icon: 'Shield',
  },
  {
    title: 'Ayarlar',
    href: '/settings',
    icon: 'Settings',
  },
] as const;

export const NEIGHBORHOODS = [
  'Merkez',
  'Akdam',
  'Akoluk',
  'Azaplı',
  'Bağyüzü',
  'Çamlıca',
  'Çukurova',
  'Dağdancık',
  'Değirmendere',
  'Erkenez',
  'Gökçedam',
  'Göllüce',
  'Karaçay',
  'Karaisalı',
  'Kargapazarı',
  'Kızyusuflu',
  'Küçükdam',
  'Örtülü',
  'Seçkin',
  'Tayalı',
  'Uludam',
  'Yağızlı',
  'Yeşilova',
] as const;

export const ADMIN_MODULES = [
  { key: 'announcements', label: 'Duyurular', hasApprove: false },
  { key: 'ads', label: 'İlanlar', hasApprove: true },
  { key: 'deaths', label: 'Vefat İlanları', hasApprove: true },
  { key: 'campaigns', label: 'Kampanyalar', hasApprove: true },
  { key: 'users', label: 'Kullanıcılar', hasApprove: false },
  { key: 'pharmacy', label: 'Nöbetçi Eczane', hasApprove: false },
  { key: 'transport', label: 'Ulaşım', hasApprove: false },
  { key: 'neighborhoods', label: 'Mahalleler', hasApprove: false },
  { key: 'taxi', label: 'Taksi', hasApprove: false },
  { key: 'events', label: 'Etkinlikler', hasApprove: true },
  { key: 'guide', label: 'Rehber', hasApprove: false },
  { key: 'places', label: 'Mekanlar', hasApprove: false },
  { key: 'complaints', label: 'Şikayetler', hasApprove: false },
] as const;
