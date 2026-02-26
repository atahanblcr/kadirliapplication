import { normalizePhone, getWhatsAppUrl, isValidTurkishPhone } from './phone.util';

describe('Phone Utilities', () => {
  // ============================================================================
  // normalizePhone Tests
  // ============================================================================
  describe('normalizePhone', () => {
    it('should normalize +90 format to 0 format', () => {
      expect(normalizePhone('+905331234567')).toBe('05331234567');
    });

    it('should normalize 90 format (12 digits) to 0 format', () => {
      expect(normalizePhone('905331234567')).toBe('05331234567');
    });

    it('should prepend 0 to 10-digit format starting with 5', () => {
      expect(normalizePhone('5331234567')).toBe('05331234567');
    });

    it('should return as-is if already in 0 format', () => {
      expect(normalizePhone('05331234567')).toBe('05331234567');
    });

    it('should remove spaces from phone number', () => {
      expect(normalizePhone('+90 533 123 4567')).toBe('05331234567');
    });

    it('should remove hyphens from phone number', () => {
      expect(normalizePhone('+90-533-123-4567')).toBe('05331234567');
    });

    it('should handle mixed spaces and hyphens', () => {
      expect(normalizePhone('+90 - 533 - 123 - 4567')).toBe('05331234567');
    });

    it('should handle different operator codes (0506, 0507, etc)', () => {
      expect(normalizePhone('+905061234567')).toBe('05061234567');
      expect(normalizePhone('+905071234567')).toBe('05071234567');
      expect(normalizePhone('+905001234567')).toBe('05001234567');
    });

    it('should return unchanged if format is not recognized', () => {
      expect(normalizePhone('1234567890')).toBe('1234567890');
      expect(normalizePhone('abcdefgh')).toBe('abcdefgh');
    });

    it('should handle empty string', () => {
      expect(normalizePhone('')).toBe('');
    });

    it('should handle 90 format with wrong length', () => {
      expect(normalizePhone('9053312345')).toBe('9053312345'); // 11 digits - not 12
    });
  });

  // ============================================================================
  // getWhatsAppUrl Tests
  // ============================================================================
  describe('getWhatsAppUrl', () => {
    it('should generate WhatsApp URL without message', () => {
      const url = getWhatsAppUrl('05331234567');
      expect(url).toBe('https://wa.me/905331234567');
    });

    it('should generate WhatsApp URL with message', () => {
      const url = getWhatsAppUrl('05331234567', 'Merhaba');
      expect(url).toContain('https://wa.me/905331234567');
      expect(url).toContain('?text=');
      expect(url).toContain('Merhaba');
    });

    it('should URL encode message with special characters', () => {
      const url = getWhatsAppUrl('05331234567', 'Merhaba Nasılsın?');
      expect(url).toContain('Merhaba');
      expect(url).toContain('Nas');
      // URL encoded space as %20
      expect(url).toContain('%20');
    });

    it('should handle message with Turkish characters', () => {
      const url = getWhatsAppUrl('05331234567', 'Şifre: 1234!');
      expect(url).toContain('https://wa.me/905331234567');
      expect(url).toContain('?text=');
    });

    it('should normalize phone number before creating URL', () => {
      const url1 = getWhatsAppUrl('+905331234567');
      const url2 = getWhatsAppUrl('5331234567');
      const url3 = getWhatsAppUrl('905331234567');
      expect(url1).toBe(url2);
      expect(url2).toBe(url3);
      expect(url1).toBe('https://wa.me/905331234567');
    });

    it('should handle spaces and hyphens in phone', () => {
      const url = getWhatsAppUrl('+90 533 123 4567');
      expect(url).toBe('https://wa.me/905331234567');
    });

    it('should handle empty message string', () => {
      const url = getWhatsAppUrl('05331234567', '');
      // Empty string is falsy, so it won't add ?text=
      expect(url).toBe('https://wa.me/905331234567');
    });

    it('should handle message with numbers and symbols', () => {
      const url = getWhatsAppUrl('05331234567', '123 456 @#$%');
      expect(url).toContain('https://wa.me/905331234567');
      expect(url).toContain('?text=');
    });
  });

  // ============================================================================
  // isValidTurkishPhone Tests
  // ============================================================================
  describe('isValidTurkishPhone', () => {
    it('should return true for valid Turkish phone number', () => {
      expect(isValidTurkishPhone('05331234567')).toBe(true);
    });

    it('should return true for valid phone with +90 format', () => {
      expect(isValidTurkishPhone('+905331234567')).toBe(true);
    });

    it('should return true for valid phone with 90 format', () => {
      expect(isValidTurkishPhone('905331234567')).toBe(true);
    });

    it('should return true for valid phone with 10-digit format', () => {
      expect(isValidTurkishPhone('5331234567')).toBe(true);
    });

    it('should return true for different operator codes (505, 506, 507, 508, 509, 510, 511, 512, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539)', () => {
      expect(isValidTurkishPhone('05051234567')).toBe(true);
      expect(isValidTurkishPhone('05061234567')).toBe(true);
      expect(isValidTurkishPhone('05301234567')).toBe(true);
      expect(isValidTurkishPhone('05391234567')).toBe(true);
    });

    it('should return false for invalid operator code (04, 06, 08, 09)', () => {
      expect(isValidTurkishPhone('04331234567')).toBe(false);
      expect(isValidTurkishPhone('06331234567')).toBe(false);
      expect(isValidTurkishPhone('08331234567')).toBe(false);
      expect(isValidTurkishPhone('09331234567')).toBe(false);
    });

    it('should return true for phone with spaces (normalized)', () => {
      // normalizePhone removes spaces, so it becomes valid
      expect(isValidTurkishPhone('0533 123 4567')).toBe(true);
    });

    it('should return true for phone with hyphens (normalized)', () => {
      // normalizePhone removes hyphens, so it becomes valid
      expect(isValidTurkishPhone('0533-123-4567')).toBe(true);
    });

    it('should return false for too short number', () => {
      expect(isValidTurkishPhone('0533123456')).toBe(false); // 10 digits total
    });

    it('should return false for too long number', () => {
      expect(isValidTurkishPhone('053312345678')).toBe(false); // 12 digits total
    });

    it('should return false for invalid format', () => {
      expect(isValidTurkishPhone('abcdefghijk')).toBe(false);
      expect(isValidTurkishPhone('(0533) 123 4567')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidTurkishPhone('')).toBe(false);
    });

    it('should return false for null/undefined normalized value', () => {
      // Edge case: if normalization doesn't produce valid format
      expect(isValidTurkishPhone('1234567890')).toBe(false);
    });

    it('should return true after normalizing different formats', () => {
      // All these should be valid after normalization
      expect(isValidTurkishPhone('+905331234567')).toBe(true);
      expect(isValidTurkishPhone('+90 533 123 4567')).toBe(true); // Spaces are removed in normalization
    });

    it('should handle 0 prefix correctly', () => {
      expect(isValidTurkishPhone('05331234567')).toBe(true); // Valid: 0 + 5 + 9 digits
    });

    it('should reject numbers not starting with 05', () => {
      expect(isValidTurkishPhone('01231234567')).toBe(false); // Starts with 01, not 05
      expect(isValidTurkishPhone('03331234567')).toBe(false); // Starts with 03, not 05
    });
  });
});
