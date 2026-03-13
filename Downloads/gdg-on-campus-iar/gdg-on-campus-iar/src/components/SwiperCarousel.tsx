import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, EffectCards, EffectCreative, Parallax, Mousewheel, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../hooks/useUtils';
import { useThemeStore } from '../store/themeStore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';
import 'swiper/css/parallax';

interface CarouselProps {
  children: React.ReactNode[];
  effect?: 'slide' | 'coverflow' | 'cards' | 'creative';
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  autoplay?: boolean;
  loop?: boolean;
  centered?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  parallax?: boolean;
  mousewheel?: boolean;
  freeMode?: boolean;
  className?: string;
  slideClassName?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  effect = 'slide',
  slidesPerView = 3,
  spaceBetween = 30,
  autoplay = false,
  loop = true,
  centered = false,
  navigation = true,
  pagination = true,
  parallax = false,
  mousewheel = false,
  freeMode = false,
  className,
  slideClassName,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const theme = useThemeStore((s) => s.theme);

  const modules = [
    Navigation,
    Pagination,
    ...(autoplay ? [Autoplay] : []),
    ...(effect === 'coverflow' ? [EffectCoverflow] : []),
    ...(effect === 'cards' ? [EffectCards] : []),
    ...(effect === 'creative' ? [EffectCreative] : []),
    ...(parallax ? [Parallax] : []),
    ...(mousewheel ? [Mousewheel] : []),
    ...(freeMode ? [FreeMode] : []),
  ];

  const effectConfig = {
    coverflow: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    creative: {
      prev: {
        shadow: true,
        translate: ['-20%', 0, -1],
        rotate: [0, 0, -5],
      },
      next: {
        translate: ['100%', 0, 0],
        rotate: [0, 0, 5],
      },
    },
  };

  return (
    <div className={cn("relative group", className)}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={modules}
        effect={effect}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        centeredSlides={centered}
        loop={loop}
        parallax={parallax}
        mousewheel={mousewheel ? { forceToAxis: true } : false}
        freeMode={freeMode ? { enabled: true, momentum: true } : false}
        autoplay={autoplay ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        pagination={pagination ? { clickable: true, dynamicBullets: true } : false}
        navigation={false}
        {...(effect === 'coverflow' ? { coverflowEffect: effectConfig.coverflow } : {})}
        {...(effect === 'creative' ? { creativeEffect: effectConfig.creative } : {})}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: Math.min(2, Number(slidesPerView) || 2), spaceBetween: 20 },
          1024: { slidesPerView: slidesPerView, spaceBetween },
        }}
        className="!pb-12"
      >
        {children.map((child, index) => (
          <SwiperSlide key={index} className={slideClassName}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      {navigation && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10",
              "w-12 h-12 rounded-full flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:scale-110 active:scale-95",
              theme === 'dark'
                ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                : "bg-white hover:bg-gray-50 text-[#202124] shadow-lg border border-[#DADCE0]",
              isBeginning && !loop && "opacity-30 cursor-not-allowed"
            )}
            disabled={isBeginning && !loop}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10",
              "w-12 h-12 rounded-full flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:scale-110 active:scale-95",
              theme === 'dark'
                ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                : "bg-white hover:bg-gray-50 text-[#202124] shadow-lg border border-[#DADCE0]",
              isEnd && !loop && "opacity-30 cursor-not-allowed"
            )}
            disabled={isEnd && !loop}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Custom Pagination Styles */}
      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#DADCE0'};
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: linear-gradient(90deg, #4285F4, #34A853);
        }
      `}</style>
    </div>
  );
};

// Full-width Hero Carousel with Parallax
export const HeroCarousel: React.FC<{
  slides: Array<{
    image: string;
    title: string;
    subtitle?: string;
    cta?: { label: string; href: string };
  }>;
  className?: string;
}> = ({ slides, className }) => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div className={cn("relative h-[80vh] overflow-hidden", className)}>
      <Swiper
        modules={[Autoplay, Parallax, Pagination, EffectCreative]}
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        speed={1200}
        parallax
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              {/* Background Image with Parallax */}
              <div
                data-swiper-parallax="-30%"
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay */}
              <div className={cn(
                "absolute inset-0",
                theme === 'dark'
                  ? "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  : "bg-gradient-to-t from-white/90 via-white/50 to-transparent"
              )} />
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6 max-w-4xl">
                  <h2
                    data-swiper-parallax="-200"
                    data-swiper-parallax-opacity="0"
                    className={cn(
                      "text-5xl md:text-7xl font-bold mb-4",
                      theme === 'dark' ? 'text-white' : 'text-[#202124]'
                    )}
                  >
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p
                      data-swiper-parallax="-100"
                      data-swiper-parallax-opacity="0"
                      className={cn(
                        "text-xl md:text-2xl mb-8",
                        theme === 'dark' ? 'text-white/80' : 'text-[#5F6368]'
                      )}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.cta && (
                    <a
                      href={slide.cta.href}
                      data-swiper-parallax="-50"
                      className="inline-flex items-center px-8 py-4 bg-[#4285F4] text-white rounded-full font-semibold hover:bg-[#3367D6] transition-colors"
                    >
                      {slide.cta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Testimonials/Team Card Carousel
export const CardCarousel: React.FC<{
  children: React.ReactNode[];
  className?: string;
}> = ({ children, className }) => {
  return (
    <Carousel
      effect="coverflow"
      slidesPerView={3}
      spaceBetween={40}
      centered
      autoplay
      loop
      className={className}
    >
      {children}
    </Carousel>
  );
};

// Image Gallery Carousel
export const GalleryCarousel: React.FC<{
  images: Array<{ src: string; alt: string; caption?: string }>;
  className?: string;
}> = ({ images, className }) => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div className={cn("relative", className)}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        centeredSlides
        slidesPerView="auto"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        className="!py-12"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="!w-[70%] md:!w-[50%]">
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "bg-gradient-to-t from-black/80 to-transparent flex items-end p-6"
              )}>
                {image.caption && (
                  <p className="text-white text-lg font-medium">{image.caption}</p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Infinite Logo/Brand Carousel
export const LogoCarousel: React.FC<{
  logos: Array<{ src: string; alt: string }>;
  className?: string;
  speed?: number;
}> = ({ logos, className, speed = 3000 }) => {
  return (
    <div className={cn("overflow-hidden py-8", className)}>
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView="auto"
        spaceBetween={60}
        loop
        freeMode
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={speed}
        className="!overflow-visible"
      >
        {[...logos, ...logos].map((logo, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
