/**
 * Utilities for formatting and normalizing phone numbers for tel: and WhatsApp wa.me links.
 */

export function normalizePhoneDigits(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Returns a clickable tel: link, ensuring international dialing prefix +90 for Turkey.
 */
export function formatTelLink(phone: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
  }
  const digits = normalizePhoneDigits(phone);
  if (!digits) return '';

  if (digits.startsWith('00')) {
    return `tel:+${digits.slice(2)}`;
  }
  if (digits.startsWith('0')) {
    return `tel:+90${digits.slice(1)}`;
  }
  if (digits.startsWith('90')) {
    return `tel:+${digits}`;
  }
  if (digits.length === 10) {
    return `tel:+90${digits}`;
  }
  return `tel:+${digits}`;
}

/**
 * Returns a direct WhatsApp chat link (https://wa.me/<number>?text=...).
 * wa.me requires digits with country code, no leading zeros, no + sign.
 */
export function formatWhatsAppLink(phone: string, message?: string): string {
  if (!phone) return '';
  let digits = normalizePhoneDigits(phone);
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = '90' + digits.slice(1);
  } else if (!digits.startsWith('90') && digits.length === 10) {
    digits = '90' + digits;
  }

  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}
