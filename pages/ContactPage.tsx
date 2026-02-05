
import React, { useState } from 'react';
import { COMPANY_INFO } from '../constants';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send to API
  };

  return (
    <div className="bg-white pb-24">
      {/* Header */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 brand-font">Get In Touch</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Need immediate help with a claim or have a question? We're here for you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-900 text-white p-10 rounded-[40px] shadow-2xl">
              <h2 className="text-3xl font-bold mb-10 brand-font">Contact Information</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-1">Our Location</p>
                    <p className="text-lg font-medium">{COMPANY_INFO.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-lg font-medium">{COMPANY_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-lg font-medium">{COMPANY_INFO.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-blue-800">
                <p className="text-blue-400 text-sm italic">"We usually respond to all inquiries within 24 business hours."</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 lg:p-16 rounded-[40px] shadow-xl border border-slate-100">
              {submitted ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h2>
                  <p className="text-slate-600 text-lg mb-10">Thank you for reaching out. One of our advocates will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-4 bg-blue-900 text-white rounded-full font-bold hover:bg-sky-600 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-10 brand-font">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe" 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="john@example.com" 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Subject</label>
                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all">
                          <option>General Inquiry</option>
                          <option>Claim Support</option>
                          <option>Basic Advocacy Plan ($49.99/mo)</option>
                          <option>Premium Advocacy Plan ($499/yr)</option>
                          <option>Auto Buying Assistance</option>
                          <option>Territory Partner Program</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Tell us how we can help..." 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all resize-none"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 group"
                    >
                      Send Message <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
