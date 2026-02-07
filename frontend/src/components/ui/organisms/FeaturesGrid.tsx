import { Zap, Shield, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useTranslation, Trans } from "react-i18next";
import { ResourceIllustration, CapacityIllustration, DeveloperIllustration } from "../../Illustrations";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  illustration: React.ReactNode;
  align?: "left" | "right";
  tags: string[];
  subtitle: string;
  tagline: string;
}

function FeatureCard({ icon, title, description, illustration, align = "left", tags, subtitle, tagline }: FeatureProps) {
  const isRight = align === "right";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex flex-col ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-12 lg:py-24`}
    >
      {/* Text Content */}
      <div className="flex-1 space-y-6 w-full text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          {icon}
          <span>{title}</span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {subtitle} 
          <span className="block text-zinc-500 text-2xl md:text-3xl mt-2 font-normal">
            {tagline}
          </span>
        </h3>
        
        <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 pt-4">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-400 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Illustration */}
      <div className="flex-1 w-full">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-[#0F0F0F] rounded-2xl border border-zinc-800 p-2 shadow-2xl overflow-hidden">
            <div className="bg-[#161616] rounded-xl overflow-hidden">
              {illustration}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturesGrid() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-[#0F0F0F] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            <Trans i18nKey="features.header.title" components={{ 1: <span className="text-emerald-400" />, 3: <span className="text-blue-400" /> }} />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400"
          >
            {t('features.header.subtitle')}
          </motion.p>
        </div>

        <div className="space-y-12 md:space-y-0">
          <FeatureCard 
            icon={<Zap size={16} className="text-blue-400" />}
            title={t('features.cards.resource.title')}
            subtitle={t('features.cards.resource.subtitle')}
            tagline={t('features.cards.resource.tagline')}
            description={t('features.cards.resource.description')}
            illustration={<ResourceIllustration />}
            align="left"
            tags={t('features.cards.resource.tags', { returnObjects: true }) as string[]}
          />
          
          <FeatureCard 
            icon={<Shield size={16} className="text-emerald-400" />}
            title={t('features.cards.capacity.title')}
            subtitle={t('features.cards.capacity.subtitle')}
            tagline={t('features.cards.capacity.tagline')}
            description={t('features.cards.capacity.description')}
            illustration={<CapacityIllustration />}
            align="right"
            tags={t('features.cards.capacity.tags', { returnObjects: true }) as string[]}
          />
          
          <FeatureCard 
            icon={<Code2 size={16} className="text-purple-400" />}
            title={t('features.cards.dx.title')}
            subtitle={t('features.cards.dx.subtitle')}
            tagline={t('features.cards.dx.tagline')}
            description={t('features.cards.dx.description')}
            illustration={<DeveloperIllustration />}
            align="left"
            tags={t('features.cards.dx.tags', { returnObjects: true }) as string[]}
          />
        </div>
        
        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <Link to="/docs" className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors">
            {t('features.cta')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
