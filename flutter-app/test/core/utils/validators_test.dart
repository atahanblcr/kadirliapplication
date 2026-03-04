import 'package:flutter_test/flutter_test.dart';
import 'package:kadirliapp/core/utils/validators.dart';

void main() {
  group('Validators', () {
    test('validateEmail', () {
      expect(Validators.validateEmail(null), 'E-posta alanı boş olamaz');
      expect(Validators.validateEmail(''), 'E-posta alanı boş olamaz');
      expect(Validators.validateEmail('invalid'), 'Geçerli bir e-posta girin');
      expect(Validators.validateEmail('test@test.com'), isNull);
    });

    test('validatePhone', () {
      expect(Validators.validatePhone(null), 'Telefon numarası boş olamaz');
      expect(Validators.validatePhone(''), 'Telefon numarası boş olamaz');
      expect(Validators.validatePhone('123'), 'Geçerli bir telefon numarası girin');
      expect(Validators.validatePhone('05551112233'), isNull);
      expect(Validators.validatePhone('+905551112233'), isNull);
    });

    test('validatePassword', () {
      expect(Validators.validatePassword(null), 'Şifre boş olamaz');
      expect(Validators.validatePassword('short'), 'Şifre en az 8 karakter olmalıdır');
      expect(Validators.validatePassword('alllowercase1'), 'Şifre en az bir büyük harf içermelidir');
      expect(Validators.validatePassword('ALLUPPERCASE1'), 'Şifre en az bir küçük harf içermelidir');
      expect(Validators.validatePassword('NoNumberCase'), 'Şifre en az bir rakam içermelidir');
      expect(Validators.validatePassword('ValidPass123'), isNull);
    });

    test('validateOtp', () {
      expect(Validators.validateOtp(null), 'OTP boş olamaz');
      expect(Validators.validateOtp('123'), 'OTP 6 haneli olmalıdır');
      expect(Validators.validateOtp('123abc'), 'OTP sadece rakam içermelidir');
      expect(Validators.validateOtp('123456'), isNull);
    });

    test('validateRequired', () {
      expect(Validators.validateRequired(null), 'Bu alan boş olamaz');
      expect(Validators.validateRequired('  '), 'Bu alan boş olamaz');
      expect(Validators.validateRequired('value'), isNull);
    });

    test('validateMinLength', () {
      expect(Validators.validateMinLength('12', 3), 'En az 3 karakter girin');
      expect(Validators.validateMinLength('123', 3), isNull);
    });

    test('validateMaxLength', () {
      expect(Validators.validateMaxLength('1234', 3), 'En fazla 3 karakter girin');
      expect(Validators.validateMaxLength('123', 3), isNull);
      expect(Validators.validateMaxLength(null, 3), isNull);
    });

    test('validateUrl', () {
      expect(Validators.validateUrl(null), 'URL boş olamaz');
      expect(Validators.validateUrl('invalid'), 'Geçerli bir URL girin');
      expect(Validators.validateUrl('http://test.com'), isNull);
      expect(Validators.validateUrl('https://test.com/path?q=1'), isNull);
    });
  });
}
