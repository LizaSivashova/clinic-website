import AmbientOrbs from '../components/AmbientOrbs';
import Particles from '../components/Particles';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Specialties from '../components/Specialties';
import Timeline from '../components/Timeline';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AccessibilityBar from '../components/AccessibilityBar';

export default function LandingPage() {
  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 80% -10%, #f7f0e2 0%, #f1e9da 45%, #ece2cf 100%)',
      }}
    >
      <AmbientOrbs />
      <Particles />
      <Navbar />
      <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Specialties />
        <Timeline />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppButton />
      <AccessibilityBar />
    </div>
  );
}
