import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

export default function Contact() {
  const { t, language } = useLanguage();
  const { getSection } = useData();
  const [sent, setSent] = useState(false);

  const footer = getSection('footer_settings', {});

  const people = Array.isArray(footer.phones) && footer.phones.length > 0
    ? footer.phones.map((p: any) => ({
        name: p.label || 'METLİ',
        phone: p.number || '',
        tel: p.tel || (p.number ? `+90${p.number.replace(/\D/g, '')}` : '')
      }))
    : [
        { name: 'Bilal METLİ', phone: '0545 479 05 85', tel: '+905454790585' },
        { name: 'Fatih METLİ', phone: '0531 345 73 04', tel: '+905313457304' },
        { name: 'Abdullah METLİ', phone: '0535 616 49 41', tel: '+905356164941', role: t('contact.founder') },
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
                  <motion.a
                    key={i}
                    href={`tel:${p.tel}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <PhoneIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      {p.role && <p className="text-[10px] text-white/40">{p.role}</p>}
                      <p className="text-white/70 text-sm">{p.phone}</p>
                    </div>
                  </motion.a>
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
                  className="text-center py-20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="text-primary font-bold text-xl">{t('contact.sent')}</p>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.name')}</label>
                      <input type="text" required className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.email')}</label>
                      <input type="email" required className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.phone')}</label>
                    <input type="tel" className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t('contact.message')}</label>
                    <textarea rows={6} required className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all shadow-sm" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl text-sm">
                    {t('contact.send')}
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
