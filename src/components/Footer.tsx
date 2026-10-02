import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';

export default function Footer() {
  const { language, t } = useLanguage();
  const { getSection } = useData();

  const footer = getSection('footer_settings', {
    aboutText: {
      tr: 'Tel ürünleri, çit sistemleri, emprenyeli ahşap direkler ve telli terbiye file sistemlerinde yarım asırlık tecrübemizle sanayi ve tarım sektörüne değer katıyoruz.'
    },
    companyTitle: 'METLİ / FMT',
    companySubtitle: 'Ticaret & FMT Makina',
    phones: [
      { label: 'Bilal METLİ', number: '0545 479 05 85', tel: '+905454790585' },
      { label: 'Fatih METLİ', number: '0531 345 73 04', tel: '+905313457304' },
      { label: 'Abdullah METLİ', number: '0535 616 49 41', tel: '+905356164941' }
    ],
    emails: [
      'metliticaret@hotmail.com',
      'fatihmakinamuhendislik@hotmail.com'
    ],
    address: {
      tr: 'Adana Kozan Organize Sanayi Bölgesi (OSB), Adana / Türkiye'
    },
    quickLinks: [
      { to: '/', label: { tr: 'Ana Sayfa' } },
      { to: '/about', label: { tr: 'Hakkımızda' } },
      { to: '/products', label: { tr: 'Ürünlerimiz' } },
      { to: '/telli-terbiye', label: { tr: 'Telli Terbiye Sistemi' } },
      { to: '/blog', label: { tr: 'Haberler & Projeler' } },
      { to: '/contact', label: { tr: 'İletişim' } }
    ],
    certificates: ['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6'],
    copyrightText: 'METLİ Ticaret & FMT Makina Mühendislik. Tüm Hakları Saklıdır.',
    legalCompany: 'FMT Makina Mühendislik İth. İhr. San. Tic. Ltd. Şti.'
  });

  const aboutText = resolveLocalizedText(footer.aboutText, language) || t('footer.desc');
  const addressText = resolveLocalizedText(footer.address, language) || t('footer.address');

  return (
    <footer className="bg-secondary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info - METLİ & FMT Yan Yana */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/metlilogo.svg"
                alt="METLİ & FMT"
                className="w-10 h-10 object-contain brightness-0 invert"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-white">METLİ</span>
                  <span className="text-primary-light font-bold">/</span>
                  <span className="font-black text-lg text-primary-light">FMT</span>
                </div>
                <p className="text-xs text-gray-400">{footer.companySubtitle || 'Ticaret & Makina'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{aboutText}</p>
            <div className="flex gap-3">
              <a href={`mailto:${footer.emails?.[0] || 'metliticaret@hotmail.com'}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
              <a href={`tel:${footer.phones?.[0]?.tel || '+905454790585'}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" aria-label="Phone">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary-light">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {(footer.quickLinks || [
                { to: '/', label: { tr: 'Ana Sayfa' } },
                { to: '/about', label: { tr: 'Hakkımızda' } },
                { to: '/products', label: { tr: 'Ürünlerimiz' } },
                { to: '/telli-terbiye', label: { tr: 'Telli Terbiye Sistemi' } },
                { to: '/blog', label: { tr: 'Haberler & Projeler' } },
                { to: '/contact', label: { tr: 'İletişim' } },
              ]).map((link: any, idx: number) => (
                <li key={idx}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-300">
                    {resolveLocalizedText(link.label, language) || link.to}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary-light">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div className="space-y-1">
                  {(footer.phones || []).map((p: any, i: number) => {
                    const num = typeof p === 'string' ? p : (p?.number || p?.tel || '');
                    const label = typeof p === 'object' && p?.label ? p.label : '';
                    const telLink = (typeof p === 'object' && p?.tel ? p.tel : num).replace(/\s+/g, '');
                    if (!num) return null;
                    return (
                      <p key={i} className="leading-snug">
                        <a href={`tel:${telLink}`} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                          <span className="font-semibold text-white tracking-wide">{num}</span>
                          {label ? <span className="text-gray-400 text-xs">({label})</span> : null}
                        </a>
                      </p>
                    );
                  })}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <div className="space-y-0.5">
                  {(footer.emails || []).map((email: string, i: number) => (
                    <p key={i}>
                      <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                    </p>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{addressText}</span>
              </li>
            </ul>
          </div>

          {/* Certificates */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary-light">{t('about.certs')}</h4>
            <div className="space-y-3">
              {(footer.certificates || ['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6']).map((cert: string) => (
                <div key={cert} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <span className="text-sm text-gray-300">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {footer.copyrightText || 'METLİ Ticaret & FMT Makina Mühendislik. Tüm Hakları Saklıdır.'}
          </p>
          <p className="text-xs text-gray-400">
            {footer.legalCompany || 'FMT Makina Mühendislik İth. İhr. San. Tic. Ltd. Şti.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
