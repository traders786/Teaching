import React, { useState } from 'react';
import { BrandingConfig } from '../types';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

interface FaqPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ branding, onOpenDemoModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'shy' | 'tech' | 'demo' | 'schedule' | 'fees'>('all');
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      category: 'shy',
      question: 'What if my child is extremely shy and refuses to speak?',
      answer:
        'Over 70% of students join us feeling anxious, hesitating, or refusing to turn on their cameras in school. Our educators are trained in gentle, positive reinforcement. We never force or put a child on the spot before they are ready. In our intimate small-group batches, shy children see other kids stumble and laugh together, which naturally dissolves performance anxiety within the first 2 weeks.',
    },
    {
      category: 'demo',
      question: 'How does the Free 45-Minute Demo work?',
      answer:
        'The demo is an intimate, 1-on-2 or small-trio live session on Google Meet conducted by a senior speech mentor. We don’t deliver a boring marketing lecture. Instead, your child plays fun, interactive word games, speaks on a simple prompt, and receives a gentle, encouraging diagnostic score on their vocabulary, vocal modulation, and confidence.',
    },
    {
      category: 'tech',
      question: 'What device or setup does my child need to attend classes?',
      answer:
        'A laptop, desktop computer, or tablet (iPad/Android) with a working webcam, microphone, and stable broadband internet connection. We strongly recommend headphones or earphones so your child hears pronunciation nuances clearly and isn’t distracted by household ambient noise.',
    },
    {
      category: 'schedule',
      question: 'What happens if my child misses a live class due to school exams or travel?',
      answer:
        'We understand school priorities! You can notify our admissions coordinator up to 2 hours before class, and your child will be provided with an alternate slot in another ongoing batch for that exact week’s lesson, or given a 1-on-1 15-minute catch-up sync with the educator.',
    },
    {
      category: 'fees',
      question: 'Is the ₹4,999 fee for one month or the entire 3 months?',
      answer:
        '₹4,999 is the all-inclusive fee for the complete 3-Month Flagship Program (all 36 live interactive sessions, study workbooks, weekly WhatsApp progress reports, and graduation certificate). There are zero registration fees or hidden subscription renewals.',
    },
    {
      category: 'schedule',
      question: 'How are students grouped? Will my Class 4 child be in the same batch as a Class 10 student?',
      answer:
        'Never! We strictly segregate batches by grade cohorts: Junior (Class 4–6), Middle School (Class 7–9), and Senior (Class 10–12). Debates, vocabulary drills, and topics are matched strictly to the cognitive maturity of each age group.',
    },
    {
      category: 'fees',
      question: 'What is your refund policy if my child doesn’t like the classes?',
      answer:
        'We offer a 100% 7-Day Money-Back Guarantee. Attend the first week of live cohort classes. If you or your child do not feel complete comfort and genuine improvement, simply message our support team on WhatsApp within 7 days of your first batch session for a full refund.',
    },
    {
      category: 'demo',
      question: 'Can parents sit and observe the classes?',
      answer:
        'Yes! Especially for junior school students in Class 4–6, parents are welcome to quietly observe the live class from the background. We also conduct dedicated 1-on-1 parent review calls at the mid-point (Week 6) and final graduation showcase (Week 12).',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Parent Knowledge Base & Support</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Frequently Asked Questions by Parents
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Find transparent answers about our teaching methodology, batch allocations, tech requirements,
              and 100% money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., shy, demo, refund, timings)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'shy', label: 'For Shy Kids' },
            { id: 'demo', label: 'Demo Session' },
            { id: 'schedule', label: 'Schedule & Batches' },
            { id: 'fees', label: 'Fees & Refund' },
            { id: 'tech', label: 'Tech Setup' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No questions found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openItem === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenItem(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60"
                  >
                    <span className="text-base font-bold text-slate-900">{faq.question}</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Admissions Desk */}
        <div className="p-8 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Still have a specific question about your child?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Our admissions mentors are happy to speak with you directly and recommend the ideal cohort.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {(() => {
                const rawWhatsapp = (branding?.supportWhatsapp || '7004132088').replace(/\D/g, '');
                const cleanWhatsapp = rawWhatsapp.startsWith('91') ? rawWhatsapp : (rawWhatsapp ? `91${rawWhatsapp}` : '917004132088');
                return (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=Hi,%20I%20have%20questions%20about%20Upspeaq%20classes%20for%20my%20child.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Us</span>
                  </a>
                );
              })()}
              <a
                href={`tel:${branding.contactPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Admissions</span>
              </a>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to See the Transformation?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Book a free 45-minute live assessment demo. Zero fees, zero risk, and complete diagnostic clarity.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            BOOK A FREE DEMO
          </button>
        </div>
      </section>
    </div>
  );
};
