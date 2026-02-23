// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  avatar_url?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeAds: number;
  pendingApprovals: number;
  todayAnnouncements: number;
  userGrowth: number;
  adGrowth: number;
  approvalGrowth: number;
  announcementGrowth: number;
}

export interface UserGrowthData {
  date: string;
  users: number;
}

export interface ModuleUsageData {
  name: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_register' | 'ad_created' | 'ad_approved' | 'ad_rejected' | 'announcement_created' | 'death_notice' | 'complaint';
  description: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
  };
}

export interface PendingApproval {
  id: string;
  type: 'ad' | 'death' | 'campaign';
  title: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
  };
}

// Sidebar Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

// ─── Announcements ───────────────────────────────────────────────────────────

export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'emergency';
export type AnnouncementTargetType = 'all' | 'neighborhoods' | 'users';
export type AnnouncementSource = 'manual' | 'scraping' | 'api';

export interface AnnouncementType {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Announcement {
  id: string;
  type_id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  source: AnnouncementSource;
  target_type: AnnouncementTargetType;
  target_neighborhoods?: string[];
  target_user_ids?: string[];
  scheduled_for?: string;
  sent_at?: string;
  visible_until?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  send_push_notification: boolean;
  has_pdf: boolean;
  pdf_file_id?: string;
  pdf_file?: {
    id: string;
    name: string;
    url: string;
    size_bytes: number;
  };
  has_link: boolean;
  external_link?: string;
  view_count: number;
  click_count: number;
  created_by: string;
  creator?: {
    id: string;
    username: string;
    full_name: string;
    role: string;
  };
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementListItem {
  id: string;
  type: AnnouncementType;
  title: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  source: AnnouncementSource;
  target_type: AnnouncementTargetType;
  target_neighborhoods?: string[];
  scheduled_for?: string;
  sent_at?: string;
  view_count: number;
  created_at: string;
}

export interface AnnouncementListResponse {
  announcements: AnnouncementListItem[];
}

export interface CreateAnnouncementDto {
  type_id: string;
  title: string;
  body: string;
  priority?: AnnouncementPriority;
  target_type: AnnouncementTargetType;
  target_neighborhoods?: string[];
  target_user_ids?: string[];
  scheduled_for?: string;
  visible_until?: string;
  send_push_notification?: boolean;
  pdf_file_id?: string;
  external_link?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {
  status?: AnnouncementStatus;
}

export interface AnnouncementFilters {
  page?: number;
  limit?: number;
  type_id?: string;
  priority?: AnnouncementPriority;
  status?: AnnouncementStatus;
  neighborhood?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// ─── Ads ─────────────────────────────────────────────────────────────────────

export type AdStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'sold';

export type AdRejectionReason =
  | 'Müstehcen içerik'
  | 'Hatalı bilgiler'
  | 'Kural dışı'
  | 'Spam';

export interface AdCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  parent?: AdCategory;
  children?: AdCategory[];
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface AdImage {
  id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface AdPropertyValue {
  property_id: string;
  property_name: string;
  value: string;
}

export interface Ad {
  id: string;
  category_id: string;
  category: AdCategory;
  title: string;
  description: string;
  price?: number;
  user_id: string;
  user?: {
    id: string;
    username: string;
    full_name: string;
    phone?: string;
    primary_neighborhood?: { id: string; name: string };
  };
  seller_name?: string;
  contact_phone: string;
  status: AdStatus;
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  rejected_at?: string;
  expires_at: string;
  extension_count: number;
  max_extensions: number;
  view_count: number;
  phone_click_count: number;
  whatsapp_click_count: number;
  images?: AdImage[];
  property_values?: AdPropertyValue[];
  created_at: string;
  updated_at: string;
}

export interface AdListItem {
  id: string;
  title: string;
  price?: number;
  status: AdStatus;
  category: { id: string; name: string; parent?: { name: string } };
  user?: { id: string; username: string; full_name: string };
  seller_name?: string;
  contact_phone: string;
  images?: AdImage[];
  view_count: number;
  extension_count: number;
  expires_at: string;
  rejected_reason?: string;
  created_at: string;
}

export interface AdFilters {
  page?: number;
  limit?: number;
  status?: AdStatus;
  category_id?: string;
  search?: string;
  sort?: string;
}

export interface AdminApprovalItem {
  type: 'ad' | 'death' | 'campaign';
  id: string;
  content: {
    title: string;
    user?: { id: string; username: string; phone: string };
  };
  created_at: string;
  hours_pending: number;
}

export interface AdminApprovalsResponse {
  approvals: AdminApprovalItem[];
  total: number;
  page: number;
  limit: number;
}

// ─── Deaths ────────────────────────────────────────────────────────────────

export interface Cemetery {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateCemeteryDto {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
}

export type UpdateCemeteryDto = Partial<CreateCemeteryDto>;

export interface Mosque {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateMosqueDto {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
}

export type UpdateMosqueDto = Partial<CreateMosqueDto>;

export interface DeathNotice {
  id: string;
  deceased_name: string;
  age?: number;
  photo_file_id?: string;
  photo_file?: { id: string; url: string; cdn_url?: string };
  funeral_date: string;
  funeral_time: string;
  cemetery_id?: string;
  cemetery?: Cemetery;
  mosque_id?: string;
  mosque?: Mosque;
  condolence_address?: string;
  neighborhood_id?: string;
  neighborhood?: { id: string; name: string };
  added_by: string;
  adder?: { id: string; username: string; full_name?: string; phone?: string };
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  auto_archive_at: string;
  created_at: string;
  updated_at: string;
}

export type DeathStatus = DeathNotice['status'];

export interface DeathFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateDeathDto {
  deceased_name: string;
  age?: number;
  funeral_date: string;
  funeral_time: string;
  cemetery_id?: string;
  mosque_id?: string;
  condolence_address?: string;
  photo_file_id?: string;
  neighborhood_id?: string;
}

export type UpdateDeathDto = Partial<CreateDeathDto>;

// ─── Campaigns ────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  business_id: string;
  business_name: string;
  title: string;
  description: string;
  discount_rate: number;
  code?: string;
  valid_from: string;
  valid_until: string;
  image_urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  code_views: number;
  rejected_reason?: string;
  created_by?: { id: string; username: string; business_name: string };
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = Campaign['status'];

export interface CampaignFilters {
  status?: CampaignStatus;
  search?: string;
  business_id?: string;
  page?: number;
  limit?: number;
}

export interface BusinessOption {
  id: string;
  business_name: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
}

export interface CreateAdminBusinessDto {
  business_name: string;
  category_id?: string;
  phone: string;
  address: string;
}

export interface CreateCampaignDto {
  business_id: string;
  title: string;
  description: string;
  discount_rate: number;
  code?: string;
  valid_from: string;
  valid_until: string;
  image_ids?: string[];
}

export interface UpdateCampaignDto {
  business_id?: string;
  title?: string;
  description?: string;
  discount_rate?: number;
  code?: string;
  valid_from?: string;
  valid_until?: string;
  image_ids?: string[];
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole =
  | 'user'
  | 'taxi_driver'
  | 'business'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string;
  phone: string;
  email?: string;
  username: string;
  role: UserRole;
  primary_neighborhood?: { id: string; name: string };
  is_active: boolean;
  is_banned: boolean;
  ban_reason?: string;
  banned_at?: string;
  banned_by?: string;
  created_at: string;
  last_login?: string;
  stats?: {
    total_ads: number;
  };
}

export interface UserFilters {
  role?: UserRole;
  is_banned?: boolean;
  search?: string;
  neighborhood_id?: string;
  page?: number;
  limit?: number;
}

// ─── Pharmacy ─────────────────────────────────────────────────────────────────

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: string;
  pharmacist_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface PharmacySchedule {
  id: string;
  pharmacy_id: string;
  pharmacy_name: string;
  duty_date: string;
  start_time: string;
  end_time: string;
  source: 'manual' | 'scraping';
  created_at: string;
}

// ─── Transport ────────────────────────────────────────────────────────────────

export interface IntercitySchedule {
  id: string;
  route_id: string;
  departure_time: string; // "08:00"
  days_of_week: number[]; // [1,2,3,4,5] (1=Pzt, 7=Paz)
  is_active: boolean;
  created_at: string;
}

export interface IntercityRoute {
  id: string;
  company_name: string;
  from_city: string;
  to_city: string;
  duration_minutes: number;
  price: number;
  contact_phone?: string;
  contact_website?: string;
  amenities?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  schedules?: IntercitySchedule[];
}

export interface IntercityFilters {
  company_name?: string;
  from_city?: string;
  to_city?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface IntracityStop {
  id: string;
  route_id: string;
  stop_order: number;
  name: string;
  neighborhood_id?: string;
  neighborhood_name?: string;
  latitude?: number;
  longitude?: number;
  time_from_start?: number;
  created_at: string;
}

export interface IntracityRoute {
  id: string;
  line_number: string;
  name: string;
  color?: string;
  first_departure: string;
  last_departure: string;
  frequency_minutes: number;
  fare: number;
  is_active: boolean;
  created_at: string;
  stops?: IntracityStop[];
}

export interface IntracityFilters {
  line_number?: string;
  neighborhood?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

// ─── Taxi ─────────────────────────────────────────────────────────────────────

export interface TaxiDriver {
  id: string;
  name: string;
  phone: string;
  plaka: string | null;
  vehicle_info: string | null;
  registration_file_id: string | null;
  registration_file_url: string | null;
  license_file_id: string | null;
  is_verified: boolean;
  is_active: boolean;
  total_calls: number;
  created_at: string;
  updated_at: string;
}

export interface TaxiFilters {
  search?: string;
  is_active?: boolean;
  is_verified?: boolean;
  page?: number;
  limit?: number;
}

// ─── Events Types ─────────────────────────────────────────────────────────────

export interface EventCategory {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category: { id: string; name: string; icon: string | null } | null;
  event_date: string;
  event_time: string;
  duration_minutes: number | null;
  venue_name: string | null;
  venue_address: string | null;
  is_local: boolean;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  organizer: string | null;
  ticket_price: number | null;
  is_free: boolean;
  age_restriction: string | null;
  capacity: number | null;
  website_url: string | null;
  ticket_url: string | null;
  cover_image_id: string | null;
  cover_image_url: string | null;
  status: 'draft' | 'published' | 'cancelled' | 'archived';
  images: EventImage[];
  created_at: string;
  updated_at: string;
}

export interface EventImage {
  id: string;
  file_id: string;
  url: string | null;
  display_order: number;
}

export interface EventFilters {
  search?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  is_local?: boolean;
  page?: number;
  limit?: number;
}

// ── REHBER ───────────────────────────────────────────────────────────────────

export interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  parent: { id: string; name: string } | null;
  children: GuideCategoryChild[];
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GuideCategoryChild {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GuideItem {
  id: string;
  category_id: string;
  category: {
    id: string;
    name: string;
    parent: { id: string; name: string } | null;
  } | null;
  name: string;
  phone: string;
  address: string | null;
  email: string | null;
  website_url: string | null;
  working_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_file_id: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuideItemFilters {
  search?: string;
  category_id?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateGuideCategoryDto {
  name: string;
  parent_id?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateGuideCategoryDto extends Partial<CreateGuideCategoryDto> {}

export interface CreateGuideItemDto {
  category_id: string;
  name: string;
  phone: string;
  address?: string;
  email?: string;
  website_url?: string;
  working_hours?: string;
  latitude?: number;
  longitude?: number;
  logo_file_id?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateGuideItemDto extends Partial<CreateGuideItemDto> {}

// ─── Places ───────────────────────────────────────────────────────────────────

export interface PlaceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PlaceImage {
  id: string;
  file_id: string;
  url: string | null;
  display_order: number;
}

export interface Place {
  id: string;
  category_id: string | null;
  category: { id: string; name: string; icon: string | null } | null;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  entrance_fee: number | null;
  is_free: boolean;
  opening_hours: string | null;
  best_season: string | null;
  how_to_get_there: string | null;
  distance_from_center: number | null;
  cover_image_id: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  images: PlaceImage[];
  created_at: string;
  updated_at: string;
}

export interface PlaceFilters {
  search?: string;
  category_id?: string;
  is_active?: boolean;
  is_free?: boolean;
  page?: number;
  limit?: number;
}

export interface CreatePlaceCategoryDto {
  name: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdatePlaceCategoryDto extends Partial<CreatePlaceCategoryDto> {}

export interface CreatePlaceDto {
  category_id?: string;
  name: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  entrance_fee?: number;
  is_free?: boolean;
  opening_hours?: string;
  best_season?: string;
  how_to_get_there?: string;
  distance_from_center?: number;
  cover_image_id?: string;
  is_active?: boolean;
}

export interface UpdatePlaceDto extends Partial<CreatePlaceDto> {}
