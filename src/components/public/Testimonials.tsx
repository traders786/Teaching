import React, { useState, useEffect } from 'react';
import { Quote, Star, Sparkles, CheckCircle2, MapPin, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Aarav used to hesitate whenever guests visited or in school presentations. After 6 weeks at Upspeaq, he hosted his school's Science Day assembly with zero stage fright. The extempore drills worked wonders!",
      parent: "Pooja Sharma",
      relation: "Mother of Aarav",
      grade: "Grade 5",
      city: "Bengaluru",
      badge: "Stage & Assembly Host",
      stars: 5,
      avatarColor: 'bg-amber-500 text-slate-950',
      initials: 'PS',
    },
    {
      id: 2,
      quote: "Finding small batches with only 6-8 kids was a game changer. Ananya gets 15+ minutes on the mic in every single class. Her sentence framing speed in English has improved tremendously.",
      parent: "Rajesh Menon",
      relation: "Father of Ananya",
      grade: "Grade 3",
      city: "Mumbai",
      badge: "Instant Sentence Framing",
      stars: 5,
      avatarColor: 'bg-orange-500 text-white',
      initials: 'RM',
    },
    {
      id: 3,
      quote: "Siddharth loved the Oxford PEEI debate framework. He learned to construct rational arguments instead of getting emotional. He just won 2nd prize in the inter-school Model UN debate!",
      parent: "Dr. Meenakshi Iyer",
      relation: "Mother of Siddharth",
      grade: "Grade 7",
      city: "Chennai",
      badge: "Inter-School Debate Winner",
      stars: 5,
      avatarColor: 'bg-blue-600 text-white',
      initials: 'MI',
    },
    {
      id: 4,
      quote: "In school she was shy and would whisper when asked a question. The voice modulation and character storytelling lab made her expressive and lively. She now loves narrating stories in fluent English.",
      parent: "Vikram Singhania",
      relation: "Father of Riya",
      grade: "Grade 2",
      city: "Delhi NCR",
      badge: "Dramatic Storytelling",
      stars: 5,
      avatarColor: 'bg-pink-500 text-white',
      initials: 'VS',
    },
    {
      id: 5,
      quote: "We took the 1-on-1 private coaching track because Kabir had severe hesitation speaking English despite knowing grammar rules. His coach was patient, warm, and built his confidence step by step.",
      parent: "Sneha Kulkarni",
      relation: "Mother of Kabir",
      grade: "Grade 6",
      city: "Pune",
      badge: "1-on-1 Private Coaching",
      stars: 5,
      avatarColor: 'bg-emerald-600 text-white',
      initials: 'SK',
    },
    {
      id: 6,
      quote: "The best part is the zero-shame environment. In regular school, kids laugh at grammar slips. Here, teachers celebrate attempts and turn errors into learning moments. Ishaan eagerly waits for his classes.",
      parent: "Amitabh Roy",
      relation: "Father of Ishaan",
      grade: "Grade 4",
      city: "Kolkata",
      badge: "Fearless Participation",
      stars: 5,
      avatarColor: 'bg-purple-600 text-white',
      initials: 'AR',
    },
    {
      id: 7,
      quote: "Her transition into high school group discussions was worrying me. After 3 months of debate practice at Upspeaq, her school teacher praised her analytical speaking and leadership during class projects.",
      parent: "Harpreet Kaur",
      relation: "Mother of Jasleen",
      grade: "Grade 8",
      city: "Chandigarh",
      badge: "Classroom Leadership",
      stars: 5,
      avatarColor: 'bg-amber-600 text-white',
      initials: 'HK',
    },
    {
      id: 8,
      quote: "The weekly WhatsApp progress reports with exact feedback on vocabulary, pauses, and body language give us total transparency. Upspeaq actually measures real speaking growth instead of vague claims.",
      parent: "Sanjay Reddy",
      relation: "Father of Diya",
      grade: "Grade 5",
      city: "Hyderabad",
      badge: "Observable Progress",
      stars: 5,
      avatarColor: 'bg-indigo-600 text-white',
      initials: 'SR',
    },
    {
      id: 9,
      quote: "For a 6-year-old, learning phonetics and conversational English through interactive games was so joyful. No boring homework, just lively speaking games that built natural fluency.",
      parent: "Bhavna Patel",
      relation: "Mother of Dev",
      grade: "Grade 1",
      city: "Ahmedabad",
      badge: "Early Phonetic Joy",
      stars: 5,
      avatarColor: 'bg-teal-600 text-white',
      initials: 'BP',
    },
    {
      id: 10,
      quote: "Tanvi was chosen as the school student council prefect after clearing the public speech round! The impromptu 30-second speech practice at Upspeaq gave her the confidence to stand on stage.",
      parent: "Gaurav Tandon",
      relation: "Father of Tanvi",
      grade: "Grade 6",
      city: "Gurgaon",
      badge: "School Prefect Elected",
      stars: 5,
      avatarColor: 'bg-rose-600 text-white',
      initials: 'GT',
    },
    {
      id: 11,
      quote: "Pranav used to translate Hindi to English word-by-word in his head, which caused long awkward silences. The rapid-fire drills completely eliminated that translation lag.",
      parent: "Ritu Mathur",
      relation: "Mother of Pranav",
      grade: "Grade 4",
      city: "Jaipur",
      badge: "Zero Translation Lag",
      stars: 5,
      avatarColor: 'bg-amber-500 text-slate-950',
      initials: 'RM',
    },
    {
      id: 12,
      quote: "We tried several large EdTech platforms before, but 30+ kids in a Zoom call meant zero speaking time. Upspeaq’s strict 8-student cap is worth every single rupee. She speaks non-stop!",
      parent: "Nitin Saxena",
      relation: "Father of Avani",
      grade: "Grade 7",
      city: "Noida",
      badge: "1:8 True Speaking Cohort",
      stars: 5,
      avatarColor: 'bg-blue-700 text-white',
      initials: 'NS',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  // Compute number of items visible per view: 3 on desktop, 2 on tablet, 1 on mobile
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, total - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Optional subtle auto-scroll every 5 seconds if not paused by hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  return (
    <section className="py-14 sm:py-20 bg-slate-50/60 border-b border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider font-heading shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Parent & Student Perspectives</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
              The Transformation in Real Families
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium font-body">
              Our priority is observable growth: seeing your child raise their hand in school, speak with clarity at the dinner table, and step onto the stage with pride.
            </p>
          </div>

          {/* Slider Controls & Rating Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-black text-slate-900 font-heading">4.9 / 5.0</span>
              <span className="text-[11px] text-slate-500 font-medium">({total}+ Reviews)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous review"
                className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next review"
                className="w-10 h-10 rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount + (24 / (visibleCount * 10)))}%)`,
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="shrink-0 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                style={{
                  width: `calc(${100 / visibleCount}% - ${((visibleCount - 1) * 24) / visibleCount}px)`,
                }}
              >
                <div>
                  {/* Header: Stars & Transformation Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100/80 text-amber-950 font-heading">
                      {item.badge}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <div className="relative">
                    <Quote className="w-6 h-6 text-amber-500/25 mb-1 -scale-x-100" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-body font-medium italic min-h-[72px]">
                      "{item.quote}"
                    </p>
                  </div>
                </div>

                {/* Footer: Parent Info */}
                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${item.avatarColor} flex items-center justify-center font-black text-xs font-heading shadow-2xs shrink-0`}>
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-heading flex items-center gap-1.5">
                        <span>{item.parent}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.relation} • <span className="font-bold text-slate-700">{item.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      <span>{item.city}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === index
                  ? 'w-8 bg-amber-500'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Verified Review Guarantee Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-amber-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 font-heading">
                100% Verified Parent Experiences
              </h4>
              <p className="text-xs text-slate-600 font-medium font-body mt-0.5">
                All reviews are collected after parents observe live small-batch sessions and graduation speech showcases.
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-amber-950 bg-amber-200/80 px-3.5 py-1.5 rounded-full whitespace-nowrap">
            1,200+ Enrolled Families
          </span>
        </div>

      </div>
    </section>
  );
};
