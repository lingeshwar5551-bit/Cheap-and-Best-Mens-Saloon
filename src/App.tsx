import React, { useState } from 'react';
import { Background3D } from './components/Background3D';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { VideoSection } from './components/VideoSection';
import { SocialSection } from './components/SocialSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { BookingSection } from './components/BookingSection';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SalonConcierge } from './components/SalonConcierge';
import { SalonConfigProvider } from './context/SalonConfigContext';
import { EditShopNameModal } from './components/EditShopNameModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Haircut');

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <SalonConfigProvider>
      <AuthProvider>
        <div className="relative min-h-screen bg-[#07090b] text-slate-100 selection:bg-[#d4ff32] selection:text-black">
          {/* 3D Background Canvas & Particle Streaks */}
          <Background3D />

          {/* Sticky Floating Navbar */}
          <Navbar onOpenBooking={() => handleOpenBooking()} />

          {/* Main Content Sections */}
          <main className="relative z-10">
            {/* Cinematic Hero with Signature Barber Game Simulator */}
            <Hero onOpenBooking={() => handleOpenBooking()} />

            {/* All 11 Salon Services */}
            <ServicesSection onSelectService={(srv) => handleOpenBooking(srv)} />

            {/* Real Salon Media Gallery (The 4 Supplied Images) */}
            <GallerySection />

            {/* Cinematic Video Walkthrough Player */}
            <VideoSection />

            {/* Community & The 5th Supplied 3D Insignia Visual */}
            <SocialSection />

            {/* Real Patron Reviews & 4.9 Rating */}
            <ReviewsSection />

            {/* Premium Location Section with Google Maps Experience */}
            <LocationSection />

            {/* Booking CTA & Studio Location Details */}
            <BookingSection onOpenBooking={() => handleOpenBooking()} />
          </main>

          {/* Clean Footer */}
          <Footer onOpenBooking={() => handleOpenBooking()} />

          {/* Direct Online Booking Modal */}
          <BookingModal
            isOpen={isBookingOpen}
            onClose={handleCloseBooking}
            preselectedService={selectedService}
          />

          {/* Premium Authentication Modal */}
          <AuthModal />

          {/* Customer Dashboard Drawer / Modal */}
          <CustomerDashboard onOpenBooking={() => handleOpenBooking()} />

          {/* Gemini AI Salon Concierge with Voice & Google Maps Grounding */}
          <SalonConcierge onOpenBooking={() => handleOpenBooking()} />

          {/* Quick Shop Name & Branding Customizer Modal */}
          <EditShopNameModal />
        </div>
      </AuthProvider>
    </SalonConfigProvider>
  );
}
