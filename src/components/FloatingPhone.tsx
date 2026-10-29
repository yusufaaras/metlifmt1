import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { formatTelLink, formatWhatsAppLink } from '@/utils/phone';

export default function FloatingPhone() {
  const [open, setOpen] = useState(false);
  const { getSection } = useData();

  const footer = getSection('footer_settings', {});

  const phones = Array.isArray(footer.phones) && footer.phones.length > 0
    ? footer.phones.map((p: any) => ({
        name: p.label || p.name || 'Yetkili',
        phone: p.number || p.phone || '',
        tel: formatTelLink(p.tel || p.number || p.phone || ''),
        whatsapp: formatWhatsAppLink(
          p.whatsapp || p.number || p.phone || '',
          `Merhaba ${p.label || p.name || 'METLİ'}, web siteniz üzerinden bilgi almak istiyorum.`
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
          role: 'Kurucu'
        },
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Phone & WhatsApp list popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-2 w-80 max-w-[calc(100vw-2rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-sm font-bold leading-tight">📞 Bizi Arayın & WhatsApp</p>
                  <p className="text-[11px] text-white/80">Yetkililerimizle doğrudan görüşün</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white text-xs"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            {/* Contact list */}
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {phones.map((p, i) => (
                <div
                  key={i}
                  className="p-3.5 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-3 group"
                >
                  {/* Left: Contact info (clicking dials the phone) */}
                  <a
                    href={p.tel}
                    className="flex-1 min-w-0"
                    title={`${p.name} - ${p.phone} Ara`}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-secondary-dark group-hover:text-primary transition-colors truncate">
                        {p.name}
                      </p>
                      {p.role && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                          {p.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide mt-0.5 font-mono">
                      {p.phone}
                    </p>
                  </a>

                  {/* Right: Quick Action Buttons (Call & WhatsApp) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Call Button */}
                    <a
                      href={p.tel}
                      title={`${p.name} Ara`}
                      className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={p.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${p.name} WhatsApp'tan Yaz`}
                      className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.954 2.801.954l.003-.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.776-5.766zm-12.031 5.766c0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12s-5.373-12-12-12c-6.627 0-12 5.373-12 12zm18 0c0 3.309-2.691 6-6 6-.975 0-1.895-.233-2.709-.646l-4.291 1.124 1.144-4.184c-.454-.834-.712-1.787-.712-2.801 0-3.309 2.691-6 6-6s6 2.691 6 6z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info banner */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>📍 Kozan OSB, Adana</span>
              <span className="font-semibold text-primary">METLİ & FMT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center hover:shadow-2xl relative group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? { rotate: 135 } : { rotate: 0 }}
        transition={{ duration: 0.25 }}
        aria-label="Telefon ve WhatsApp İletişim"
        title="Bizi Arayın & WhatsApp"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        )}
      </motion.button>

      {/* Pulse ring animation when closed */}
      {!open && (
        <div className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none -z-10">
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        </div>
      )}
    </div>
  );
}
