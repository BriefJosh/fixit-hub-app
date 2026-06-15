import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Ticker from '../components/landing/Ticker'
import ServicesGrid from '../components/landing/ServicesGrid'
import TrustBand from '../components/landing/TrustBand'
import HowItWorks from '../components/landing/HowItWorks'
import MaintenanceLog from '../components/landing/MaintenanceLog'
import CTA from '../components/landing/CTA'

function Landing() {
  return (
    <div className="font-sans text-brand-ink bg-white antialiased">
      <NavBar />
      <Hero />
      <Ticker />
      <ServicesGrid />
      {/* Plan 3 inserts <LiveSection /> here, between Services and Trust */}
      <TrustBand />
      <HowItWorks />
      <MaintenanceLog />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing
