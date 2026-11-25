import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  CarouselItem,
  BONUSES,
  CHECKOUT_URLS,
  FAQS,
  GALLERY_ROW1,
  GALLERY_ROW2,
  GALLERY_ROW3,
  trackInitiateCheckout,
} from '../data/pageData';

/* Shared IntersectionObserver hook: pauses off-screen animations/timers AND pre-loads images 600px before scrolling into view */
function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  rootMargin: string = '600px 0px'
): { isVisible: boolean; hasEntered: boolean } {
  const [isVisible, setIsVisible] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasEntered(true);
          }
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return { isVisible, hasEntered };
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ==================== CAROUSEL ==================== */
interface CarouselProps {
  id?: string;
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  id,
  items,
  autoPlayInterval = 3500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isVisible, hasEntered } = useInViewport(containerRef, '600px 0px');

  const scrollToIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const count = items.length;
    const normalizedIndex = (index + count) % count;
    setCurrentIndex(normalizedIndex);

    const child = trackRef.current.children[normalizedIndex] as HTMLElement;
    if (child) {
      trackRef.current.scrollTo({
        left: child.offsetLeft - trackRef.current.offsetLeft,
        behavior: 'smooth',
      });
    }
  }, [items.length]);

  const handleNext = () => scrollToIndex(currentIndex + 1);
  const handlePrev = () => scrollToIndex(currentIndex - 1);

  const rafId = useRef<number | null>(null);

  const handleScroll = () => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!trackRef.current) return;
      const scrollLeft = trackRef.current.scrollLeft;
      const firstChild = trackRef.current.firstElementChild as HTMLElement | null;
      if (!firstChild) return;
      const itemWidth = firstChild.offsetWidth + 16;
      if (itemWidth <= 0) return;
      const closestIndex = Math.round(scrollLeft / itemWidth);
      const clampedIndex = Math.max(0, Math.min(closestIndex, items.length - 1));
      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isHovered || !isVisible || autoPlayInterval <= 0) return;

    let interval: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (document.hidden) return;
      if (!interval) {
        interval = setInterval(() => {
          scrollToIndex(currentIndex + 1);
        }, autoPlayInterval);
      }
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentIndex, isHovered, isVisible, autoPlayInterval, scrollToIndex]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar gpu-layer"
      >
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="snap-center flex-shrink-0 w-[70%] sm:w-[45%] md:w-[32%] lg:w-[22%]"
            style={{ contain: 'layout paint' }}
          >
            <div
              className="relative rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
              style={{
                border: '1.5px solid #0066ff',
                boxShadow: '0 0 15px rgba(0, 102, 255, 0.25)',
                backgroundColor: '#1a1c1f',
              }}
            >
              <div className="aspect-square overflow-hidden bg-neutral-900">
                <img
                  src={item.img}
                  alt={item.name}
                  loading={hasEntered ? 'eager' : 'lazy'}
                  decoding="async"
                  width="400"
                  height="400"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black shadow-md border"
                style={{
                  backgroundColor: '#000000dd',
                  color: '#0066ff',
                  borderColor: '#0066ff80',
                  boxShadow: '0 0 8px rgba(0, 102, 255, 0.4)',
                }}
              >
                {item.tag}
              </div>
              <div className="p-3 text-center text-sm font-bold tracking-wide text-white uppercase">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl font-black backdrop-blur hover:scale-110 active:scale-95 transition cursor-pointer select-none"
        style={{
          backgroundColor: '#000000aa',
          border: '1.5px solid #0066ff',
          boxShadow: '0 0 12px rgba(0, 102, 255, 0.4)',
        }}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl font-black backdrop-blur hover:scale-110 active:scale-95 transition cursor-pointer select-none"
        style={{
          backgroundColor: '#000000aa',
          border: '1.5px solid #0066ff',
          boxShadow: '0 0 12px rgba(0, 102, 255, 0.4)',
        }}
      >
        ›
      </button>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, dotIdx) => {
          const isActive = dotIdx === currentIndex;
          return (
            <button
              key={dotIdx}
              type="button"
              aria-label={`Ir para ${dotIdx + 1}`}
              onClick={() => scrollToIndex(dotIdx)}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: isActive ? '24px' : '8px',
                backgroundColor: isActive ? '#0066ff' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isActive ? '0 0 8px #0066ff' : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ==================== INFINITE MARQUEE ==================== */
interface InfiniteMarqueeProps {
  items: CarouselItem[];
  direction?: 'left' | 'right';
  speedSeconds?: number;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  direction = 'left',
  speedSeconds = 28,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useInViewport(containerRef, '600px 0px');
  const halfTrack = items.length < 9 ? [...items, ...items] : items;
  const duplicatedItems = [...halfTrack, ...halfTrack];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden py-2 select-none group" style={{ contain: 'paint' }}>
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-l from-black to-transparent" />

      <div
        className="flex gap-4 pr-4 w-max group-hover:[animation-play-state:paused] gpu-layer marquee-track"
        style={{
          animation: `${animationName} ${speedSeconds}s linear infinite`,
          animationPlayState: isVisible ? 'running' : 'paused',
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const isSprite = item.spriteIndex !== undefined;
          const spriteCount = item.spriteCount || 6;

          return (
            <div
              key={`${item.name}-${idx}`}
              className="w-[220px] sm:w-[250px] md:w-[270px] flex-shrink-0"
              style={{ contain: 'layout paint' }}
            >
              <div
                className="relative rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] flex flex-col h-full"
                style={{
                  border: '1.5px solid #0066ff',
                  boxShadow: '0 0 15px rgba(0, 102, 255, 0.25)',
                  backgroundColor: '#1a1c1f',
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                  {isSprite ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      loading={hasEntered ? 'eager' : 'lazy'}
                      decoding="async"
                      width={270 * spriteCount}
                      height={270}
                      referrerPolicy="no-referrer"
                      className="absolute top-0 left-0 h-full max-w-none block select-none"
                      style={{
                        width: `${spriteCount * 100}%`,
                        transform: `translateX(-${((item.spriteIndex || 0) / spriteCount) * 100}%)`,
                      }}
                    />
                  ) : (
                    <img
                      src={item.img}
                      alt={item.name}
                      loading={hasEntered ? 'eager' : 'lazy'}
                      decoding="async"
                      width="270"
                      height="270"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center block"
                    />
                  )}
                </div>
                <div className="p-2.5 text-center text-xs md:text-sm font-black tracking-wide text-white uppercase truncate">
                  {item.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==================== GALLERY SECTION (3 CARROSSEIS INFINITOS) ==================== */
interface GallerySectionProps {
  onCtaClick: (e: React.MouseEvent) => void;
}

const MarqueeRow: React.FC<{
  images: string[];
  direction: 'left' | 'right';
  speedSeconds: number;
  labelPrefix: string;
}> = ({ images, direction, speedSeconds, labelPrefix }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useInViewport(containerRef, '600px 0px');
  const halfTrack = images.length < 10 ? [...images, ...images] : images;
  const fullTrack = [...halfTrack, ...halfTrack];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-2 select-none group"
      style={{ contain: 'paint' }}
    >
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-l from-black to-transparent" />

      <div
        className="flex gap-3 sm:gap-4 pr-3 sm:pr-4 w-max group-hover:[animation-play-state:paused] gpu-layer marquee-track"
        style={{
          animation: `${animationName} ${speedSeconds}s linear infinite`,
          animationPlayState: isVisible ? 'running' : 'paused',
        }}
      >
        {fullTrack.map((src, idx) => (
          <div
            key={`${labelPrefix}-${idx}`}
            className="w-[170px] sm:w-[210px] md:w-[240px] flex-shrink-0"
            style={{ contain: 'layout paint' }}
          >
            <div
              className="relative rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] aspect-square w-full bg-neutral-900"
              style={{
                border: '1.5px solid #0066ff',
                boxShadow: '0 0 15px rgba(0, 102, 255, 0.25)',
              }}
            >
              <img
                src={src}
                alt={`${labelPrefix} - Item ${(idx % images.length) + 1}`}
                loading={hasEntered ? 'eager' : 'lazy'}
                decoding="async"
                width="240"
                height="240"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GallerySection: React.FC<GallerySectionProps> = ({ onCtaClick }) => (
  <section
    id="galeria-modelos"
    className="px-4 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-16 perf-section"
  >
    <div className="flex justify-center mb-4">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase"
        style={{
          backgroundColor: 'rgba(0, 102, 255, 0.14)',
          color: '#00d4ff',
          border: '1.5px solid #0066ff',
          boxShadow: '0 0 15px rgba(0, 102, 255, 0.35)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
        MODELOS E IMPRESSÕES NA PRÁTICA
      </div>
    </div>

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center uppercase max-w-4xl mx-auto">
      VEJA MAIS EXEMPLOS DO QUE VOCÊ{' '}
      <span
        style={{
          backgroundImage: 'linear-gradient(135deg, #0066ff, #00d4ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        PODERÁ IMPRIMIR E TESTAR
      </span>
    </h2>

    <p className="mt-4 text-center text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
      Arquivos STL organizados e selecionados prontos para fatiar, testar novas categorias e colocar suas ideias em produção.
    </p>

    <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4">
      <MarqueeRow
        images={GALLERY_ROW1}
        direction="left"
        speedSeconds={38}
        labelPrefix="Modelo 3D Carrossel 1"
      />
      <MarqueeRow
        images={GALLERY_ROW2}
        direction="right"
        speedSeconds={34}
        labelPrefix="Modelo 3D Carrossel 2"
      />
      <MarqueeRow
        images={GALLERY_ROW3}
        direction="left"
        speedSeconds={42}
        labelPrefix="Modelo 3D Carrossel 3"
      />
    </div>

    <div className="text-center">
      <a
        href="#oferta-3990"
        onClick={onCtaClick}
        className="inline-block mt-10 px-7 py-3 rounded-full font-black text-sm uppercase tracking-wider text-black hover:scale-105 active:scale-95 transition-all duration-300"
        style={{
          backgroundImage: 'linear-gradient(135deg, #00ff66, #00e64d)',
          boxShadow: '0 0 25px rgba(0, 255, 102, 0.7), 0 8px 30px rgba(0, 255, 102, 0.4)',
          color: '#000000',
        }}
      >
        Quero Acesso a Todos os Modelos ↓
      </a>
    </div>
  </section>
);

/* ==================== VIDEO TOUR PLAYER ==================== */
interface VideoTourPlayerProps {
  src: string;
  poster: string;
  title: string;
}

export const VideoTourPlayer: React.FC<VideoTourPlayerProps> = ({ src, poster, title }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setHasStarted(true);
    const video = videoRef.current;
    if (video) {
      if (!video.getAttribute('src')) {
        video.src = src;
      }
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    }
  };

  return (
    <div
      className="mt-8 w-[calc(100%+1rem)] -mx-2 sm:w-full sm:mx-0 rounded-2xl overflow-hidden shadow-2xl relative group bg-neutral-950"
      style={{
        aspectRatio: '854 / 480',
        border: '2px solid #0066ff',
        boxShadow: '0 0 45px rgba(0, 102, 255, 0.45), 0 0 15px rgba(0, 102, 255, 0.3)',
      }}
    >
      <video
        ref={videoRef}
        title={title}
        controls={hasStarted}
        playsInline
        preload="none"
        onEnded={() => setHasStarted(false)}
        className={`w-full h-full object-cover block ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        Seu navegador não suporta a reprodução deste vídeo.
      </video>

      {!hasStarted && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Reproduzir vídeo com som: ${title}`}
          className="absolute inset-0 z-10 w-full h-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
        >
          <img
            src={poster}
            alt={title}
            loading="lazy"
            decoding="async"
            width="854"
            height="480"
            className="absolute inset-0 w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <span className="relative z-10 inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110 active:scale-95 drop-shadow-[0_10px_28px_rgba(0,0,0,0.75)]">
            <svg viewBox="0 0 68 48" className="w-[74px] h-[52px] sm:w-[88px] sm:h-[62px]" aria-hidden="true">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="#FF0000"
              />
              <path d="M45 24L27 14v20" fill="#FFFFFF" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

/* ==================== TESTIMONIALS CAROUSEL ==================== */
interface TestimonialsCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  images,
  autoPlayInterval = 5000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useInViewport(containerRef, '600px 0px');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = images.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => setCurrentIndex(idx);

  useEffect(() => {
    if (isPaused || !isVisible || autoPlayInterval <= 0) return;

    let timer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (document.hidden) return;
      if (!timer) {
        timer = setInterval(() => {
          nextSlide();
        }, autoPlayInterval);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPaused, isVisible, autoPlayInterval, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl mx-auto px-2 sm:px-4 py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative flex items-center justify-center gap-1.5 sm:gap-4 md:gap-8">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Depoimento anterior"
          className="flex-shrink-0 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-black bg-white hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.7),0_8px_20px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white"
        >
          <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 -ml-0.5 text-black" />
        </button>

        <div className="relative w-full max-w-[270px] sm:max-w-[340px] md:max-w-[420px] select-none flex-shrink">
          <div
            className="absolute -inset-6 rounded-[54px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.16), transparent 68%)',
            }}
          />

          <div
            className="relative rounded-[40px] sm:rounded-[48px] md:rounded-[54px] p-2 sm:p-2.5 bg-white transition-all duration-300"
            style={{
              boxShadow:
                '0 0 30px rgba(255, 255, 255, 0.35), 0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 pointer-events-none">
              <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-neutral-300 rounded-full" />
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-neutral-400 border border-neutral-300" />
            </div>

            <div
              className="relative rounded-[32px] sm:rounded-[40px] md:rounded-[46px] overflow-hidden bg-black flex flex-col justify-center cursor-grab active:cursor-grabbing border border-neutral-200 aspect-[391/800]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out w-full h-full"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0 flex items-center justify-center p-0 m-0 bg-black"
                  >
                    <img
                      src={imgUrl}
                      alt={`Depoimento ${index + 1}`}
                      loading={hasEntered ? 'eager' : 'lazy'}
                      decoding="async"
                      width="391"
                      height="800"
                      referrerPolicy="no-referrer"
                      className="w-full h-full block object-cover select-none"
                    />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-1 bg-white/40 rounded-full pointer-events-none z-10" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Próximo depoimento"
          className="flex-shrink-0 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-black bg-white hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.7),0_8px_20px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white"
        >
          <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 -mr-0.5 text-black" />
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {images.map((_, dotIdx) => {
            const isActive = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Ver depoimento ${dotIdx + 1}`}
                onClick={() => goToSlide(dotIdx)}
                className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: isActive ? '32px' : '9px',
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: isActive ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                }}
              />
            );
          })}
        </div>

        <span className="text-sm font-semibold text-white/70 tracking-wider">
          Depoimento {currentIndex + 1} de {total}
        </span>
      </div>
    </div>
  );
};

/* ==================== PRICING SECTION ==================== */
interface PricingSectionProps {
  onOpenBasicModal: () => void;
}

const BONUS_SHORT_TITLES: Record<number, string> = {
  1: 'Pack de Veículos 3D Profissionais',
  2: 'Coleção Heróis da Marvel',
  3: 'Pack de Chaveiros Rápidos',
  4: 'Modelos Flexíveis e Articulados',
  5: 'Coleção Clássicos dos Desenhos',
  6: 'Cosplay e Máscaras 3D',
  7: 'Coleção Pokémon 3D',
  8: 'Coleção 3D de Natal',
  9: 'Coleção Copa do Mundo',
  10: 'Mascotes Esportivos Exclusivos',
  11: '+250 Luminárias STL',
  12: 'Bichinhos Amigurumi 3D',
  13: 'Coleção Lego 3D',
  14: 'Universo Minecraft 3D',
  15: 'Canecas Gamer 3D',
  16: 'Canecas de Times de Futebol 3D',
  17: 'Caneca Estilo Moletom 3D',
  18: 'Réplicas de Estádios de Futebol em 3D',
  19: 'Porta Copos Monster 3D',
  20: 'Modelos GTA 6 & Vice City 3D',
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBasicModal }) => {
  const [showAllBonuses, setShowAllBonuses] = useState(true);

  const visibleBonuses = showAllBonuses ? BONUSES : BONUSES.slice(0, 6);
  const hiddenCount = BONUSES.length - 6;

  return (
    <section id="oferta" className="px-4 py-20 max-w-6xl mx-auto scroll-mt-16 perf-section">
      <h2 className="text-3xl md:text-5xl font-black text-center uppercase">
        ESCOLHA SEU{' '}
        <span
          style={{
            backgroundImage: 'linear-gradient(135deg, #0066ff, #00d4ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          ACESSO
        </span>
      </h2>

      <p className="mt-4 text-center text-white/70">
        Inicie sua operação de produtos 3D agora mesmo.
      </p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* PLANO BÁSICO (ESQUERDA) */}
        <div
          id="plano-basico"
          className="order-2 lg:order-1 rounded-2xl p-6 sm:p-7 relative scroll-mt-20 flex flex-col justify-between transition-all duration-300 hover:border-[#0066ff80]"
          style={{
            backgroundColor: '#111419',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.55)',
          }}
        >
          <div>
            <div className="text-center">
              <div className="text-[11px] font-black tracking-widest uppercase text-[#00d964]">
                PAGAMENTO ÚNICO
              </div>
              <h3 className="mt-1 text-xl font-black uppercase text-white">PLANO BÁSICO</h3>
              <p className="mt-0.5 text-xs text-white/55">Ideal para começar</p>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <img
                src="/assets/plan_showcase.webp"
                alt="Central Prime 3D™ Plano Básico"
                loading="lazy"
                decoding="async"
                width="640"
                height="406"
                className="w-full max-w-[290px] h-auto object-contain"
              />
            </div>

            <ul className="mt-5 divide-y divide-white/10 text-xs sm:text-[13px] text-white/85">
              <li className="py-2.5 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>+150.000 Arquivos STL Organizados</span>
              </li>
              <li className="py-2.5 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Acesso Vitalício (Sem mensalidades)</span>
              </li>
              <li className="py-2.5 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Uso comercial liberado e sem limite</span>
              </li>
              <li className="py-2.5 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Envio Imediato</span>
              </li>
              <li className="py-2.5 flex items-center gap-2.5 text-white/40">
                <span className="font-bold flex-shrink-0">✕</span>
                <span>Sem nenhum dos {BONUSES.length} bônus</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-2 text-center">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/50">
              PAGAMENTO ÚNICO
            </div>
            <div className="mt-1 text-4xl font-black text-white tracking-tight">
              <span className="text-lg font-bold mr-1">R$</span>10,90
            </div>
            <div className="text-[11px] text-white/55 mt-0.5">à vista • Sem mensalidades</div>

            <div className="mt-3 inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/75 border border-white/15 bg-white/5">
              ACESSO VITALÍCIO • PAGAMENTO ÚNICO
            </div>

            <button
              type="button"
              onMouseEnter={() => import('./SpecialOfferModal')}
              onTouchStart={() => import('./SpecialOfferModal')}
              onClick={onOpenBasicModal}
              className="mt-4 w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-white border border-white/25 bg-transparent hover:bg-white/10 hover:border-white/50 active:scale-95 transition cursor-pointer"
            >
              QUERO O PLANO BÁSICO
            </button>
          </div>
        </div>

        {/* PLANO PREMIUM (CENTRO DESTAQUE BRANCO) */}
        <div
          id="oferta-3990"
          className="order-1 lg:order-2 bg-white text-neutral-900 rounded-2xl p-6 sm:p-7 relative scroll-mt-24 transition-all duration-300"
          style={{
            border: '2.5px solid #00d964',
            boxShadow: '0 0 42px rgba(0, 217, 100, 0.42), 0 0 18px rgba(0, 217, 100, 0.25)',
          }}
        >
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white"
            style={{
              backgroundColor: '#00b853',
              boxShadow: '0 0 20px rgba(0, 217, 100, 0.65)',
            }}
          >
            ★ MAIS ESCOLHIDO
          </div>

          <div className="text-center mt-2">
            <div className="text-[11px] font-black tracking-widest uppercase text-[#009e47]">
              VITALÍCIO • TODOS OS BÔNUS
            </div>
            <h3 className="mt-1 text-2xl font-black uppercase text-neutral-900">
              PLANO PREMIUM
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Mais conteúdo, todos os {BONUSES.length} bônus e acesso para sempre
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <img
              src="/assets/plan_showcase.webp"
              alt="Central Prime 3D™ Premium"
              loading="lazy"
              decoding="async"
              width="640"
              height="406"
              className="w-full max-w-[310px] h-auto object-contain"
            />
          </div>

          <div className="mt-4 rounded-xl bg-neutral-100 border border-neutral-200 py-4 px-4 text-center">
            <div className="text-xs line-through text-neutral-400 font-semibold">
              De R$ 197,00
            </div>
            <div className="mt-0.5 text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              <span className="text-xl font-extrabold mr-1">R$</span>57,90
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              à vista no Pix ou até 5x de R$ 11,58 sem juros
            </div>
          </div>

          <ul className="mt-5 divide-y divide-neutral-200/80 text-xs sm:text-[13px] text-neutral-800">
            <li className="py-2 flex items-center gap-2">
              <span className="text-[#00a850] font-bold flex-shrink-0">✓</span>
              <span>+150.000 Arquivos STL Organizados</span>
            </li>
            <li className="py-2 flex items-center gap-2 font-bold text-[#009e47]">
              <span className="text-[#00a850] font-bold flex-shrink-0">✓</span>
              <span>Acesso Vitalício (pague 1 vez, use para sempre)</span>
            </li>
            <li className="py-2 flex items-center gap-2">
              <span className="text-[#00a850] font-bold flex-shrink-0">✓</span>
              <span>Uso comercial liberado</span>
            </li>
            {visibleBonuses.map((bonus) => (
              <li key={bonus.id} className="py-2 flex items-center gap-2">
                <span className="text-[#00a850] font-bold flex-shrink-0">✓</span>
                <span>
                  Bônus {bonus.id}: {BONUS_SHORT_TITLES[bonus.id] || bonus.title}
                </span>
              </li>
            ))}
            <li className="py-2 flex items-center gap-2">
              <span className="text-[#00a850] font-bold flex-shrink-0">✓</span>
              <span>Download imediato e Garantia de 14 dias</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setShowAllBonuses((prev) => !prev)}
            className="mt-2 w-full py-2 text-center text-xs font-extrabold text-[#009e47] hover:text-[#007a36] cursor-pointer transition-colors"
          >
            {showAllBonuses
              ? `− Ocultar os outros ${hiddenCount} bônus •`
              : `+ Ver todos os ${BONUSES.length} bônus inclusos •`}
          </button>

          <a
            href={CHECKOUT_URLS.premium}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackInitiateCheckout('Plano Vitalício Completo R$ 57,90', 57.90)}
            className="mt-4 block text-center w-full py-4 rounded-full font-black uppercase text-sm tracking-wide text-white shadow-xl hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all"
            style={{
              backgroundColor: '#00a850',
              boxShadow: '0 8px 28px rgba(0, 168, 80, 0.45)',
            }}
          >
            QUERO O PLANO PREMIUM
          </a>
        </div>

        {/* PLANO PLUS (DIREITA) */}
        <div
          id="plano-plus"
          className="order-3 rounded-2xl p-6 sm:p-7 relative scroll-mt-20 flex flex-col justify-between transition-all duration-300 hover:border-[#0066ff80]"
          style={{
            backgroundColor: '#111419',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.55)',
          }}
        >
          <div>
            <div className="text-center">
              <div className="text-[11px] font-black tracking-widest uppercase text-[#00d964]">
                PAGAMENTO ÚNICO
              </div>
              <h3 className="mt-1 text-xl font-black uppercase text-white">PLANO PLUS</h3>
              <p className="mt-0.5 text-xs text-white/55">Mais arquivos e 5 super bônus inclusos</p>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <img
                src="/assets/plan_showcase.webp"
                alt="Central Prime 3D™ Plano Plus"
                loading="lazy"
                decoding="async"
                width="640"
                height="406"
                className="w-full max-w-[290px] h-auto object-contain"
              />
            </div>

            <ul className="mt-5 divide-y divide-white/10 text-xs sm:text-[13px] text-white/85">
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>+150.000 Arquivos STL Organizados</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Acesso Vitalício (Sem mensalidades)</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Uso comercial liberado e sem limite</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Envio Imediato</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Bônus 1: Pack de Veículos 3D Profissionais</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Bônus 2: Coleção Heróis da Marvel</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Bônus 3: Pack de Chaveiros Rápidos</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Bônus 4: Modelos Flexíveis e Articulados</span>
              </li>
              <li className="py-2 flex items-center gap-2.5">
                <span className="text-[#00d964] font-bold flex-shrink-0">✓</span>
                <span>Bônus 5: Coleção Clássicos dos Desenhos</span>
              </li>
              <li className="py-2.5 flex items-center gap-2.5 text-white/40">
                <span className="font-bold flex-shrink-0">✕</span>
                <span>Só 5 de {BONUSES.length} bônus — o Premium tem todos</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-2 text-center">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/50">
              PAGAMENTO ÚNICO
            </div>
            <div className="mt-1 text-4xl font-black text-white tracking-tight">
              <span className="text-lg font-bold mr-1">R$</span>27,90
            </div>
            <div className="text-[11px] text-white/55 mt-0.5">à vista ou até 3x de R$ 9,30</div>

            <div className="mt-3 inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/75 border border-white/15 bg-white/5">
              PAGAMENTO ÚNICO • SEM MENSALIDADES
            </div>

            <a
              href={CHECKOUT_URLS.specialOfferDiscount}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackInitiateCheckout('Plano Plus R$ 27,90', 27.90)}
              className="mt-4 block text-center w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-white border border-white/25 bg-transparent hover:bg-white/10 hover:border-white/50 active:scale-95 transition"
            >
              QUERO O PLANO PLUS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==================== FAQ SECTION ==================== */
export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-4 py-20 max-w-3xl mx-auto perf-section">
      <h2 className="text-3xl md:text-5xl font-black text-center uppercase text-white">
        DÚVIDAS{' '}
        <span
          style={{
            backgroundImage: 'linear-gradient(135deg, #0066ff, #00d4ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          FREQUENTES
        </span>
      </h2>

      <div className="mt-10 space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="p-5 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                border: '1.5px solid #0066ff',
                boxShadow: isOpen
                  ? '0 0 20px rgba(0, 102, 255, 0.35)'
                  : '0 0 10px rgba(0, 102, 255, 0.18)',
                backgroundColor: '#1a1c1f',
              }}
              onClick={() => toggleFaq(faq.id)}
            >
              <div className="font-bold text-sm flex justify-between items-center select-none text-white">
                <span>{faq.question}</span>
                <span
                  className={`text-xl transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#0066ff', textShadow: '0 0 8px #0066ff' }}
                >
                  ⌄
                </span>
              </div>
              {isOpen && (
                <p className="mt-3 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-3">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
