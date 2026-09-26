import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC =
  "https://lottie.host/63034916-2306-477f-952b-7fcf871af372/UfJVE1ysAP.lottie";

// Target timing (total duration ~2.00s)
const ANIMATION_DURATION_MS = 1850;
const SAFETY_FALLBACK_MS = 3500;

/**
 * LeeGymLoadingScreen - 2-Second Athletic Branded Opening Animation
 *
 * Requirements:
 * 1. Background: Exact same pure white (#FFFFFF) as the Lottie artwork.
 *    Single continuous canvas - no white box, no cream border, no iframe container look.
 * 2. Typography: Heavy, bold, powerful Bebas Neue with WebkitTextStroke for true athletic mass.
 * 3. Dumbbell + LEE GYM animate TOGETHER at 0.00s as one choreographed identity.
 *    - 0.00-0.45s: Strong coordinated entrance with controlled kinetic lift.
 *    - 0.45-1.35s: Mechanical energy and subtle dampening while internal plates rotate.
 *    - 1.35-1.75s: Firm mechanical settling into final locked position.
 *    - 1.75-1.85s: Short hold.
 * 4. Exit: Rapid, athletic upward shutter sweep (translateY: 0 -> -100%) revealing the website.
 *    The website is already rendered underneath - zero blank frames, zero flashes.
 *
 * Mobile Layering Fix:
 * - Wordmark has position: relative, zIndex: 10 so it always stacks above the Lottie layer.
 * - On mobile (<= 768px), marginTop is 0.15rem so the Lottie container does not collide with or cover the wordmark.
 * - Desktop/tablet (> 768px) layout and negative margin remain completely unchanged.
 */
function LeeGymLoadingScreen({ onDone }) {
  const shouldReduce = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isGone, setIsGone] = useState(false);
  const [dotLottie, setDotLottie] = useState(null);

  const exitCalledRef = useRef(false);

  const triggerExit = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;
    setIsExiting(true);
  }, []);

  // Listen for DotLottie completion
  useEffect(() => {
    if (!dotLottie) return;
    const onComplete = () => {
      triggerExit();
    };
    dotLottie.addEventListener("complete", onComplete);
    return () => {
      dotLottie.removeEventListener("complete", onComplete);
    };
  }, [dotLottie, triggerExit]);

  // Precise timing trigger at ~1.85s
  useEffect(() => {
    const timer = setTimeout(triggerExit, ANIMATION_DURATION_MS);
    const safety = setTimeout(triggerExit, SAFETY_FALLBACK_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
    };
  }, [triggerExit]);

  const handleExitComplete = () => {
    setIsGone(true);
    onDone?.();
  };

  if (isGone) return null;

  // --- Shutter Exit Transition ---------------------------------------------
  // Reduced motion: crisp opacity fade
  // Full motion: athletic high-speed upward curtain sweep ([0.76, 0, 0.24, 1])
  const screenVariants = shouldReduce
    ? {
        initial: { opacity: 1 },
        exit: {
          opacity: 0,
          transition: { duration: 0.3, ease: "easeInOut" },
        },
      }
    : {
        initial: { y: 0 },
        exit: {
          y: "-100%",
          transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1] },
        },
      };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          key="lee-gym-loader"
          variants={screenVariants}
          initial="initial"
          exit="exit"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Scoped CSS for responsive wordmark margin and stacking */}
          <style>{`
            .lee-loader-wordmark {
              margin-top: clamp(-1.2rem, -2.5vw, -0.6rem);
            }
            @media (max-width: 768px) {
              .lee-loader-wordmark {
                margin-top: 0.15rem !important;
              }
            }
          `}</style>

          {/* Centered Lockup Composition (Dumbbell + LEE GYM) */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              userSelect: "none",
            }}
            exit={
              shouldReduce
                ? {}
                : {
                    y: -35,
                    opacity: 0.9,
                    transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                  }
            }
          >
            {/* -- 1. DUMBBELL ANIMATION CONTAINER --------------------------- */}
            {/* Synchronized kinetic entrance + mechanical settling */}
            <motion.div
              initial={
                shouldReduce
                  ? { opacity: 1 }
                  : { opacity: 0, y: 36, scale: 0.88, rotate: -4 }
              }
              animate={
                shouldReduce
                  ? { opacity: 1 }
                  : {
                      opacity: [0, 1, 1, 1],
                      y: [36, -6, 2, 0],
                      scale: [0.88, 1.03, 0.995, 1],
                      rotate: [-4, 0.8, -0.2, 0],
                    }
              }
              transition={
                shouldReduce
                  ? {}
                  : {
                      duration: 1.7,
                      times: [0, 0.32, 0.72, 1],
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              style={{
                width: "clamp(200px, 36vw, 320px)",
                height: "clamp(180px, 32vw, 290px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
                position: "relative",
                zIndex: 1,
              }}
            >
              <DotLottieReact
                src={LOTTIE_SRC}
                autoplay
                loop={false}
                speed={1.18}
                backgroundColor="#FFFFFF"
                dotLottieRefCallback={setDotLottie}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </motion.div>

            {/* -- 2. LEE GYM WORDMARK --------------------------------------- */}
            {/* Tight visual proximity with dumbbell; bold, heavy, athletic weight */}
            {/* Guaranteed stacking above Lottie layer on mobile & desktop */}
            <div
              className="lee-loader-wordmark"
              style={{
                overflow: "hidden",
                lineHeight: 1,
                padding: "0.2rem 0.6rem 0.4rem",
                position: "relative",
                zIndex: 10,
              }}
              aria-label="Lee Gym"
            >
              <div
                style={{
                  fontFamily:
                    '"Bebas Neue", "Impact", -apple-system, sans-serif',
                  fontSize: "clamp(3.8rem, 11.5vw, 7.6rem)",
                  fontWeight: 900,
                  WebkitTextStroke: "clamp(1.4px, 0.3vw, 2.8px) currentColor",
                  textRendering: "geometricPrecision",
                  lineHeight: 0.92,
                  letterSpacing: "0.04em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.28em",
                }}
              >
                {/* "LEE" (#252A2E) - Masked directional upward punch + mechanical settle */}
                <motion.span
                  initial={
                    shouldReduce
                      ? { opacity: 1 }
                      : { y: "115%", opacity: 0 }
                  }
                  animate={
                    shouldReduce
                      ? { opacity: 1 }
                      : {
                          y: ["115%", "-7%", "2%", "0%"],
                          opacity: [0, 1, 1, 1],
                        }
                  }
                  transition={
                    shouldReduce
                      ? {}
                      : {
                          duration: 1.6,
                          times: [0, 0.3, 0.7, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  style={{
                    color: "#252A2E",
                    display: "inline-block",
                    transformOrigin: "bottom center",
                  }}
                >
                  LEE
                </motion.span>

                {/* "GYM" (#F4C400) - Coordinated micro-staggered lockup (0.06s offset) */}
                <motion.span
                  initial={
                    shouldReduce
                      ? { opacity: 1 }
                      : { y: "115%", opacity: 0 }
                  }
                  animate={
                    shouldReduce
                      ? { opacity: 1 }
                      : {
                          y: ["115%", "-7%", "2%", "0%"],
                          opacity: [0, 1, 1, 1],
                        }
                  }
                  transition={
                    shouldReduce
                      ? {}
                      : {
                          duration: 1.6,
                          delay: 0.06,
                          times: [0, 0.3, 0.7, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  style={{
                    color: "#F4C400",
                    display: "inline-block",
                    transformOrigin: "bottom center",
                  }}
                >
                  GYM
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LeeGymLoadingScreen;
