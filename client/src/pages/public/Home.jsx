import Hero from '../../components/public/Hero';
import HomeAboutSection from '../../components/public/HomeAboutSection';
import VisualDisciplinesSection from '../../components/public/VisualDisciplinesSection';
import VisualFacilitySection from '../../components/public/VisualFacilitySection';
import VisualMembershipSection from '../../components/public/VisualMembershipSection';
import VisualGalleryStrip from '../../components/public/VisualGalleryStrip';
import VisualCTASection from '../../components/public/VisualCTASection';

/**
 * Home — Clean, Visual-First Public Website for Lee Gym.
 * Driven by real imagery, bold typography, athletic styling, and zero fluff.
 * Target Flow:
 * 1. Hero (TRAIN HARD. LIVE STRONG. + Single JOIN NOW CTA)
 * 2. Gym Intro / About
 * 3. Core Disciplines / Programs
 * 4. Facility Architecture
 * 5. Membership Access
 * 6. Visual Gallery Strip
 * 7. High-Energy Closing CTA Banner
 */
function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Gym Intro / About */}
      <HomeAboutSection />

      {/* 3. Programs / Core Disciplines */}
      <VisualDisciplinesSection />

      {/* 4. Facility Architecture */}
      <VisualFacilitySection />

      {/* 6. Membership Access */}
      <VisualMembershipSection />

      {/* 7. Gallery Wall */}
      <VisualGalleryStrip />

      {/* 8. Closing CTA Banner */}
      <VisualCTASection />
    </>
  );
}

export default Home;
