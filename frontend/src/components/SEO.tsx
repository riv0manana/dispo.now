import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export function SEO({ 
  title = "dispo.now | The Self-Hosted Booking Infrastructure", 
  description = "Stop paying the SaaS tax. The open-source, ACID-compliant booking infrastructure for developers. Own your data, scale unlimitedly, and eliminate race conditions.",
  keywords = ["booking infrastructure", "self-hosted booking", "open source scheduling", "acid transactions", "booking api", "capacity management", "developer tools"],
  canonicalUrl = "https://dispo-now.riv0manana.dev"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/og-image.png" />
    </Helmet>
  );
}
