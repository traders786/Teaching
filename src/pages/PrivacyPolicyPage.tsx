import React from 'react';
import { BrandingConfig } from '../types';
import { ShieldCheck, Lock, Eye, CheckCircle2, ArrowLeft, ArrowRight, UserCheck, Scale, Mail, Phone } from 'lucide-react';

interface PrivacyPolicyPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onNavigateHome: () => void;
  onNavigateTerms: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  branding,
  onOpenDemoModal,
  onNavigateHome,
  onNavigateTerms,
}) => {
  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen text-left">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 lg:py-18 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Minor Safety & Data Protection Protocol</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-heading">
              Privacy Policy & Minor Safety
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-body max-w-3xl font-medium">
              We at {branding.brandName} recognize the critical importance of safeguarding your family's personal information. This Privacy Policy details our practices regarding information collection, child safety, encryption, and data rights.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>Last Updated: September 20, 2026</span>
              <span>•</span>
              <span>In compliance with IT (Intermediary Guidelines & SPDI) Rules, 2011 (India)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Document Body */}
      <section className="py-12 lg:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-slate-200 shadow-sm space-y-10 font-body text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">1</span>
              <span>Scope & Legal Applicability</span>
            </h2>
            <p>
              This Privacy Policy (the <strong>“Policy”</strong>) applies to all visitors, enrolled students, registered parents, and users accessing our website, web application, live speech classrooms, and administrative portals (collectively, the <strong>“Platform”</strong>), owned and operated by <strong>{branding.brandName}</strong> (hereinafter referred to as <strong>“We”</strong>, <strong>“Us”</strong>, or <strong>“Company”</strong>).
            </p>
            <p>
              “Personal Information” or “Sensitive Personal Data or Information” (SPDI) bears the meaning ascribed to it under the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>. By using our Platform, you expressly consent to the collection, processing, and handling of information as described in this Policy.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              We collect information solely to provide, personalize, and continually elevate our speech, public speaking, and debate educational services:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">A. Parent & Contact Information</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Parent's full name, email address, mobile phone number, WhatsApp contact, city/state, and billing details provided during registration or demo booking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">B. Student Academic & Diagnostic Profile</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Student's first name, age, grade/class level (Grades UKG to 10), school name, spoken English comfort baseline, and extempore diagnostic observations recorded during speech sessions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">C. Payment & Billing Details</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  When you purchase courses, transaction identifiers and billing addresses are processed via RBI-authorized payment partners (e.g. Razorpay, CC Avenue, Stripe, UPI). <strong>We NEVER store raw credit card numbers, CVV codes, or net banking passwords on our servers.</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">D. Live Classroom Audio & Video Data</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Recordings of live classroom extempore speeches, voice modulation drills, debate cross-examinations, and educator coaching feedback, captured exclusively for child safety monitoring, homework revision, and parent progress reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>
              {branding.brandName} utilizes collected information for legitimate educational and operational purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Class Delivery:</strong> Scheduling live small-group batches, assigning specialized speech mentors, and conducting 1-on-1 coaching sessions.</li>
              <li><strong>Progress Reporting:</strong> Generating personalized weekly WhatsApp updates for parents tracking vocabulary expansion, filler word reduction, and stage confidence.</li>
              <li><strong>Parent Communication:</strong> Sending automated batch reminder alerts, homework assignments, schedule confirmations, and invoice receipts via WhatsApp, SMS, and email.</li>
              <li><strong>Child Safety & Educator Audits:</strong> Reviewing classroom interactions to maintain strict POSH child-safety protocols, zero-shame encouragement, and mentor excellence.</li>
              <li><strong>Platform Security:</strong> Detecting and preventing unauthorized logins, account sharing, and fraudulent activities.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">4</span>
              <span>No Sale of Personal Data & Third-Party Disclosures</span>
            </h2>
            <p>
              <strong>4.1 We NEVER Sell or Rent Data:</strong> {branding.brandName} strictly does NOT sell, rent, trade, or monetize your or your child's personal information to commercial data brokers, advertising networks, or third-party marketers.
            </p>
            <p>
              <strong>4.2 Limited Operational Sharing:</strong> Information is disclosed strictly on a need-to-know basis to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Certified Educators:</strong> Only relevant student speech profiles are shared with assigned mentors to deliver personalized coaching.</li>
              <li><strong>Infrastructure & Service Providers:</strong> Trusted cloud infrastructure (AWS/Google Cloud), encrypted video servers, SMS/WhatsApp gateways, and authorized payment gateways bound by strict non-disclosure obligations.</li>
              <li><strong>Legal & Statutory Mandates:</strong> Where required by applicable Indian law, court subpoena, or statutory government authority.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">5</span>
              <span>Child Safety & Minor Protection Framework</span>
            </h2>
            <p>
              <strong>5.1 Parental Gate:</strong> Minor students under 18 cannot independently create billing accounts without verified parent/guardian consent.
            </p>
            <p>
              <strong>5.2 POSH & Educator Vetting:</strong> All {branding.brandName} mentors undergo stringent background checks, identity verification, and pedagogical training to ensure every live classroom is a positive, supportive, and completely safe environment.
            </p>
            <p>
              <strong>5.3 Controlled Classroom Access:</strong> Live video classrooms are protected with secure access tokens. Only enrolled students and authorized mentors are admitted.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">6</span>
              <span>Data Security & Encryption Measures</span>
            </h2>
            <p>
              We implement industry-standard administrative, technical, and physical safeguards to protect information against unauthorized access, alteration, or disclosure:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end SSL/TLS encryption for all web and API data transmissions.</li>
              <li>Encrypted database storage and secure access controls with multi-factor authentication.</li>
              <li>Periodic security vulnerability assessments and access audit logs.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">7</span>
              <span>Your Rights: Access, Correction & Deletion</span>
            </h2>
            <p>
              Parents maintain full control over their family's information. You may at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request a copy of the personal information stored in your ward's student profile.</li>
              <li>Request corrections or updates to contact details, mobile numbers, or student academic grade.</li>
              <li>Request deletion or erasure of your student profile upon completion of courses by writing to <a href={`mailto:${branding.contactEmail}`} className="text-amber-700 font-bold underline">{branding.contactEmail}</a>.</li>
              <li>Opt-out of promotional communications by replying "STOP" or notifying support.</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">8</span>
              <span>Cookies & Web Analytics</span>
            </h2>
            <p>
              Our website uses basic session cookies and aggregated analytics tools (such as Google Analytics) to analyze user traffic patterns, measure page load performance, and optimize usability. You can configure your browser to reject cookies, though certain interactive portal features may function with reduced convenience.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">9</span>
              <span>Grievance Officer & Official Contact Details</span>
            </h2>
            <p>
              In accordance with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, the designated Grievance Officer for data protection and privacy inquiries is:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <p><strong>Designated Grievance Officer:</strong> Data Privacy & Minor Safety Compliance</p>
              <p><strong>Platform:</strong> {branding.brandName} Spoken English & Communication</p>
              <p><strong>Official Email:</strong> <a href={`mailto:${branding.contactEmail}`} className="text-amber-700 font-bold underline">{branding.contactEmail}</a></p>
              <p><strong>Admissions & Support Phone:</strong> {branding.contactPhone}</p>
              <p><strong>WhatsApp Support:</strong> {branding.supportWhatsapp}</p>
              <p><strong>Response Time:</strong> We endeavor to address and resolve all legitimate privacy concerns within 15 working days.</p>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onNavigateTerms}
            className="text-xs sm:text-sm font-black text-amber-800 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <span>Read Terms & Conditions</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDemoModal}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm font-heading flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <span>Book a Free Demo Class</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </section>

    </div>
  );
};
