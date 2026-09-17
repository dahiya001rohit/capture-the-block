import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { BoardPage } from './pages/BoardPage';
import { AboutPage } from './pages/AboutPage';
import { useSocket } from './state/useSocket';
import { useNotice } from './state/notice';

export const App = () => {
  useSocket();
  const notice = useNotice((state) => state.notice);
  const setNotice = useNotice((state) => state.setNotice);

  return (
    <BrowserRouter>
      {notice && (
        <div className="fixed inset-x-0 top-0 z-[60] flex h-14 min-[650px]:h-8 items-center justify-center bg-[#FFC93C] px-10 text-center font-mono text-[11px] text-black">
          <span>
            Live demo server is sleeping — free-tier hosting suspended the service. The UI is fully
            browsable; claims won't sync.
          </span>
          <button
            onClick={() => setNotice(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 px-1 text-sm leading-none text-black/60 hover:text-black"
          >
            ×
          </button>
        </div>
      )}
      <div className={notice ? 'pt-14 min-[650px]:pt-8' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
