import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/dashboard/HeroSection'
import QuickCategories from '../components/dashboard/QuickCategories'
import MyAppliances from '../components/dashboard/MyAppliances'
import UpcomingBooking from '../components/dashboard/UpcomingBooking'
import AIPromo from '../components/dashboard/AIPromo'
import RecommendedTechnicians from '../components/dashboard/RecommendedTechnicians'

function Dashboard() {
  return (
    <div className="font-sans text-brand-ink bg-white antialiased min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-mint-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <HeroSection />
          <QuickCategories />
          <div className="grid lg:grid-cols-3 gap-6">
            <MyAppliances />
            <div className="space-y-6">
              <UpcomingBooking />
              <AIPromo />
            </div>
          </div>
          <RecommendedTechnicians />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
