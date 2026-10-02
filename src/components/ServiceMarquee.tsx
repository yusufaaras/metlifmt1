import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';

export default function ServiceMarquee() {
  const { language, t } = useLanguage();
  const { getSection } = useData();

  const rawServices = getSection('services_marquee', [
    { tr: 'İl Tarım ve Orman Genel Müdürlüğü' },
    { tr: 'Modern Meyve Bahçesi Telli Terbiye Sistemleri' },
    { tr: 'Dikenli & Jiletli Tel Güvenlik Çözümleri' },
    { tr: 'Helezon & Panel Çit Uygulamaları' },
    { tr: 'Emprenyeli Ahşap Direk Üretimi' },
    { tr: 'Gölgeleme ve Dolu Koruma Fileleri' },
    { tr: 'Sanayi & Fabrika Çevre Güvenliği' },
    { tr: 'Karayolu & Otoyol Çit Sistemleri' }
  ]);

  const services = Array.isArray(rawServices) ? rawServices.map((s: any) => resolveLocalizedText(s, language)) : [];
  const dup = [...services, ...services, ...services];

  return (
    <div className="bg-secondary-dark text-white overflow-hidden border-t border-white/5">
      <div className="py-2.5 text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
        {t('about.services') || 'HİZMET ALANLARIMIZ & UYGULAMALAR'}
      </div>
      <motion.div
        className="flex items-center pb-4 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
      >
        {dup.map((s, i) => (
          <span key={i} className="flex-shrink-0 px-5 md:px-8 text-sm md:text-base font-medium text-white/80 flex items-center gap-5 md:gap-8">
            <span>{s}</span>
            <span className="text-primary-light/40">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
