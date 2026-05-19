import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ServiceMarquee() {
  const { t } = useLanguage();

  const services = [
    t('about.service1'), t('about.service2'), t('about.service3'),
    t('about.service4'), t('about.service5'), t('about.service6'),
  ];
  const dup = [...services, ...services, ...services];

  return (
    <div className="bg-secondary-dark text-white overflow-hidden">
      <div className="py-2.5 text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
        {t('about.services')}
      </div>
      <motion.div
        className="flex items-center pb-4 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
      >
        {dup.map((s, i) => (
          <span key={i} className="flex-shrink-0 px-5 md:px-8 text-sm md:text-base font-medium text-white/70">
            {s}
            <span className="ml-5 md:ml-8 text-white/15">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
