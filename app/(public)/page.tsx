import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import WorkTypes from '@/components/home/WorkTypes'
import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'
import FeaturedArtisans from '@/components/directory/FeaturedArtisans'
import FeaturedArticles from '@/components/blog/FeaturedArticles'
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd'

export const metadata: Metadata = {
  title: "RENOMAG — Rénovation énergétique : trouvez votre artisan RGE et vos aides",
}

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <Stats />
      <HowItWorks />
      <WorkTypes />
      <Features />
      <FeaturedArtisans />
      <Testimonials />
      <FeaturedArticles />
      <CTASection />
    </>
  )
}
