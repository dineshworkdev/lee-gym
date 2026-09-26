import { useState } from 'react';
import AppRoutes from './routes/index.jsx';
import LeeGymLoadingScreen from './components/LeeGymLoadingScreen.jsx';
import { OwnerGymProvider } from './context/OwnerGymContext.jsx';

// Only show the loading screen once per browser session
const SESSION_KEY = 'lee-gym-intro-seen';
const hasSeenIntro = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};
const markIntroSeen = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // ignore
  }
};

function App() {
  const [showLoader, setShowLoader] = useState(!hasSeenIntro());

  const handleLoadDone = () => {
    markIntroSeen();
    setShowLoader(false);
  };

  return (
    <OwnerGymProvider>
      {/* Site always renders underneath — no white flash when loader exits */}
      <AppRoutes />
      {showLoader && <LeeGymLoadingScreen onDone={handleLoadDone} />}
    </OwnerGymProvider>
  );
}

export default App;

