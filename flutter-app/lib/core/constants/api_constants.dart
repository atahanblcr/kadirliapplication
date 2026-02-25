/// API Constants
/// Base URLs, endpoints, and configurations for backend communication

class ApiConstants {
  // Base URLs
  // Android emulator: 10.0.2.2 (special alias for host machine)
  // iOS simulator/device: localhost or your machine IP
  static const String devBaseUrl = 'http://10.0.2.2:3000/v1';
  static const String devBaseUrlIos = 'http://localhost:3000/v1';
  static const String prodBaseUrl = 'https://api.kadirliapp.com/v1';

  // Timeouts
  static const int connectTimeoutMs = 30000;
  static const int receiveTimeoutMs = 30000;
  static const int sendTimeoutMs = 30000;

  // API version
  static const String apiVersion = 'v1';

  // Endpoints - Auth
  static const String authRequestOtp = '/auth/request-otp';
  static const String authVerifyOtp = '/auth/verify-otp';
  static const String authRegister = '/auth/register';
  static const String authRefresh = '/auth/refresh';
  static const String authLogout = '/auth/logout';

  // Endpoints - Neighborhoods
  static const String neighborhoods = '/admin/neighborhoods';

  // Endpoints - Announcements
  static const String announcementsList = '/announcements';
  static const String announcementsDetail = '/announcements/:id';

  // Endpoints - Ads
  static const String adsList = '/ads';
  static const String adsDetail = '/ads/:id';
  static const String adsCreate = '/ads';
  static const String adsUpdate = '/ads/:id';
  static const String adsDelete = '/ads/:id';
  static const String adsFavorite = '/ads/:id/favorite';

  // Endpoints - Deaths
  static const String deathsList = '/deaths';
  static const String deathsDetail = '/deaths/:id';

  // Endpoints - Campaigns
  static const String campaignsList = '/campaigns';
  static const String campaignsDetail = '/campaigns/:id';

  // Endpoints - Profile
  static const String profileMe = '/users/me';
  static const String profileUpdate = '/users/:id';

  // Endpoints - Notifications
  static const String notificationsToken = '/notifications/token';
  static const String notificationsList = '/notifications';

  // Error codes
  static const int successCode = 200;
  static const int createdCode = 201;
  static const int badRequestCode = 400;
  static const int unauthorizedCode = 401;
  static const int forbiddenCode = 403;
  static const int notFoundCode = 404;
  static const int serverErrorCode = 500;
}
