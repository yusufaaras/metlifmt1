import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';

export default function ServiceMarquee() {
  const { language, t } = useLanguage();
  const { getSection } = useData();

  const rawServices = getSection('services_marquee', [
    { tr: 'İl Tarım ve Orman Genel Müdürlüğü', en: 'Provincial Directorate of Agriculture and Forestry', es: 'Dirección Provincial de Agricultura y Bosques', ru: 'Провинциальное управление сельского и лесного хозяйства' },
    { tr: 'Modern Meyve Bahçesi Telli Terbiye Sistemleri', en: 'Modern Orchard Trellis Systems', es: 'Sistemas de Espaldera para Frutales', ru: 'Современные шпалерные системы' },
    { tr: 'Dikenli & Jiletli Tel Güvenlik Çözümleri', en: 'Barbed & Razor Wire Security Solutions', es: 'Soluciones de Seguridad de Alambre', ru: 'Системы безопасности из колючей проволоки' },
    { tr: 'Helezon & Panel Çit Uygulamaları', en: 'Chain Link & Panel Fence Applications', es: 'Aplicaciones de Malla y Valla', ru: 'Рулонные и панельные ограждения' },
    { tr: 'Emprenyeli Ahşap Direk Üretimi', en: 'Impregnated Wooden Post Production', es: 'Producción de Postes de Madera Impregnada', ru: 'Производство импрегнированных столбов' },
    { tr: 'Gölgeleme ve Dolu Koruma Fileleri', en: 'Shade & Hail Protection Netting', es: 'Mallas de Sombra y Antigranizo', ru: 'Защитные сетки от града и солнца' },
    { tr: 'Sanayi & Fabrika Çevre Güvenliği', en: 'Industrial & Factory Perimeter Security', es: 'Seguridad Perimetral Industrial', ru: 'Периметральная безопасность заводов' },
    { tr: 'Karayolu & Otoyol Çit Sistemleri', en: 'Highway & Roadside Fence Systems', es: 'Sistemas de Vallas para Carreteras', ru: 'Дорожные ограждения' }
  ]);

  const defaultIcons = ['🏛️', '🌱', '🛡️', '🏗️', '🪵', '☀️', '🏭', '🛣️'];

  const services = Array.isArray(rawServices)
    ? rawServices
        .map((s: any, idx: number) => {
          const icon = (s && typeof s === 'object' && s.icon) ? s.icon : defaultIcons[idx % defaultIcons.length];
          const text = resolveLocalizedText(s?.name || s?.title || s?.text || s, language);
          return { icon, text };
        })
        .filter(s => s.text)
    : [];

  // 4x duplicate for continuous seamless fast flow
  const dup = [...services, ...services, ...services, ...services];

  if (services.length === 0) return null;

  return (
    <section aria-label="Hizmet Alanlarımız" className="relative bg-gradient-to-b from-[#0a1120] via-[#0f1a30] to-[#0a1120] text-white overflow-hidden border-t-2 border-primary/30 border-b border-white/10 shadow-lg py-5 md:py-6">
      {/* Top glowing accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-90" />

      {/* Prominent header badge */}
      <div className="flex items-center justify-center mb-3.5 px-4 relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/25 border border-primary/50 shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
          <span className="text-[11px] md:text-xs font-bold tracking-widest text-primary-light uppercase">
            {t('about.services') || 'HİZMET ALANLARIMIZ & FAALİYETLERİMİZ'}
          </span>
        </div>
      </div>

      {/* Edge gradient fade masks */}
      <div className="absolute top-0 bottom-0 left-0 w-16 md:w-36 bg-gradient-to-r from-[#0a1120] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-16 md:w-36 bg-gradient-to-l from-[#0a1120] to-transparent pointer-events-none z-10" />

      {/* Fast & smooth gliding marquee */}
      <div className="relative overflow-hidden w-full">
        <motion.div
          className="flex items-center gap-3 md:gap-4 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 13, repeat: Infinity }}
        >
          {dup.map((s, i) => (
            <div
              key={i}
              className="flex-shrink-0 inline-flex items-center gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-primary/50 backdrop-blur-sm shadow-xs transition-colors"
            >
              {s.icon && (
                <span className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary/20 text-xs md:text-sm border border-primary/30 flex-shrink-0">
                  {s.icon}
                </span>
              )}
              <span className="text-xs md:text-sm font-semibold text-white tracking-wide">
                {s.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

