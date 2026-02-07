
import { CMSPage, CMSSettings, CMSPricingPlan, CMSFAQ } from './types';

export const COMPANY_INFO = {
  name: 'Warranty Advocates LLC',
  location: 'Fort Myers, Florida',
  phone: '+1 239-499-3100',
  email: 'info@warrantyadvocatellc.com',
  tagline: 'Real People. Real Warranty Help.',
  subline: 'We help homeowners and car owners file warranty claims, get refunds, and avoid costly mistakes.'
};

export const PRICING = {
  basic: 49.99,
  premium: 499,
  autoBuying: 499,
  autoClaim: {
    rate: '20%',
    minFee: 250
  }
};

export const INITIAL_PRICING: CMSPricingPlan[] = [
  {
    id: 'plan-free',
    name: 'Free Tier',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 Advocacy Claim', 'Basic Vault Access', 'Knowledge Base Access'],
    label: 'START HERE',
    isActive: true,
    order: 1
  },
  {
    id: 'plan-basic',
    name: 'Basic Advocacy',
    priceMonthly: 49.99,
    priceYearly: 499,
    features: ['Unlimited Claims', 'Full Vault Access', 'Maintenance Reminders'],
    label: 'MONTHLY',
    isActive: true,
    order: 2
  },
  {
    id: 'plan-premium',
    name: 'Premium Advocacy',
    priceMonthly: 49,
    priceYearly: 499,
    features: ['Everything in Basic', '2 Months FREE Included', 'Priority Advocacy'],
    label: 'BEST VALUE',
    isActive: true,
    order: 3
  }
];

export const INITIAL_FAQS: CMSFAQ[] = [
  {
    id: 'faq-1',
    question: 'What is Warranty Advocates?',
    answer: 'We are a dedicated team of experts that manage your warranties and advocate on your behalf to ensure you get the repairs or refunds you deserve without the runaround.',
    isActive: true,
    order: 1
  },
  {
    id: 'faq-2',
    question: 'How many claims can I file?',
    answer: 'With our Basic and Premium Advocacy Plans, you can file an unlimited number of claims for both your home and auto warranties.',
    isActive: true,
    order: 2
  },
  {
    id: 'faq-3',
    question: 'What is the difference between the Basic and Premium plans?',
    answer: 'The Basic Advocacy Plan is $49.99 billed monthly, ideal for ongoing protection. The Premium Advocacy Plan is $499 billed annually, offering the same elite advocacy with a cost-saving yearly commitment.',
    isActive: true,
    order: 3
  },
  {
    id: 'faq-4',
    question: 'Do you handle auto warranty claims?',
    answer: 'Yes, we specialize in both home and auto warranty advocacy, helping you navigate complex repair denials and refund processes regardless of the vehicle brand.',
    isActive: true,
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How does auto buying assistance work?',
    answer: 'Our experts handle the negotiations, warranty audits, and fee validations with dealerships to ensure you get the best possible price without the dealership stress.',
    isActive: true,
    order: 5
  },
  {
    id: 'faq-6',
    question: 'Can I upload my documents?',
    answer: 'Absolutely. Our secure Warranty Vault allows you to digitally store all your contracts, receipts, and maintenance logs in one encrypted dashboard.',
    isActive: true,
    order: 6
  }
];

// Seed data for CMS initialization
export const INITIAL_PAGES: CMSPage[] = [
  {
    slug: 'home',
    title: 'Home',
    lastUpdated: new Date().toISOString(),
    sections: [
      { 
        id: 'h1', 
        type: 'hero', 
        title: 'Real People. Real Warranty Help.', 
        subtitle: 'We help homeowners and car owners file warranty claims, get refunds, and avoid costly mistakes.', 
        buttonLabel: 'Get Started Free', 
        buttonUrl: '/signup', 
        isVisible: true, 
        order: 1 
      },
      { id: 'h2', type: 'features', title: 'How We Advocate For You', subtitle: 'We handle the stress, phone calls, and paperwork so you don\'t have to.', items: [], isVisible: true, order: 2 }
    ]
  },
  { slug: 'how-it-works', title: 'How It Works', lastUpdated: new Date().toISOString(), sections: [] },
  { slug: 'services', title: 'Services', lastUpdated: new Date().toISOString(), sections: [] },
  { slug: 'faq', title: 'FAQ', lastUpdated: new Date().toISOString(), sections: [] },
  { slug: 'contact', title: 'Contact', lastUpdated: new Date().toISOString(), sections: [] }
];

export const INITIAL_SETTINGS: CMSSettings = {
  logoUrl: '',
  logoWidth: 180,
  footerLogoUrl: '',
  footerLogoWidth: 140,
  faviconUrl: '',
  phone: '+1 239-499-3100',
  email: 'info@warrantyadvocatellc.com',
  address: 'Fort Myers, Florida',
  socials: { facebook: '#', twitter: '#', linkedin: '#' },
  footerText: 'We empower homeowners and vehicle owners with professional warranty advocacy. Our mission is to ensure you get the protection you paid for.',
  copyrightText: '© 2025 Warranty Advocates LLC. All rights reserved. Registered in Florida.',
  brandPrimary: '#1e3a8a'
};
