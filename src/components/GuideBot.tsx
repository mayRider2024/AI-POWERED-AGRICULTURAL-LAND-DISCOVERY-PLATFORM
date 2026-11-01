import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, X, Hand } from 'lucide-react';

export interface TourStep {
  id: string;
  targetId?: string; // HTML element id to spotlight
  route: string;
  title: string;
  description: string;
  actionHint?: string;
  autoAction?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  // 1. Home / Explore Feed
  {
    id: 'welcome',
    route: '/home',
    title: '🌾 Step 1: Welcome to LandLens AI',
    description: 'Explore 200 high-fidelity agricultural parcels in Maharashtra (Raigad & Palghar) with exact guntha and acre measurements.',
    actionHint: 'Let\'s start by checking the search bar to locate specific gat numbers.',
  },
  {
    id: 'search-bar',
    targetId: 'home-search-bar',
    route: '/home',
    title: '🔍 Step 2: Instant Keyword & Gat Search',
    description: 'Search parcels by Taluka, Village, or Maharashtra Revenue Gat/Survey Number (e.g. 125/2, R-001).',
    actionHint: 'Notice how the rest of the screen is blurred so you can focus exactly on this step.',
  },
  {
    id: 'district-filter',
    targetId: 'district-selector',
    route: '/home',
    title: '🚩 Step 3: Regional District Filter',
    description: 'Toggle instantly between Raigad (Alibag, Panvel, Pen) and Palghar (Vikramgad, Dahanu, Talasari).',
    actionHint: 'Selecting a district instantly recalculates available farmland listings.',
  },
  {
    id: 'first-card',
    targetId: 'first-property-card',
    route: '/home',
    title: '📋 Step 4: Farmland Parcel Card',
    description: 'Every listing displays asking price, rate per guntha, total acreage, and estimated road distance with explicit demo/unverified compliance badges.',
    actionHint: 'Next, let\'s dive into the interactive GIS Cadastral Map.',
  },

  // 2. Map / GIS Explore
  {
    id: 'explore-map',
    targetId: 'nav-explore',
    route: '/explore',
    title: '🗺️ Step 5: GIS & Cadastral Boundaries',
    description: 'View full-screen vector cadastral maps with district and taluka boundaries, zoom levels, and satellite overlays.',
    actionHint: 'Now let\'s test the conversational AI Assistant for intelligent land discovery.',
  },

  // 3. AI Assistant
  {
    id: 'ai-assistant',
    targetId: 'nav-assistant',
    route: '/assistant',
    title: '🤖 Step 6: Multi-Turn AI Search & Voice',
    description: 'Ask complex constraints in English, Marathi (मराठी), or Hindi (हिन्दी). Try saying "10 acres in Palghar under 15 lakh per guntha, within 100 metres of a road".',
    actionHint: 'Notice the 💬 history button on the header which saves and reopens your past conversations!',
  },

  // 4. Saved Farmlands
  {
    id: 'saved-tab',
    targetId: 'nav-saved',
    route: '/saved',
    title: '❤️ Step 7: Cloud-Synced Saved Farmlands',
    description: 'Bookmark any plot by tapping the heart icon. When logged in, your saved listings synchronize seamlessly with Supabase across your devices.',
    actionHint: 'Finally, let\'s look at your User Profile.',
  },

  // 5. Profile & Settings
  {
    id: 'profile-tab',
    targetId: 'nav-profile',
    route: '/profile',
    title: '👤 Step 8: Profile & Language Preferences',
    description: 'Switch between English, Marathi, and Hindi, manage your preferred district, or sign in to synchronize conversation history.',
    actionHint: 'Tour complete! You can restart the guide anytime using the floating bot button.',
  },
];

const GUIDE_POS_STORAGE_KEY = 'landlens_guide_button_pos';

interface Position {
  x: number;
  y: number;
}

export default function GuideBot() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Floating trigger button state
  const [position, setPosition] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem(GUIDE_POS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    // Default safe initial position: bottom-right above bottom navigation bar
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 68) : 300;
    const defaultY = typeof window !== 'undefined' ? Math.max(80, window.innerHeight - 130) : 600;
    return { x: defaultX, y: defaultY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);

  // Keep button safely inside bounds
  const clampPosition = (x: number, y: number, btnWidth = 52, btnHeight = 52): Position => {
    const vpWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vpHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vpOffsetTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
    const vpOffsetLeft = window.visualViewport ? window.visualViewport.offsetLeft : 0;

    const minX = vpOffsetLeft + 12;
    const maxX = vpOffsetLeft + Math.max(12, vpWidth - btnWidth - 12);
    // On mobile, keep top clearance (safe area) and bottom clearance (above bottom nav ~72px)
    const minY = vpOffsetTop + 16;
    const bottomNavHeight = 76;
    const maxY = vpOffsetTop + Math.max(minY, vpHeight - btnHeight - bottomNavHeight);

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  // Adjust on screen resize or visualViewport changes (keyboard open/close)
  useEffect(() => {
    const handleViewportChange = () => {
      const vv = window.visualViewport;
      const screenH = window.innerHeight;
      const curH = vv ? vv.height : screenH;

      // Keyboard detection: visual viewport height drops significantly (>150px)
      const keyboardActive = screenH - curH > 150;
      setIsKeyboardOpen(keyboardActive);

      setPosition((prev) => {
        const clamped = clampPosition(prev.x, prev.y);
        // If keyboard popped up and button would obstruct the bottom composer
        if (keyboardActive && clamped.y > curH - 120) {
          clamped.y = Math.max(20, curH - 130);
        }
        return clamped;
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

  // Save valid position to localStorage
  useEffect(() => {
    if (!isDragging) {
      try {
        localStorage.setItem(GUIDE_POS_STORAGE_KEY, JSON.stringify(position));
      } catch {
        // ignore storage errors
      }
    }
  }, [position, isDragging]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // primary button only
    e.currentTarget.setPointerCapture(e.pointerId);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    // Movement threshold of 6px to separate click/tap from drag
    if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) > 6) {
      dragStartRef.current.hasMoved = true;
      setIsDragging(true);
    }

    if (dragStartRef.current.hasMoved) {
      const nextX = dragStartRef.current.initialX + dx;
      const nextY = dragStartRef.current.initialY + dy;
      setPosition(clampPosition(nextX, nextY));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const wasDragging = dragStartRef.current.hasMoved;
    dragStartRef.current = null;

    if (wasDragging) {
      setIsDragging(false);
    } else {
      // Clean tap/click: open guide
      setIsActive(true);
      setStepIndex(0);
    }
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
    setIsDragging(false);
  };

  const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];

  // Auto-prompt on first open if user hasn't completed tour
  useEffect(() => {
    const hasSeenInteractiveTour = localStorage.getItem('landlens_tour_completed');
    if (!hasSeenInteractiveTour && location.pathname === '/home') {
      const timer = setTimeout(() => setIsActive(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync route and locate spotlight element
  useEffect(() => {
    if (!isActive) {
      setTargetRect(null);
      return;
    }

    // Auto-navigate to step's route if different
    if (location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }

    const updateRect = () => {
      if (currentStep.targetId) {
        const el = document.getElementById(currentStep.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          return;
        }
      }
      setTargetRect(null);
    };

    const timer = setTimeout(updateRect, 300);
    window.addEventListener('resize', updateRect);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
    };
  }, [isActive, stepIndex, location.pathname]);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem('landlens_tour_completed', 'true');
    setTargetRect(null);
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────
          Draggable Floating Bot Trigger Button
          - Compact circular 48px touch target by default
          - Supports smooth pointer dragging across entire viewport
          - Persists coordinates in localStorage
          - Prevents overlap with keyboard or bottom composer
      ────────────────────────────────────────────────── */}
      {!isActive && (
        <div
          ref={buttonRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: 'none',
          }}
          className={`z-50 select-none cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? 'scale-110 shadow-2xl opacity-90' : 'hover:scale-105 shadow-xl'
          }`}
        >
          <div
            className={`flex items-center bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white border-2 border-white rounded-full transition-all duration-200 overflow-hidden ${
              isExpanded && !isKeyboardOpen
                ? 'px-3 py-2 gap-2 shadow-2xl'
                : 'w-12 h-12 justify-center shadow-lg'
            }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            aria-label="Interactive Guide"
            role="button"
            tabIndex={0}
          >
            <span className="text-xl leading-none flex items-center justify-center">🤖</span>
            {isExpanded && !isKeyboardOpen && (
              <span className="text-xs font-black tracking-tight whitespace-nowrap pr-1 animate-in fade-in duration-150">
                Interactive Guide
              </span>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────
          Spotlight & Focus Backdrop Overlay
          Uses transparent cutout so spotlighted element is 100% sharp
          while blurring and darkening everything else.
      ────────────────────────────────────────────────── */}
      {isActive && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          {/* If there is no target element, blur/dim the entire screen */}
          {!targetRect && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
          )}

          {/* If there IS a target element, render 4 blurred perimeter panels around the cutout so the cutout itself has ZERO blur and ZERO overlay */}
          {targetRect && (
            <>
              {/* Top blurred panel */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${Math.max(0, targetRect.top - 8)}px`,
                }}
                className="bg-black/65 backdrop-blur-md pointer-events-auto"
              />

              {/* Bottom blurred panel */}
              <div
                style={{
                  position: 'fixed',
                  top: `${targetRect.bottom + 8}px`,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                className="bg-black/65 backdrop-blur-md pointer-events-auto"
              />

              {/* Left blurred panel */}
              <div
                style={{
                  position: 'fixed',
                  top: `${Math.max(0, targetRect.top - 8)}px`,
                  left: 0,
                  width: `${Math.max(0, targetRect.left - 8)}px`,
                  height: `${targetRect.height + 16}px`,
                }}
                className="bg-black/65 backdrop-blur-md pointer-events-auto"
              />

              {/* Right blurred panel */}
              <div
                style={{
                  position: 'fixed',
                  top: `${Math.max(0, targetRect.top - 8)}px`,
                  left: `${targetRect.right + 8}px`,
                  right: 0,
                  height: `${targetRect.height + 16}px`,
                }}
                className="bg-black/65 backdrop-blur-md pointer-events-auto"
              />

              {/* Spotlight Frame / Focus Border (completely hollow inside so target element is 100% crisp) */}
              <div
                style={{
                  position: 'fixed',
                  top: `${Math.max(0, targetRect.top - 8)}px`,
                  left: `${Math.max(0, targetRect.left - 8)}px`,
                  width: `${targetRect.width + 16}px`,
                  height: `${targetRect.height + 16}px`,
                  pointerEvents: 'none',
                }}
                className="rounded-2xl border-4 border-[#E86A17] ring-4 ring-[#FF9A3C]/50 transition-all duration-300 animate-pulse bg-transparent shadow-[0_0_25px_rgba(232,106,23,0.4)]"
              >
                {/* Pointer Indicator Arrow */}
                <div className="absolute -top-3.5 left-6 bg-[#E86A17] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg pointer-events-none">
                  <Hand size={11} className="rotate-180" />
                  <span>Focus Here</span>
                </div>
              </div>
            </>
          )}

          {/* Floating Interactive Guide Card (placed strategically so it never blocks the spotlight) */}
          <div
            className={`fixed left-4 right-4 z-[51] transition-all duration-300 ${
              targetRect && targetRect.top < window.innerHeight / 2
                ? 'bottom-6' // If target is in top half, show card at bottom
                : 'top-6' // If target is in bottom half or none, show card at top
            }`}
          >
            <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#E86A17] p-4 text-[#25211E] space-y-3.5">
              {/* Card Header with Step Progress */}
              <div className="flex items-center justify-between border-b border-orange-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E86A17] to-[#C54E12] flex items-center justify-center text-white text-base shadow-sm">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#C54E12] uppercase tracking-wider">
                      Interactive Guide Bot
                    </h3>
                    <p className="text-[11px] text-gray-500 font-semibold">
                      Step {stepIndex + 1} of {TOUR_STEPS.length}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Close Guide"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Step Info */}
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-sm sm:text-base text-[#25211E] leading-snug">
                  {currentStep.title}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">
                  {currentStep.description}
                </p>
                {currentStep.actionHint && (
                  <div className="mt-2.5 p-2.5 bg-orange-50 border border-orange-200/80 rounded-xl text-xs text-[#C54E12] font-semibold flex items-center gap-2">
                    <span className="text-sm">👉</span>
                    <span>{currentStep.actionHint}</span>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all"
                >
                  <ChevronLeft size={14} />
                  <span>Back</span>
                </button>

                <div className="flex gap-1.5 items-center">
                  {TOUR_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === stepIndex
                          ? 'w-5 bg-[#E86A17]'
                          : 'w-1.5 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-[#E86A17] hover:bg-[#C54E12] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>{stepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
