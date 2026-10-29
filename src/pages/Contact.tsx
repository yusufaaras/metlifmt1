import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';
import { formatTelLink, formatWhatsAppLink } from '@/utils/phone';
import { sendContactMessage } from '@/services/api';

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.954 2.801.954l.003-.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.776-5.766zm-12.031 5.766c0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12s-5.373-12-12-12c-6.627 0-12 5.373-12 12zm18 0c0 3.309-2.691 6-6 6-.975 0-1.895-.233-2.709-.646l-4.291 1.124 1.144-4.184c-.454-.834-.712-1.787-.712-2.801 0-3.309 2.691-6 6-6s6 2.691 6 6z"/>
  </svg>
);
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

export default function Contact() {
  const { t, language } = useLanguage();
  const { getSection } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);

  const footer = getSection('footer_settings', {});

  const people = Array.isArray(footer.phones) && footer.phones.length > 0
    ? footer.phones.map((p: any) => ({
        name: p.label || 'METLİ',
        phone: p.number || '',
        tel: formatTelLink(p.tel || p.number || ''),
        whatsapp: formatWhatsAppLink(
          p.whatsapp || p.number || '',
          `Merhaba ${p.label || 'METLİ'}, web siteniz üzerinden bilgi almak istiyorum.`
        ),
        role: p.role || ''
      })).filter((p: any) => p.phone || p.tel)
    : [
        {
          name: 'Bilal METLİ',
          phone: '0545 479 05 85',
          tel: formatTelLink('0545 479 05 85'),
          whatsapp: formatWhatsAppLink('0545 479 05 85', 'Merhaba Bilal Bey, web siteniz üzerinden bilgi almak istiyorum.'),
          role: 'Satış & Pazarlama'
        },
        {
          name: 'Fatih METLİ',
          phone: '0531 345 73 04',
          tel: formatTelLink('0531 345 73 04'),
          whatsapp: formatWhatsAppLink('0531 345 73 04', 'Merhaba Fatih Bey, web siteniz üzerinden bilgi almak istiyorum.'),
          role: 'Mühendislik & Üretim'
        },
        {
          name: 'Abdullah METLİ',
          phone: '0535 616 49 41',
          tel: formatTelLink('0535 616 49 41'),
          whatsapp: formatWhatsAppLink('0535 616 49 41', 'Merhaba Abdullah Bey, web siteniz üzerinden bilgi almak istiyorum.'),
          role: t('contact.founder') || 'Kurucu'
        },
      ];

  const emails = Array.isArray(footer.emails) && footer.emails.length > 0
    ? footer.emails
    : ['metliticaret@hotmail.com', 'fatihmakinamuhendislik@hotmail.com'];

  const addressText = resolveLocalizedText(footer.address, language, 'contact.addressText') || t('contact.addressText');

  return (
    <div className="pt-16 md:pt-20">
      {/* ═══ SPLIT HERO: Info Left + Form Right ═══ */}
      <section className="min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">

          {/* LEFT — Dark info panel */}
          <motion.div
            className="w-full lg:w-5/12 bg-gradient-to-br from-secondary-dark via-secondary to-primary-dark text-white p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative circles */}
            <div className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute bottom-[-40px] left-[-40px] w-36 h-36 bg-white/5 rounded-full" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center">
                  <img src="/images/metlilogo.svg" alt="METLİ" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <div>
                  <p className="font-bold text-lg">METLİ / FMT</p>
                  <p className="text-[10px] text-white/50 tracking-wider">Ticaret & Makina Mühendislik</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">{t('contact.title')}</h1>
              <p className="text-sm text-white/60 mb-10">{t('contact.subtitle')}</p>

              {/* Phone contacts */}
              <div className="space-y-4 mb-10">
                {people.map((p, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <a href={p.tel} className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors text-white">
                        <PhoneIcon />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">{p.name}</p>
                          {p.role && <span className="text-[10px] text-primary-light bg-primary/20 px-2 py-0.5 rounded-full font-medium">{p.role}</span>}
                        </div>
                        <p className="text-white/70 text-sm font-mono mt-0.5">{p.phone}</p>
                      </div>
                    </a>

                    {/* Quick Call & WhatsApp Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={p.tel}
                        title={`${p.name} Ara`}
                        className="w-9 h-9 rounded-lg bg-primary/30 hover:bg-primary text-white flex items-center justify-center transition-all"
                      >
                        <PhoneIcon />
                      </a>
                      <a
                        href={p.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${p.name} WhatsApp'tan Yaz`}
                        className="w-9 h-9 rounded-lg bg-emerald-500/30 hover:bg-emerald-600 text-white flex items-center justify-center transition-all"
                      >
                        <WhatsAppIcon />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Email */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-wider">
                  <MailIcon />
                  <span>{t('contact.emailTitle')}</span>
                </div>
                {emails.map((em, i) => (
                  <a key={i} href={`mailto:${em}`} className="block text-sm text-white/70 hover:text-white transition-colors pl-8">{em}</a>
                ))}
              </div>

              {/* Address */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-wider">
                  <MapIcon />
                  <span>{t('contact.address')}</span>
                </div>
                <p className="text-sm text-white/70 pl-8">{addressText}</p>
                <div className="pl-8 flex flex-col gap-1">
                  <a href="https://maps.app.goo.gl/PbuxSpu5UxDBnfwv9" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-light hover:text-white transition-colors">{t('contact.mapLocation1')} ↗</a>
                  <a href="https://maps.app.goo.gl/W5WcPw5HG1e18rq2A" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-light hover:text-white transition-colors">{t('contact.mapLocation2')} ↗</a>
                </div>
              </div>

              {/* Certificates */}
              <div className="flex flex-wrap gap-2">
                {['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6'].map(c => (
                  <span key={c} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Form panel */}
          <motion.div
            className="w-full lg:w-7/12 bg-gray-50 p-8 md:p-12 lg:p-16 flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-xl mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading mb-2">{t('contact.form')}</h2>
              <div className="h-1 w-12 bg-primary rounded-full mb-8" />

              {sent ? (
                <motion.div
                  className="text-center py-16 px-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 className="text-secondary-dark font-bold text-2xl mb-2">{t('contact.sent')}</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                    Mesajınız yetkililerimize iletildi. En kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-sm transition-all"
                  >
                    + Yeni Mesaj Gönder
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    setErrorMsg('');
                    try {
                      await sendContactMessage(formData);
                      setSent(true);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    } catch (err: any) {
                      setErrorMsg(err.message || 'Mesaj iletilemedi, lütfen daha sonra tekrar deneyiniz.');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="space-y-5"
                >
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.name')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Adınız ve Soyadınız"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.email')} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ornek@email.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.phone')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.message')} *</label>
                    <textarea
                      rows={6}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Talebinizi, sipariş veya soru detaylarınızı buraya yazınız..."
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <span>{t('contact.send')} ✉️</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══ MAP SECTION ═══ */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('contact.location')}</h2>
            <div className="h-1 w-10 bg-primary rounded-full mx-auto mt-3" />
          </motion.div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[300px] md:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50972.28!2d35.78!3d37.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1529e8bc8e8e1d1d%3A0x6a0e1a5d6a0e1a5d!2sKozan%20Organize%20Sanayi%20B%C3%B6lgesi!5e0!3m2!1str!2str!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('contact.location')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
