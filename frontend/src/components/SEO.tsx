import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  alternates?: { lang: string; href: string }[];
}

export function SEO({ 
  title, 
  description, 
  keywords,
  canonicalUrl = "https://dispo-now.riv0manana.dev",
  alternates = [
    { lang: 'en', href: 'https://dispo-now.riv0manana.dev' },
    { lang: 'fr', href: 'https://dispo-now.riv0manana.dev?lng=fr' },
    { lang: 'x-default', href: 'https://dispo-now.riv0manana.dev' }
  ]
}: SEOProps) {
  const { t, i18n } = useTranslation();
  
  const finalTitle = title || t('seo.title');
  const finalDescription = description || t('seo.description');
  const finalKeywords = keywords || [
    "booking infrastructure", 
    "self-hosted booking", 
    "open source scheduling", 
    "acid transactions", 
    "booking api", 
    "capacity management", 
    "developer tools"
  ];

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages for SEO */}
      {alternates.map((alt) => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.href} />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:locale" content={i18n.language} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content="/og-image.png" />
    </Helmet>
  );
}
