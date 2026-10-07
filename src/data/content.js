// ─────────────────────────────────────────────────────────────
//  All editable site content lives in this file.
//  To use your own photos: drop them in /public/images/ and
//  replace the URLs below with e.g. '/images/dr-ayesha.jpg'.
//  Clinic gallery photos: just drop them into src/assets/clinic/.
// ─────────────────────────────────────────────────────────────

import doctorImg from '../assets/doctor/doctor.jpg';
import doctorAvatarImg from '../assets/doctor/doctor-avatar.jpg';
import braces1 from '../assets/cases/braces-1-before.jpg';
import braces2 from '../assets/cases/braces-2-during.jpg';
import braces3 from '../assets/cases/braces-3-after.jpg';

const u = (id, w = 900, extra = '') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${extra}`;

export const CONTACT = {
  phoneDisplay: '01863-409867',
  phoneTel: '+8801863409867',
  whatsapp: '8801863409867',
  email: 'drayeshadentoshine92@gmail.com',
  mapQuery: 'Sonargaon Janapath Road, Sector 11, Uttara, Dhaka 1230',
  // Consulting hours in 24h format (Asia/Dhaka). Used for the live "Open now" badge.
  openMinutes: 17 * 60, // 5:00 PM
  closeMinutes: 21 * 60 + 30, // 9:30 PM
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const IMAGES = {
  // Hero shows the clinic; the doctor appears in the About section
  // (and as a small avatar on the hero badge) so her photo isn't repeated large.
  // TODO: a photo of the real Dent-O-Shine chamber works great here.
  hero: u('1629909613638-0e4a1fad8f81', 900, '&h=1100'),
  doctor: doctorImg,
  doctorAvatar: doctorAvatarImg,
  // "Why us" visuals: generic dental tech (not rooms, so they don't pass as our clinic)
  why: u('1600170311833-c2cf5280ce49', 1200),
  why2: u('1606811841689-23dfddce3e95', 900),
  services: {
    braces: u('1609840114035-3c981b782dfe', 700),
    rootCanal: u('1588776814546-1ffcf47267a5', 700),
    implants: u('1593022356769-11f762e25ed9', 700),
    whitening: u('1494790108377-be9c29b29330', 700, '&crop=faces'),
    scaling: u('1606811971618-4486d14f3f99', 700),
    surgery: u('1588776813677-77aaf5595b83', 700),
    crowns: u('1468493858157-0da44aaf1d13', 700),
    pediatric: u('1606265752439-1f18756aa5fc', 700),
  },
  // "From our clinic" — loaded automatically from src/assets/clinic/ (see below).
  gallery: [],
};

// Every image dropped into src/assets/clinic/ appears in the gallery,
// ordered by filename (01.jpg, 02.jpg, ...). Stock photos are shown until then.
const clinicPhotos = Object.entries(
  import.meta.glob('../assets/clinic/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    import: 'default',
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

IMAGES.gallery = clinicPhotos.length
  ? clinicPhotos
  : [
      u('1609840114035-3c981b782dfe', 1200),
      u('1609207825181-52d3214556dd', 1200),
      u('1598256989800-fe5f95da9787', 1200),
      u('1606811971618-4486d14f3f99', 1200),
      u('1600170311833-c2cf5280ce49', 1200),
      u('1606811841689-23dfddce3e95', 1200),
    ];

// Real patient cases shown in "Results". Add more by adding entries here
// (and a matching title/desc under results.cases in both languages).
export const CASES = [{ key: 'braces', steps: [braces1, braces2, braces3] }];

const SERVICE_KEYS = ['braces', 'rootCanal', 'implants', 'whitening', 'scaling', 'surgery', 'crowns', 'pediatric'];

const en = {
  nav: { home: 'Home', about: 'Doctor', services: 'Services', results: 'Results', reviews: 'Reviews', contact: 'Contact' },
  callNow: 'Call Now',
  whatsapp: 'WhatsApp',
  status: { open: 'Open now', closed: 'Closed now', opensAt: 'Opens at 5:00 PM', closesAt: 'Closes at 9:30 PM' },
  hero: {
    tagline: 'Styling Your Smile...',
    titleA: 'Healthy teeth,',
    titleB: 'confident smiles.',
    subtitle:
      'An advanced multi speciality dental care in Uttara — gentle treatment, modern equipment and a specialist in oral surgery who truly listens.',
    badgeReg: 'BMDC Reg. No. 6588',
    badgeCare: 'Gentle & painless care',
    badgeSpecialist: 'Oral Surgery Specialist',
    hours: 'Consulting Hour: 5:00 PM – 9:30 PM',
  },
  stats: [
    { value: 8, suffix: '+', label: 'Specialised treatments' },
    { value: 100, suffix: '%', label: 'Sterilised instruments' },
    { value: 1000, suffix: '+', label: 'Happy smiles' },
    { value: 5, suffix: '★', label: 'Patient-first care' },
  ],
  about: {
    eyebrow: 'Meet your dentist',
    name: 'Dr. Ayesha Akter',
    degrees: 'BDS (DU), PGT (OMS, DDC)',
    reg: 'BMDC Reg. No. 6588',
    bio:
      'Dr. Ayesha Akter graduated from the University of Dhaka and completed post-graduate training in Oral & Maxillofacial Surgery at Dhaka Dental College. At Dent-O-Shine she combines surgical precision with a calm, caring chair-side manner — so every patient, from children to seniors, leaves with a healthier and brighter smile.',
    points: [
      'Bachelor of Dental Surgery — University of Dhaka',
      'PGT in Oral & Maxillofacial Surgery — Dhaka Dental College',
      'Registered with Bangladesh Medical & Dental Council',
      'Focus on painless, minimally invasive treatment',
    ],
    cta: 'Book a consultation',
  },
  services: {
    eyebrow: 'Our services',
    title: 'Complete care for every smile',
    subtitle: 'From routine check-ups to advanced surgery — everything under one roof.',
    items: {
      braces: { title: 'Braces & Orthodontics', desc: 'Straighten crooked or gapped teeth with metal, ceramic or clear aligners.' },
      rootCanal: { title: 'Root Canal Treatment', desc: 'Save infected teeth with comfortable, virtually painless RCT.' },
      implants: { title: 'Dental Implants', desc: 'A permanent, natural-looking replacement for missing teeth.' },
      whitening: { title: 'Teeth Whitening', desc: 'Remove stains and brighten your smile by several shades.' },
      scaling: { title: 'Scaling & Cleaning', desc: 'Remove plaque and tartar for healthy gums and fresh breath.' },
      surgery: { title: 'Extraction & Oral Surgery', desc: 'Wisdom teeth and complex surgery by a trained oral surgeon.' },
      crowns: { title: 'Crowns & Bridges', desc: 'Restore broken or missing teeth with strong, tooth-coloured caps.' },
      pediatric: { title: 'Pediatric Dentistry', desc: 'Friendly, fear-free dental care designed for children.' },
    },
  },
  why: {
    eyebrow: 'Why Dent-O-Shine',
    title: 'Modern dentistry with a gentle touch',
    items: [
      { title: 'Specialist-led', desc: 'Treatment planned by a post-graduate trained oral surgeon.' },
      { title: 'Strict sterilisation', desc: 'Autoclaved instruments and single-use disposables for every patient.' },
      { title: 'Painless approach', desc: 'Modern anaesthesia and techniques that keep you comfortable.' },
      { title: 'Convenient evenings', desc: 'Open every evening so you can visit after work or school.' },
    ],
  },
  results: {
    eyebrow: 'Real results',
    title: 'Smile transformations',
    subtitle: 'Real patients, treated at Dent-O-Shine.',
    steps: ['Before', 'During treatment', 'After'],
    cases: {
      braces: {
        title: 'Orthodontic braces',
        desc: 'Crowded, overlapping teeth guided into an even, confident smile.',
      },
    },
    consent: 'Photos shared with patient consent.',
    galleryTitle: 'From our clinic',
    gallerySub: 'Take a look inside our chamber in Sector 11, Uttara.',
  },
  reviews: {
    eyebrow: 'Patient stories',
    title: 'What our patients say',
    // TODO: replace with real patient reviews (e.g. from Google / Facebook)
    items: [
      { name: 'Sample Patient', role: 'Braces treatment', text: 'Replace this with a real review. Patients often mention how gentle and clear the doctor was throughout their braces journey.' },
      { name: 'Sample Patient', role: 'Root canal', text: 'Replace this with a real review. Describe the comfortable root canal experience and the friendly evening appointment.' },
      { name: 'Sample Patient', role: 'Wisdom tooth surgery', text: 'Replace this with a real review. Highlight the expert oral surgery care and smooth recovery.' },
    ],
  },
  contact: {
    eyebrow: 'Visit us',
    title: 'Book your appointment today',
    subtitle: 'Call or send us a WhatsApp message — we will confirm your visit.',
    addressLabel: 'Address',
    address: '1st Floor, #26, Sonargaon Janapath Road, Chawrasta, Sector #11, Uttara, Dhaka-1230',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    hoursLabel: 'Consulting Hour',
    hours: '5:00 PM – 9:30 PM',
    directions: 'Get directions',
    waMessage: 'Hello Dent-O-Shine, I would like to book an appointment with Dr. Ayesha Akter.',
  },
  footer: {
    about: 'An advanced multi speciality dental care in Uttara, Dhaka. Styling your smile with care and precision.',
    quick: 'Quick links',
    reach: 'Reach us',
    rights: 'All rights reserved.',
  },
};

const bn = {
  nav: { home: 'হোম', about: 'ডাক্তার', services: 'সেবাসমূহ', results: 'ফলাফল', reviews: 'মতামত', contact: 'যোগাযোগ' },
  callNow: 'এখনই কল করুন',
  whatsapp: 'হোয়াটসঅ্যাপ',
  status: { open: 'এখন খোলা', closed: 'এখন বন্ধ', opensAt: 'বিকাল ৫:০০ টায় খুলবে', closesAt: 'রাত ৯:৩০ টায় বন্ধ হবে' },
  hero: {
    tagline: 'আপনার হাসিকে সাজাই...',
    titleA: 'সুস্থ দাঁত,',
    titleB: 'আত্মবিশ্বাসী হাসি।',
    subtitle:
      'উত্তরায় একটি অত্যাধুনিক মাল্টি স্পেশালিটি ডেন্টাল কেয়ার — যত্নশীল চিকিৎসা, আধুনিক যন্ত্রপাতি এবং একজন ওরাল সার্জারি বিশেষজ্ঞ যিনি মন দিয়ে আপনার কথা শোনেন।',
    badgeReg: 'বিএমডিসি রেজি. নং ৬৫৮৮',
    badgeCare: 'যত্নশীল ও ব্যথামুক্ত চিকিৎসা',
    badgeSpecialist: 'ওরাল সার্জারি বিশেষজ্ঞ',
    hours: 'চেম্বার সময়: বিকাল ৫:০০ – রাত ৯:৩০',
  },
  stats: [
    { value: 8, suffix: '+', label: 'বিশেষায়িত চিকিৎসা' },
    { value: 100, suffix: '%', label: 'জীবাণুমুক্ত যন্ত্রপাতি' },
    { value: 1000, suffix: '+', label: 'সন্তুষ্ট রোগী' },
    { value: 5, suffix: '★', label: 'রোগীবান্ধব সেবা' },
  ],
  about: {
    eyebrow: 'আপনার ডাক্তারকে জানুন',
    name: 'ডাঃ আয়েশা আক্তার',
    degrees: 'বিডিএস (ঢাবি), পিজিটি (ওএমএস, ডিডিসি)',
    reg: 'বিএমডিসি রেজি. নং ৬৫৮৮',
    bio:
      'ডাঃ আয়েশা আক্তার ঢাকা বিশ্ববিদ্যালয় থেকে বিডিএস সম্পন্ন করেছেন এবং ঢাকা ডেন্টাল কলেজ থেকে ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারিতে পোস্ট-গ্র্যাজুয়েট ট্রেনিং নিয়েছেন। ডেন্ট-ও-শাইনে তিনি দক্ষতা ও আন্তরিক যত্নের সমন্বয়ে চিকিৎসা দেন — যাতে শিশু থেকে বয়স্ক, প্রত্যেকে সুস্থ ও উজ্জ্বল হাসি নিয়ে ফিরে যান।',
    points: [
      'ব্যাচেলর অব ডেন্টাল সার্জারি — ঢাকা বিশ্ববিদ্যালয়',
      'ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারিতে পিজিটি — ঢাকা ডেন্টাল কলেজ',
      'বাংলাদেশ মেডিকেল ও ডেন্টাল কাউন্সিল নিবন্ধিত',
      'ব্যথামুক্ত ও আধুনিক চিকিৎসায় গুরুত্ব',
    ],
    cta: 'অ্যাপয়েন্টমেন্ট নিন',
  },
  services: {
    eyebrow: 'আমাদের সেবা',
    title: 'প্রতিটি হাসির জন্য সম্পূর্ণ যত্ন',
    subtitle: 'নিয়মিত চেকআপ থেকে জটিল সার্জারি — সবকিছু এক জায়গায়।',
    items: {
      braces: { title: 'ব্রেসেস ও অর্থোডন্টিক্স', desc: 'আঁকাবাঁকা বা ফাঁকা দাঁত সোজা করুন মেটাল, সিরামিক বা ক্লিয়ার অ্যালাইনারে।' },
      rootCanal: { title: 'রুট ক্যানাল ট্রিটমেন্ট', desc: 'আরামদায়ক ও প্রায় ব্যথামুক্ত চিকিৎসায় সংক্রমিত দাঁত রক্ষা করুন।' },
      implants: { title: 'ডেন্টাল ইমপ্লান্ট', desc: 'হারানো দাঁতের স্থায়ী ও প্রাকৃতিক সমাধান।' },
      whitening: { title: 'দাঁত সাদা করা', desc: 'দাগ দূর করে দাঁতকে কয়েক শেড উজ্জ্বল করুন।' },
      scaling: { title: 'স্কেলিং ও ক্লিনিং', desc: 'পাথর ও প্লাক দূর করে সুস্থ মাড়ি ও সতেজ নিঃশ্বাস।' },
      surgery: { title: 'দাঁত তোলা ও ওরাল সার্জারি', desc: 'আক্কেল দাঁতসহ জটিল সার্জারি প্রশিক্ষিত ওরাল সার্জনের হাতে।' },
      crowns: { title: 'ক্রাউন ও ব্রিজ', desc: 'ভাঙা বা হারানো দাঁত মজবুত ও দাঁতের রঙের ক্যাপে পুনর্গঠন।' },
      pediatric: { title: 'শিশু দন্তচিকিৎসা', desc: 'শিশুদের জন্য বন্ধুসুলভ ও ভয়মুক্ত দাঁতের চিকিৎসা।' },
    },
  },
  why: {
    eyebrow: 'কেন ডেন্ট-ও-শাইন',
    title: 'আধুনিক দন্তচিকিৎসা, কোমল যত্নে',
    items: [
      { title: 'বিশেষজ্ঞ চিকিৎসা', desc: 'পোস্ট-গ্র্যাজুয়েট প্রশিক্ষিত ওরাল সার্জনের পরিকল্পনায় চিকিৎসা।' },
      { title: 'কঠোর জীবাণুমুক্তকরণ', desc: 'প্রতিটি রোগীর জন্য অটোক্লেভড যন্ত্র ও একবার ব্যবহারযোগ্য সামগ্রী।' },
      { title: 'ব্যথামুক্ত পদ্ধতি', desc: 'আধুনিক অ্যানেসথেসিয়া ও কৌশলে আরামদায়ক চিকিৎসা।' },
      { title: 'সুবিধাজনক সন্ধ্যা', desc: 'প্রতি সন্ধ্যায় খোলা — অফিস বা স্কুলের পরেই আসুন।' },
    ],
  },
  results: {
    eyebrow: 'আসল ফলাফল',
    title: 'হাসির রূপান্তর',
    subtitle: 'ডেন্ট-ও-শাইনে চিকিৎসা নেওয়া আসল রোগীদের ছবি।',
    steps: ['আগে', 'চিকিৎসা চলাকালীন', 'পরে'],
    cases: {
      braces: {
        title: 'অর্থোডন্টিক ব্রেসেস',
        desc: 'আঁকাবাঁকা ও এলোমেলো দাঁত সোজা হয়ে সুন্দর, আত্মবিশ্বাসী হাসি।',
      },
    },
    consent: 'রোগীর সম্মতিতে প্রকাশিত ছবি।',
    galleryTitle: 'আমাদের চেম্বার থেকে',
    gallerySub: 'উত্তরা সেক্টর ১১-এ আমাদের চেম্বারের এক ঝলক।',
  },
  reviews: {
    eyebrow: 'রোগীদের কথা',
    title: 'রোগীরা যা বলেন',
    items: [
      { name: 'নমুনা রোগী', role: 'ব্রেসেস চিকিৎসা', text: 'এখানে একটি আসল রিভিউ বসান। রোগীরা প্রায়ই ব্রেসেস চিকিৎসায় ডাক্তারের যত্ন ও স্পষ্ট ব্যাখ্যার কথা বলেন।' },
      { name: 'নমুনা রোগী', role: 'রুট ক্যানাল', text: 'এখানে একটি আসল রিভিউ বসান। আরামদায়ক রুট ক্যানাল ও সন্ধ্যার সুবিধাজনক সময়ের অভিজ্ঞতা লিখুন।' },
      { name: 'নমুনা রোগী', role: 'আক্কেল দাঁত সার্জারি', text: 'এখানে একটি আসল রিভিউ বসান। দক্ষ ওরাল সার্জারি ও দ্রুত সেরে ওঠার কথা তুলে ধরুন।' },
    ],
  },
  contact: {
    eyebrow: 'আমাদের ঠিকানা',
    title: 'আজই অ্যাপয়েন্টমেন্ট নিন',
    subtitle: 'কল করুন বা হোয়াটসঅ্যাপে মেসেজ দিন — আমরা আপনার সময় নিশ্চিত করব।',
    addressLabel: 'ঠিকানা',
    address: '১ম তলা, #২৬, সোনারগাঁও জনপথ রোড, চৌরাস্তা, সেক্টর #১১, উত্তরা, ঢাকা-১২৩০',
    phoneLabel: 'ফোন',
    emailLabel: 'ইমেইল',
    hoursLabel: 'চেম্বার সময়',
    hours: 'বিকাল ৫:০০ – রাত ৯:৩০',
    directions: 'দিকনির্দেশনা',
    waMessage: 'হ্যালো ডেন্ট-ও-শাইন, আমি ডাঃ আয়েশা আক্তারের সাথে একটি অ্যাপয়েন্টমেন্ট নিতে চাই।',
  },
  footer: {
    about: 'উত্তরা, ঢাকায় একটি অত্যাধুনিক মাল্টি স্পেশালিটি ডেন্টাল কেয়ার। যত্ন ও দক্ষতায় আপনার হাসিকে সাজাই।',
    quick: 'দ্রুত লিংক',
    reach: 'যোগাযোগ',
    rights: 'সর্বস্বত্ব সংরক্ষিত।',
  },
};

export const translations = { en, bn };
export { SERVICE_KEYS };

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBnDigits = (s) => String(s).replace(/\d/g, (d) => BN_DIGITS[d]);
