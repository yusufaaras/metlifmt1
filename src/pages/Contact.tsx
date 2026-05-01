import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formSent, setFormSent] = useState(false);

  const contactPeople = [
    { name: 'Bilal METLİ', phone: '0545 479 05 85', role: t('contact.info') },
    { name: 'Fatih METLİ', phone: '0531 345 73 04', role: t('contact.info') },
    { name: 'Abdullah METLİ', phone: '0535 616 49 41', role: t('contact.founder') },
  ];

  const emails = ['metliticaret@hotmail.com', 'fatihmakinamuhendislik@hotmail.com'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3000);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src="/images/factory.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {t('contact.title')}
          </motion.h1>
          <motion.p className="text-lg text-white/80 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactPeople.map((person, i) => (
              <motion.a
                key={i}
                href={`tel:+9${person.phone.replace(/\s/g, '')}`}
                className="card-hover bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3 className="font-bold text-secondary-dark text-lg">{person.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{person.role}</p>
                <p className="text-primary font-semibold">{person.phone}</p>
              </motion.a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-secondary-dark font-heading mb-6">{t('contact.form')}</h2>
              {formSent ? (
                <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-primary font-semibold text-lg">{t('contact.sent')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone')}</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
                    <textarea rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg">
                    {t('contact.send')}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {/* Emails */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="font-bold text-secondary-dark mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {t('contact.emailTitle')}
                </h3>
                <div className="space-y-2">
                  {emails.map((email) => (
                    <a key={email} href={`mailto:${email}`} className="block text-sm text-gray-600 hover:text-primary transition-colors">{email}</a>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="font-bold text-secondary-dark mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {t('contact.address')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{t('contact.addressText')}</p>
                <div className="flex flex-col gap-2">
                  <a href="https://maps.app.goo.gl/PbuxSpu5UxDBnfwv9" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    {t('contact.mapLocation1')}
                  </a>
                  <a href="https://maps.app.goo.gl/W5WcPw5HG1e18rq2A" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    {t('contact.mapLocation2')}
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <h3 className="font-bold text-secondary-dark p-6 pb-0 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {t('contact.location')}
                </h3>
                <div className="p-6 pt-4">
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3185.8!2d35.8!3d37.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI0JzAwLjAiTiAzNcKwNDgnMDAuMCJF!5e0!3m2!1str!2str!4v1"
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
