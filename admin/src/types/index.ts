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

export interface AdminApprovalsResponse {
  pending: {
    ads: AdListItem[];
    deaths: unknown[];
    campaigns: unknown[];
  };
}
