/**
 * Türk telefon numarasını normalize eder
 * Giriş: 05331234567 veya +905331234567 veya 5331234567
 * Çıkış: 05331234567
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

  if (cleaned.startsWith('+90')) {
    return '0' + cleaned.slice(3);
  }
  if (cleaned.startsWith('90') && cleaned.length === 12) {
    return '0' + cleaned.slice(2);
  }
  if (cleaned.startsWith('5') && cleaned.length === 10) {
    return '0' + cleaned;
  }
  return cleaned;
}

/**
 * WhatsApp URL oluşturur
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhone(phone);
  const waPhone = '90' + normalized.slice(1);
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : '';
  return `https://wa.me/${waPhone}${text}`;
}

/**
 * Türk telefon numarası geçerlilik kontrolü
 */
export function isValidTurkishPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^0[5][0-9]{9}$/.test(normalized);
}
