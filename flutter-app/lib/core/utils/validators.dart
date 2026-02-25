/// Input Validators
/// Utility functions for validating user input

class Validators {
  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'E-posta alanı boş olamaz';
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value)) {
      return 'Geçerli bir e-posta girin';
    }

    return null;
  }

  // Phone validation
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Telefon numarası boş olamaz';
    }

    final phoneRegex = RegExp(r'^(\+90|0)[0-9]{10}$');

    if (!phoneRegex.hasMatch(value.replaceAll(' ', ''))) {
      return 'Geçerli bir telefon numarası girin';
    }

    return null;
  }

  // Password validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre boş olamaz';
    }

    if (value.length < 8) {
      return 'Şifre en az 8 karakter olmalıdır';
    }

    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Şifre en az bir büyük harf içermelidir';
    }

    if (!value.contains(RegExp(r'[a-z]'))) {
      return 'Şifre en az bir küçük harf içermelidir';
    }

    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Şifre en az bir rakam içermelidir';
    }

    return null;
  }

  // OTP validation
  static String? validateOtp(String? value) {
    if (value == null || value.isEmpty) {
      return 'OTP boş olamaz';
    }

    if (value.length != 6) {
      return 'OTP 6 haneli olmalıdır';
    }

    if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
      return 'OTP sadece rakam içermelidir';
    }

    return null;
  }

  // Required field validation
  static String? validateRequired(String? value, {String fieldName = 'Bu alan'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName boş olamaz';
    }
    return null;
  }

  // Min length validation
  static String? validateMinLength(String? value, int minLength) {
    if (value == null || value.isEmpty) {
      return 'Bu alan boş olamaz';
    }

    if (value.length < minLength) {
      return 'En az $minLength karakter girin';
    }

    return null;
  }

  // Max length validation
  static String? validateMaxLength(String? value, int maxLength) {
    if (value == null || value.isEmpty) {
      return null;
    }

    if (value.length > maxLength) {
      return 'En fazla $maxLength karakter girin';
    }

    return null;
  }

  // URL validation
  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return 'URL boş olamaz';
    }

    final urlRegex = RegExp(
      r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$',
    );

    if (!urlRegex.hasMatch(value)) {
      return 'Geçerli bir URL girin';
    }

    return null;
  }
}
