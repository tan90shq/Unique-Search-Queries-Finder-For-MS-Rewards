// Updated App.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import timerSound from "./assets/timer-done.mp3";
import bgVideo from "./assets/bg-loop.mp4";
import { FaVolumeUp, FaVolumeMute, FaCopy, FaExternalLinkAlt, FaGem, FaStar } from "react-icons/fa";
import Confetti from "react-confetti";

export default function App() {
  const [count, setCount] = useState(6);
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [doneCards, setDoneCards] = useState(new Set());
  const [showVideo, setShowVideo] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const countdownRef = useRef(null);
  const audioRef = useRef(null);
  const confettiRef = useRef(null);

  const fullTitle = "Unique Search Queries Finder for MS Rewards ✨";

  // Typing effect with enhanced animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.slice(0, i + 1));
      i++;
      if (i === fullTitle.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Fetch queries with error handling and history
  const fetchTrends = async (n = count) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trends?max=${n}`, { mode: 'cors' });
      if (!res.ok) throw new Error("Backend error");
      const json = await res.json();
      const nested = json.nested ?? (Array.isArray(json) ? json : json.terms ?? []);
      const extracted = nested.map((i) => (Array.isArray(i) ? i[0] : i));
      const newResults = extracted.slice(0, n);
      setResults(newResults);
      setDoneCards(new Set());
      setHistory(prev => [...prev, ...newResults].slice(-50)); // Keep last 50 in history
    } catch (e) {
      console.error("Fetch failed:", e);
      // Fallback: Generate some dummy unique queries if backend fails
      const fallbackQueries = Array.from({ length: n }, (_, i) => `Unique query ${i + 1} for rewards ${Date.now()}`);
      setResults(fallbackQueries);
    } finally {
      setLoading(false);
    }
  };

  const markCardDone = (term) => {
    setDoneCards((prev) => new Set([...prev, term]));
    if (doneCards.size + 1 === results.length && results.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const playSound = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const onOpenSearch = (term) => {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(term)}&qs=PN&form=TSFLBL`;
    window.open(url, "_blank", "noopener");
    markCardDone(term);

    if (countdownRef.current) clearTimeout(countdownRef.current);
    setCurrentTimer(timerSeconds);
    const interval = setInterval(() => {
      setCurrentTimer(prev => prev - 1);
    }, 1000);

    countdownRef.current = setTimeout(() => {
      clearInterval(interval);
      setCurrentTimer(null);
      playSound();
      const t = document.createElement("div");
      t.textContent = `"${term}" timer done! 🎵✨`;
      Object.assign(t.style, {
        position: "fixed",
        right: "18px",
        bottom: "18px",
        background: "linear-gradient(135deg, #00d4ff, #ff00a2)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        zIndex: 60,
        boxShadow: "0 10px 30px rgba(0,212,255,0.5)",
        fontWeight: "bold",
      });
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    }, timerSeconds * 1000);
  };

  const copyText = (term) => {
    navigator.clipboard?.writeText(term);
    playSound();
    markCardDone(term);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Video and Animated BG Toggle */}
      <AnimatePresence mode="wait">
        {showVideo ? (
          <motion.div
            key="video"
            className="video-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          >
            <video className="bg-video" autoPlay loop muted playsInline>
              <source src={bgVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        ) : (
          <motion.div
            key="gradient"
            className="animated-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Confetti Effect */}
      {showConfetti && <Confetti ref={confettiRef} width={window.innerWidth} height={window.innerHeight} recycle={false} />}

      {/* Enhanced Header */}
      <header className="header container">
        <motion.div 
          className="title-block"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1 
            className="typing enhanced-title"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {typedTitle}
            <motion.span 
              className="cursor"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.h1>
          <motion.p 
            className="meta"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Generate unique search queries and maximize your Microsoft Rewards points! 🚀
          </motion.p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Enhanced Input Row with Integrated Controls */}
        <motion.div 
          className="input-row enhanced-inputs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.label
            whileHover={{ scale: 1.02 }}
          >
            <span className="input-label">No. of Search Queries</span>
            <input
              type="number"
              min={1}
              max={30}
              value={count}
              onChange={(e) =>
                setCount(Math.max(1, Math.min(30, Number(e.target.value || 1))))
              }
              className="input neon enhanced-input"
            />
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
          >
            <span className="input-label">Timer (sec)</span>
            <input
              type="number"
              min={1}
              max={300}
              value={timerSeconds}
              onChange={(e) =>
                setTimerSeconds(Math.max(1, Math.min(300, Number(e.target.value || 8))))
              }
              className="input neon enhanced-input"
            />
          </motion.label>

          <motion.button
            onClick={() => fetchTrends(count)}
            className="btn neon find-btn enhanced-btn"
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0,212,255,1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🔍
              </motion.div>
            ) : "Find Queries ✨"}
          </motion.button>

          {/* Integrated Controls: Background Toggle and MS Rewards */}
          <motion.button 
            className="btn neon bg-toggle integrated-control"
            onClick={() => setShowVideo(!showVideo)}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {showVideo ? "🟢" : "🔴"}
          </motion.button>

          <motion.button
            className="btn neon ms-rewards integrated-control"
            onClick={() => window.open("https://rewards.bing.com", "_blank")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎁
          </motion.button>

          {/* Fancy Rebuilt Volume Control */}
          <motion.div 
            className="volume-control fancy-volume"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setShowVolumeSlider(true)}
            onHoverEnd={() => setShowVolumeSlider(false)}
          >
            <motion.button 
              onClick={toggleMute} 
              className="volume-icon fancy-volume-btn"
              animate={{ rotate: isMuted ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </motion.button>
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  className="volume-slider-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="fancy-volume-slider"
                  />
                  <span className="volume-value">{Math.round(volume * 100)}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Enhanced Cards Grid */}
        <section className="cards-grid enhanced-grid">
          <AnimatePresence>
            {results.map((term, idx) => (
              <motion.div
                key={term}
                className={`card-flip animate-in ${doneCards.has(term) ? "done" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div 
                  className="card-inner"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <motion.div className="card-front enhanced-card">
                    <motion.div 
                      className="query enhanced-query"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {term}
                    </motion.div>
                    <motion.div 
                      className="meta enhanced-meta"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      #{idx + 1} <FaGem className="inline-icon" />
                    </motion.div>
                  </motion.div>
                  <motion.div className="card-back enhanced-card-back">
                    <motion.button
                      onClick={() => copyText(term)}
                      className="action-btn copy-btn enhanced-action"
                      whileHover={{ scale: 1.1, background: "linear-gradient(90deg, #00ff95, #00ffaa)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCopy /> Copy
                    </motion.button>
                    <motion.button
                      onClick={() => onOpenSearch(term)}
                      className="action-btn open-btn enhanced-action"
                      whileHover={{ scale: 1.1, background: "linear-gradient(90deg, #ff00a2, #ff6fcc)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt /> Open
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* New: History Section */}
        {history.length > 0 && (
          <motion.section 
            className="header container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="history-header">
              <h3>Recent Queries <FaStar /></h3>
              <button onClick={clearHistory} className="clear-btn">Clear</button>
            </div>
            <div className="history-list">
              {history.slice(-10).map((item, idx) => (
                <motion.span key={idx} className="history-item" whileHover={{ scale: 1.05 }}>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Timer Display */}
        {currentTimer && (
          <motion.div 
            className="timer-display"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            ⏱️ {currentTimer}s
          </motion.div>
        )}

        {results.length === 0 && !loading && (
          <motion.div 
            className="empty enhanced-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No results yet. Click "Find Queries" to start your rewards journey! 🌟
          </motion.div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="footer enhanced-footer">
        <motion.div 
          className="footer-inner"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text">Vibe-Coded by</span>
          <span className="name">Tan90shq</span>
          <a
            href="https://instagram.com/tan90shq/"
            target="_blank"
            rel="noreferrer"
            className="icon-link enhanced-icon"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6-2.1a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z" />
            </svg>
          </a>
          <a
            href="https://github.com/tan90shq"
            target="_blank"
            rel="noreferrer"
            className="icon-link enhanced-icon"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.8 1.6-.8.8-1.4 2.2-1 2.7-.8.1-.7.4-1 .8-1.3-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.4-2.3 1.1-3.1-.1-.3-.5-1.5.1-3.2 0 0 .9-.3 3.3 1.2a11.4 11.4 0 016 0c2.4-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.7.8 1.1 1.8 1.1 3.1 0 4.6-2.7 5.5-5.3 5.8.4.4.7 1 .7 2v3c0 .3.2.8.8.6A12 12 0 0012 .5z" />
            </svg>
          </a>
        </motion.div>
      </footer>

      <audio
        ref={audioRef}
        src={timerSound}
        preload="auto"
        style={{ display: "none" }}
      />
    </div>
  );
}
