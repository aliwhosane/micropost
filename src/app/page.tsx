import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { LandingPageContent } from "@/components/home/LandingPageContent";

export default function Home() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Micropost AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": siteConfig.description,
    "featureList": "AI Content Generation, Viral Frameworks (PAS, AIDA), AI Image Generation, Threads Scheduling, Social Media Scheduling, Post Analytics, Bio Optimization",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Micropost AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Micropost AI is an advanced ghostwriting tool that learns your personal writing style to generate high-quality social media posts for Twitter and LinkedIn automatically."
        }
      },
      {
        "@type": "Question",
        "name": "does Micropost AI work for LinkedIn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Micropost AI is specifically tuned to create professional, engaging content for LinkedIn, complete with proper formatting and tone analysis."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      {/* Navbar */}
      <Navbar />

      <LandingPageContent />

      <Footer />
    </div>
  );
}
