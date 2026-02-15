"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Floating Hearts Canvas (Hero) ─────────────────────────────
function FloatingHeartsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let hearts = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Heart {
      constructor(startRandom) {
        this.reset(startRandom);
      }
      reset(startRandom) {
        this.x = Math.random() * canvas.width;
        this.y = startRandom ? Math.random() * canvas.height : canvas.height + 20;
        this.size = Math.random() * 14 + 8;
        this.speedY = Math.random() * 1.2 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.hue = 340 + Math.random() * 20;
      }
      update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.rotation += this.rotSpeed;
        if (this.y < -30) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
        ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 35; i++) hearts.push(new Heart(true));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((h) => { h.update(); h.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Heart Constellation Canvas ────────────────────────────────
function ConstellationCanvas({ isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let nodes = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 2;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.pulse += 0.03;
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        const s = this.size + Math.sin(this.pulse) * 1.5;
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(this.pulse) * 0.3;
        ctx.fillStyle = "#fb7185";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + s * 0.3);
        ctx.bezierCurveTo(this.x - s * 0.5, this.y - s * 0.3, this.x - s, this.y + s * 0.1, this.x, this.y + s);
        ctx.bezierCurveTo(this.x + s, this.y + s * 0.1, this.x + s * 0.5, this.y - s * 0.3, this.x, this.y + s * 0.3);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 50; i++) nodes.push(new Node());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(251, 113, 133, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => { n.update(); n.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Love Fireworks Canvas ─────────────────────────────────────
function FireworksCanvas({ isActive }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(isActive);

  useEffect(() => { activeRef.current = isActive; }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    let rockets = [];
    let lastLaunch = 0;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#fb7185", "#f43f5e", "#fda4af", "#d4a574", "#f0d9b5", "#ff6b9d", "#c084fc"];

    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        this.speed = 4 + Math.random() * 2;
        this.trail = [];
        this.exploded = false;
      }
      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 10) this.trail.shift();
        this.trail.forEach((t) => (t.alpha -= 0.08));
        this.y -= this.speed;
        if (this.y <= this.targetY) { this.exploded = true; this.explode(); }
      }
      explode() {
        const count = 40 + Math.floor(Math.random() * 20);
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
          const speed = Math.random() * 3 + 1.5;
          particles.push({
            x: this.x, y: this.y,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            alpha: 1, decay: Math.random() * 0.015 + 0.008,
            color, size: Math.random() * 2.5 + 1,
            isHeart: Math.random() < 0.3,
          });
        }
      }
      draw() {
        this.trail.forEach((t) => {
          if (t.alpha > 0) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(253, 164, 175, ${t.alpha})`;
            ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.beginPath(); ctx.fillStyle = "#fda4af";
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    function drawHeart(x, y, size, color, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.3);
      ctx.bezierCurveTo(x - size * 0.5, y - size * 0.3, x - size, y + size * 0.1, x, y + size);
      ctx.bezierCurveTo(x + size, y + size * 0.1, x + size * 0.5, y - size * 0.3, x, y + size * 0.3);
      ctx.fill(); ctx.restore();
    }

    function animate(timestamp) {
      ctx.fillStyle = "rgba(13, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (activeRef.current && timestamp - lastLaunch > 800 + Math.random() * 1200) {
        rockets.push(new Rocket());
        lastLaunch = timestamp;
      }

      rockets = rockets.filter((r) => !r.exploded);
      rockets.forEach((r) => { r.update(); r.draw(); });

      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.vx *= 0.99; p.alpha -= p.decay;
        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size * 2, p.color, p.alpha);
        } else {
          ctx.beginPath(); ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color; ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill(); ctx.globalAlpha = 1;
        }
      });

      animId = requestAnimationFrame(animate);
    }
    animate(0);

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Falling Petals Canvas (Closing) ──────────────────────────
function PetalsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let petals = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    const petalColors = [
      "rgba(251, 113, 133, 0.6)", "rgba(244, 63, 94, 0.5)",
      "rgba(253, 164, 175, 0.5)", "rgba(255, 228, 230, 0.4)", "rgba(212, 165, 116, 0.4)",
    ];

    class Petal {
      constructor(startRandom) { this.reset(startRandom); }
      reset(startRandom) {
        this.x = Math.random() * canvas.width;
        this.y = startRandom ? Math.random() * canvas.height : -20;
        this.size = Math.random() * 12 + 6;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.8;
        this.rotation += this.rotSpeed;
        if (this.y > canvas.height + 20) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(0, this.size * 0.7);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 40; i++) petals.push(new Petal(true));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(-1);
  const [direction, setDirection] = useState("next");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const [welcomeHiding, setWelcomeHiding] = useState(false);
  const [envelopeHiding, setEnvelopeHiding] = useState(false);
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const totalSlides = 6;

  const goToSlide = useCallback((index, dir) => {
    if (isTransitioning.current || index === currentSlide || index < 0 || index >= totalSlides) return;
    isTransitioning.current = true;
    setDirection(dir);
    setPrevSlide(currentSlide);
    setCurrentSlide(index);
    setTimeout(() => {
      isTransitioning.current = false;
      setPrevSlide(-1);
    }, 850);
  }, [currentSlide]);

  const goNext = useCallback(() => {
    if (showWelcome || showEnvelope) return;
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, "next");
  }, [currentSlide, goToSlide, showWelcome, showEnvelope]);

  const goPrev = useCallback(() => {
    if (showWelcome || showEnvelope) return;
    if (currentSlide > 0) goToSlide(currentSlide - 1, "prev");
  }, [currentSlide, goToSlide, showWelcome, showEnvelope]);

  // Wheel navigation
  useEffect(() => {
    let wheelTimeout = 0;
    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelTimeout < 1000) return;
      wheelTimeout = now;
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext(); else goPrev();
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  function getSlideClass(index) {
    if (index === currentSlide) {
      if (prevSlide === -1) return "slide active";
      return `slide active ${direction === "next" ? "enter-from-right" : "enter-from-left"}`;
    }
    if (index === prevSlide) {
      return `slide ${direction === "next" ? "exit-to-left" : "exit-to-right"}`;
    }
    return "slide";
  }

  const letterLines = [
    "Belum lama kita saling kenal,",
    "baru sebulan, tapi rasanya sudah lama banget.",
    "Awal ketemu, aku seneng banget",
    "bisa kenal seseorang kayak kamu.",
    "Tapi kamu harus balik merantau dan menjalani magang,",
    "dan aku cuma bisa berharap dari jauh. 💕",
  ];



  const handleStartClick = () => {
    setShowEnvelope(true);        // envelope langsung muncul di belakang welcome (z-index lebih rendah)
    setWelcomeHiding(true);       // welcome mulai fade out
    setTimeout(() => {
      setShowWelcome(false);
      setWelcomeHiding(false);
    }, 800);
  };

  const handleEnvelopeClick = () => {
    if (!envelopeOpened) {
      setEnvelopeOpened(true);
    }
  };

  const handleAnswer = (ans) => {
    setAnswer(ans);
    if (ans === 'yes') {
      setCelebrating(true);
      setTimeout(() => {
        setEnvelopeHiding(true);
      }, 1200);
      setTimeout(() => {
        setShowEnvelope(false);
        setEnvelopeHiding(false);
      }, 2200);
    }
  };

  return (
    <>
      {/* Welcome Cover - Outside slide system */}
      {showWelcome && (
        <div className={`welcome-cover active ${welcomeHiding ? 'hiding' : ''}`}>
          <div className="welcome-hearts">
            <span className="welcome-heart">💖</span>
            <span className="welcome-heart">💕</span>
            <span className="welcome-heart">💗</span>
            <span className="welcome-heart">💝</span>
            <span className="welcome-heart">💖</span>
            <span className="welcome-heart">💕</span>
          </div>
          <div className="welcome-content">
            <h1 className="welcome-greeting">Hai....</h1>
            <p className="welcome-message">
              Aku bikin sesuatu kecil buat kamu<span className="love-icon">💖</span>
            </p>
            <div className="welcome-cta">
              <button
                className="start-button"
                onClick={handleStartClick}
              >
                Mulai ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Envelope Screen - After welcome, before slides */}
      {showEnvelope && (
        <div className={`envelope-screen ${envelopeHiding ? 'hiding' : ''}`}>
          <p className="envelope-prompt">Ada surat buat kamu... 💌</p>

          <div
            className={`envelope-wrapper ${envelopeOpened ? 'opened' : ''}`}
            onClick={handleEnvelopeClick}
          >
            <div className="envelope-flap"></div>
            <div className="envelope-seal">💝</div>
            <div className="envelope-body">
              <div className="envelope-triangle-left"></div>
              <div className="envelope-triangle-right"></div>
            </div>

            <div className="envelope-paper">
              <div className="paper-heart-deco">💕</div>
              <p className="paper-question">
                Will u be my<br />Valentine? 💗
              </p>
              <div className="paper-options">
                <div
                  className={`paper-option ${answer === 'yes' ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleAnswer('yes'); }}
                >
                  <div className="paper-checkbox">
                    <span className="paper-checkbox-check">✓</span>
                  </div>
                  <span className="paper-option-label">Yes! 💖</span>
                </div>
                <div
                  className={`paper-option no-dodge ${answer === 'no' ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <div className="paper-checkbox">
                    <span className="paper-checkbox-check">✓</span>
                  </div>
                  <span className="paper-option-label">No</span>
                </div>
              </div>
            </div>
          </div>

          {celebrating && (
            <div className="envelope-celebration">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="celebration-heart"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${30 + Math.random() * 40}%`,
                    animationDelay: `${i * 0.1}s`,
                    fontSize: `${1 + Math.random() * 1.5}rem`
                  }}
                >
                  {['💖', '💕', '✨', '💗', '🌹', '💝'][i % 6]}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="slides-wrapper">
        {/* ── Slide 0: Hero ── */}
        <div className={getSlideClass(0) + " hero-slide"}>
          <FloatingHeartsCanvas isActive={currentSlide === 0} />       <div className="slide-content">
            <h1 className="hero-title">Happy Valentine&apos;s Day</h1>
            <p className="hero-subtitle">For the one who makes my heart skip a beat</p>
            <span className="hero-heart">💕</span>
          </div>
        </div>

        {/* ── Slide 1: Love Letter ── */}
        <div className={getSlideClass(1) + " letter-slide"}>
          <div className="slide-content">
            <div className="letter-box">
              <h2 className="letter-greeting">Untuk yang tersayang...</h2>
              <div className="letter-text">
                {letterLines.map((line, i) => (
                  <span
                    key={i}
                    className="letter-line"
                    style={{ animationDelay: `${0.4 + i * 0.25}s` }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide 2: Constellation ── */}
        <div className={getSlideClass(2) + " constellation-slide"}>
          <ConstellationCanvas isActive={currentSlide === 2} />
          <div className="slide-content">
            <h2 className="constellation-title">Walau Jauh di Sana</h2>
            <p className="constellation-sub">
              Setiap titik cahaya ini kayak harapan kecilku buat bisa kenal kamu lebih dekat
            </p>
          </div>
        </div>

        {/* ── Slide 3: Fireworks + Blossoming Flowers ── */}
        <div className={getSlideClass(3) + " fireworks-slide"}>
          <FireworksCanvas isActive={currentSlide === 3} />

          <div className={`blossoming-container ${currentSlide === 3 ? 'active' : ''}`}>
            <div className="blossom-flowers">
              {/* Flower 1 */}
              <div className="blossom-flower blossom-flower--1">
                <div className="blossom-flower__leafs blossom-flower__leafs--1">
                  <div className="blossom-flower__leaf blossom-flower__leaf--1"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--2"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--3"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--4"></div>
                  <div className="blossom-flower__white-circle"></div>
                  <div className="blossom-flower__light blossom-flower__light--1"></div>
                  <div className="blossom-flower__light blossom-flower__light--2"></div>
                  <div className="blossom-flower__light blossom-flower__light--3"></div>
                  <div className="blossom-flower__light blossom-flower__light--4"></div>
                  <div className="blossom-flower__light blossom-flower__light--5"></div>
                  <div className="blossom-flower__light blossom-flower__light--6"></div>
                  <div className="blossom-flower__light blossom-flower__light--7"></div>
                  <div className="blossom-flower__light blossom-flower__light--8"></div>
                </div>
                <div className="blossom-flower__line">
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--1"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--2"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--3"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--4"></div>
                </div>
              </div>

              {/* Flower 2 */}
              <div className="blossom-flower blossom-flower--2">
                <div className="blossom-flower__leafs blossom-flower__leafs--2">
                  <div className="blossom-flower__leaf blossom-flower__leaf--1"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--2"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--3"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--4"></div>
                  <div className="blossom-flower__white-circle"></div>
                  <div className="blossom-flower__light blossom-flower__light--1"></div>
                  <div className="blossom-flower__light blossom-flower__light--2"></div>
                  <div className="blossom-flower__light blossom-flower__light--3"></div>
                  <div className="blossom-flower__light blossom-flower__light--4"></div>
                  <div className="blossom-flower__light blossom-flower__light--5"></div>
                  <div className="blossom-flower__light blossom-flower__light--6"></div>
                  <div className="blossom-flower__light blossom-flower__light--7"></div>
                  <div className="blossom-flower__light blossom-flower__light--8"></div>
                </div>
                <div className="blossom-flower__line">
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--1"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--2"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--3"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--4"></div>
                </div>
              </div>

              {/* Flower 3 */}
              <div className="blossom-flower blossom-flower--3">
                <div className="blossom-flower__leafs blossom-flower__leafs--3">
                  <div className="blossom-flower__leaf blossom-flower__leaf--1"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--2"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--3"></div>
                  <div className="blossom-flower__leaf blossom-flower__leaf--4"></div>
                  <div className="blossom-flower__white-circle"></div>
                  <div className="blossom-flower__light blossom-flower__light--1"></div>
                  <div className="blossom-flower__light blossom-flower__light--2"></div>
                  <div className="blossom-flower__light blossom-flower__light--3"></div>
                  <div className="blossom-flower__light blossom-flower__light--4"></div>
                  <div className="blossom-flower__light blossom-flower__light--5"></div>
                  <div className="blossom-flower__light blossom-flower__light--6"></div>
                  <div className="blossom-flower__light blossom-flower__light--7"></div>
                  <div className="blossom-flower__light blossom-flower__light--8"></div>
                </div>
                <div className="blossom-flower__line">
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--1"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--2"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--3"></div>
                  <div className="blossom-flower__line__leaf blossom-flower__line__leaf--4"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="slide-content">
            <h2 className="fireworks-title">Kamu Bikin Hari-Hariku Berwarna</h2>
            <p className="fireworks-sub">
              Walau baru sebentar kenal, kamu udah bikin semuanya terasa lebih hidup ✨
            </p>
          </div>
        </div>

        {/* ── Slide 4: Closing ── */}
        <div className={getSlideClass(4) + " closing-slide"}>
          <PetalsCanvas isActive={currentSlide === 4} />
          <div className="slide-content">
            <h2 className="closing-text">
              Semoga suatu hari nanti kita bisa kenal lebih dekat lagi
            </h2>
            <p className="closing-sub">Happy Valentine&apos;s Day, dari seseorang yang diam-diam seneng kenal kamu</p>
            <span className="closing-heart">❤️</span>
          </div>
        </div>

        {/* ── Slide 5: Bonus ── */}
        <div className={getSlideClass(5) + " bonus-slide"}>
          <div className="bonus-confetti">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                backgroundColor: ['#f43f5e','#fb7185','#fda4af','#d4a574','#f0d9b5','#ff6b6b','#ffd93d','#6bcb77','#4d96ff'][i % 9],
                transform: `rotate(${Math.random() * 360}deg)`,
              }} />
            ))}
          </div>
          <div className="slide-content bonus-content">
            <div className="bonus-badge">🎉 BONUS 🎉</div>
            <h2 className="bonus-title">Wkwkwk kamu masih scroll?? 😏</h2>
            <p className="bonus-text">Berarti kamu emang penasaran ya</p>
            <div className="bonus-photo-wrapper">
              <img src="/photos/angel.jpeg" alt="Angel" className="bonus-photo" />
            </div>
            <div className="bonus-emoji-row">
              <span className="bonus-emoji bounce-1">😜</span>
              <span className="bonus-emoji bounce-2">🤭</span>
              <span className="bonus-emoji bounce-3">😆</span>
            </div>
            <p className="bonus-secret">Psst... ini slide rahasia loh, cuma kamu yang tau 🤫</p>
            <div className="bonus-wink">😉✨</div>
          </div>
        </div>
      </div>

      {/* ── Navigation Dots ── */}
      {!showWelcome && !showEnvelope && (
        <div className="nav-dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(i, i > currentSlide ? "next" : "prev")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Scroll Hint ── */}
      {!showWelcome && !showEnvelope && (
        <div className={`scroll-hint ${currentSlide === totalSlides - 1 ? "hidden" : ""}`}>
          <div className="scroll-hint-arrow" />
          <span className="scroll-hint-text">scroll</span>
        </div>
      )}

      {/* ── Slide Counter ── */}
      {!showWelcome && !showEnvelope && (
        <div className="slide-counter">
          {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </div>
      )}
    </>
  );
}
