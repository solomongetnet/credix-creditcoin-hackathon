"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import LoginView from "./login-view";
import SignupView from "./signup-view";
import { BrandName } from "@/components/shared/brand-name";
import { authClient } from "@/lib/auth-client";
import Footer from "@/components/footer";

const gifCovers = [
  "https://giffiles.alphacoders.com/132/13267.gif",
  "https://media1.giphy.com/media/WZuGWpHtzHBoA/source.gif",
  "https://64.media.tumblr.com/8b0a8c34abfe5a99c3ebfa6f2e3535a2/1c0b164aa9a2f645-ef/s500x750/62b280e55c00ccddb527754f6ec71d5eb5fb8beb.gifv",
  "https://i.redd.it/g60gx41x1jaf1.gif",
  "https://gifsec.com/wp-content/uploads/2022/10/anime-sad-gif-29.gif",
  "https://i.pinimg.com/originals/9f/ae/e6/9faee64844d1479b2ee24fc4124e9827.gif",
  "https://i.pinimg.com/originals/1c/04/20/1c0420d2724872f9701aee8d2d064a77.gif",
  "https://giffiles.alphacoders.com/199/199821.gif",
  "https://i.pinimg.com/originals/93/00/bb/9300bb0fe7b968b4e94c01b1932cbcbb.gif",
];

export default function HomePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  /* ---------- pick random GIF *before* first paint ---------- */
  const randomIndex = Math.floor(Math.random() * gifCovers.length);
  const [currentGif] = useState(() => {
    return gifCovers[randomIndex];
    // Generate random index
  });

  /* Preload current and next GIF for fast loading */
  useEffect(() => {
    // Preload current GIF
    const currentImage = new Image();
    currentImage.onload = () => setIsImageLoaded(true);
    currentImage.src = currentGif;

    // Preload next GIF for future use
    const preloadNext = new Image();
    const currentIndex = gifCovers.indexOf(currentGif);
    const nextIndex = (currentIndex + 1) % gifCovers.length;
    preloadNext.src = gifCovers[nextIndex];

    // Preload previous GIF as well for better UX
    const preloadPrev = new Image();
    const prevIndex =
      currentIndex === 0 ? gifCovers.length - 1 : currentIndex - 1;
    preloadPrev.src = gifCovers[prevIndex];
  }, [currentGif]);

  const [isLogin, setIsLogin] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate distance from center (-1 to 1 range)
      const distX = (mouseX - centerX) / centerX;
      const distY = (mouseY - centerY) / centerY;

      // Clamp values and apply smooth movement (max 15px offset)
      const offsetX = Math.max(-15, Math.min(15, distX * 15));
      const offsetY = Math.max(-15, Math.min(15, distY * 15));

      setMousePosition({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoogleLogin = async () => {
    // Mock Google login
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <>
      <div
        className="min-h-[100dvh] grid place-content-center outline-hidden"
        ref={containerRef}
      >
        {/* Header */}
        <header className="z-30 fixed top-0 right-0 left-0 flex items-center justify-between p-4 lg:p-6">
          <BrandName className="text-lg md:text-2xl font-medium" />
          <div className="">
            <Footer className={"p-0 pt-0 pb-0 max-md:hidden"} />
          </div>{" "}
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              className="rounded-full px-4"
              size={"sm"}
              onClick={() => {
                setIsLogin(false);
                setShowEmailForm(true);
              }}
            >
              Sign Up to Chat
            </Button>
            <Button
              className=" transition-colors"
              size={"sm"}
              variant={"ghost"}
              onClick={() => {
                setIsLogin(true);
                setShowEmailForm(true);
              }}
            >
              Login
            </Button>
          </div>
        </header>
        <motion.div
          className="max-sm:mt-24 p-10 z-20 w-[100vw] sm:w-[400px] h-fit  md:rounded-3xl bg-accent  md:absolute mt-[14%] md:left-[100px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {!showEmailForm ? (
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Your AI Story
                  <br className="hidden sm:block" /> Begins Here
                </h1>
                <p className="text-gray-400 text-lg">
                  Sign up fast and dive into meaningful interactions.{" "}
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  variant="secondary"
                  className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 font-medium rounded-lg"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <div className="flex items-center justify-center py-4">
                  <span className="text-gray-500 text-sm">OR</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-600 font-medium rounded-lg bg-transparent"
                  onClick={() => setShowEmailForm(true)}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Continue with email
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By continuing, you agree with the
                <br />
                Terms and Privacy Policy
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-gray-400">
                  {isLogin
                    ? "Sign in to continue"
                    : "Sign up in just ten seconds"}
                </p>
              </div>
              {isLogin ? <LoginView /> : <SignupView />}
              <div className="text-center">
                <button
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
                </button>
              </div>
              <button
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowEmailForm(false)}
              >
                ← Back to options
              </button>
            </div>
          )}
        </motion.div>
        {/* <motion.div
        className="w-[100vw] h-[100dvh] flex justify-end items-end md:px-15 md:py-15 max-md:absolute max-md:inset-0 outline-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isImageLoaded ? 1 : 0,
          scale: isImageLoaded ? 1 : 0.95,
          // Add subtle bounce effect only for large screens
          y: isImageLoaded ? [0, -8, 0] : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          // Bounce animation settings
          y: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      >
        <AnimatedGif currentGif={currentGif} />
      </motion.div> */}
        <motion.div
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            mass: 1,
          }}
          className="relative flex justify-end min-w-full max-w-full w-[100vw] md:pr-24 max-md:hidden overflow-hidden"
        >
          {/* Only show the GIF when it's loaded to prevent flickering */}
          <motion.img
            src={currentGif || "/placeholder.svg"}
            className="aspect-video h-[100dvh] max-md:w-[100vw] md:h-[80dvh] md:rounded-3xl object-cover  shadow-primary "
            alt="Anime cover"
            style={{
              opacity: isImageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
            onLoad={() => setIsImageLoaded(true)}
            // Additional subtle bounce for the image itself on large screens
            animate={{
              y:
                typeof window !== "undefined" && window.innerWidth >= 768
                  ? [0, -5, 0]
                  : 0,
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
