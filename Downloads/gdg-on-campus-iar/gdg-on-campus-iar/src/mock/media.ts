export interface MediaPost {
  id: string;
  platform: 'linkedin' | 'instagram' | 'twitter' | 'youtube';
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  date: string;
  author?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'update' | 'achievement' | 'general';
  link?: string;
  pinned?: boolean;
}

/* ── Social Media Posts ──────────────────────────────── */
export const mockMedia: MediaPost[] = [
  {
    id: 'media-1',
    platform: 'linkedin',
    title: 'GDGoC IAR — Team Selections 2025-26',
    description: 'Thrilled to announce our new core team! Congratulations to everyone who made it. Let\'s build something impactful together this year 🚀',
    thumbnail: 'https://picsum.photos/seed/gdgoc-team/600/400',
    url: 'https://linkedin.com',
    date: '2026-03-10',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-2',
    platform: 'instagram',
    title: 'Workshop Highlights — Flutter Forward',
    description: 'An incredible session on building beautiful cross-platform apps with Flutter. 60+ attendees, hands-on demos, and a lot of learning! 🎯',
    thumbnail: 'https://picsum.photos/seed/flutter-workshop/600/400',
    url: 'https://instagram.com',
    date: '2026-03-05',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-3',
    platform: 'youtube',
    title: 'Gemini AI — What\'s New in 2026',
    description: 'Our latest tech talk covering Gemini AI advances, multimodal capabilities, and how students can leverage AI in their projects.',
    thumbnail: 'https://picsum.photos/seed/gemini-talk/600/400',
    url: 'https://youtube.com',
    date: '2026-02-28',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-4',
    platform: 'linkedin',
    title: 'Hackathon Victory — Smart Campus App',
    description: 'Our team won 1st place at the regional hackathon with a smart campus management system built on Firebase & Flutter.',
    thumbnail: 'https://picsum.photos/seed/hackathon-win/600/400',
    url: 'https://linkedin.com',
    date: '2026-02-20',
    author: 'Jeet Chauhan',
  },
  {
    id: 'media-5',
    platform: 'instagram',
    title: 'Community Meetup — February Edition',
    description: 'Monthly community meetup with 80+ developers networking, sharing projects, and having a great time together.',
    thumbnail: 'https://picsum.photos/seed/meetup-feb/600/400',
    url: 'https://instagram.com',
    date: '2026-02-15',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-6',
    platform: 'twitter',
    title: 'Google Cloud Study Jam — Registration Open',
    description: 'Free 4-week program to learn Google Cloud fundamentals. Certificates, swag, and hands-on labs included! Register now.',
    thumbnail: 'https://picsum.photos/seed/cloud-studyjam/600/400',
    url: 'https://twitter.com',
    date: '2026-02-10',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-7',
    platform: 'youtube',
    title: 'Android Development Bootcamp — Day 1 Recap',
    description: 'Kicked off our 5-day Android bootcamp with Kotlin fundamentals & Jetpack Compose. Recap of day 1 sessions.',
    thumbnail: 'https://picsum.photos/seed/android-bootcamp/600/400',
    url: 'https://youtube.com',
    date: '2026-02-05',
    author: 'GDGoC IAR',
  },
  {
    id: 'media-8',
    platform: 'linkedin',
    title: 'GDGoC IAR Recognized as Top Chapter',
    description: 'Honored to be recognized among the top-performing Google Developer Groups chapters globally. Thank you to our entire community!',
    thumbnail: 'https://picsum.photos/seed/top-chapter/600/400',
    url: 'https://linkedin.com',
    date: '2026-01-28',
    author: 'Anuj Bhadouria',
  },
  {
    id: 'media-9',
    platform: 'instagram',
    title: 'Open Source Contribution Sprint',
    description: '48 hours of intense open-source contributions. Our members submitted 120+ PRs across multiple Google open-source projects.',
    thumbnail: 'https://picsum.photos/seed/oss-sprint/600/400',
    url: 'https://instagram.com',
    date: '2026-01-20',
    author: 'GDGoC IAR',
  },
];

/* ── Announcements ───────────────────────────────────── */
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'GDGoC IAR Core Team 2025-26 Announced! 🎉',
    description: 'Congratulations to all selected members across Tech, Documentation, Marketing, Outreach, and Operations teams. Welcome aboard!',
    date: '2026-03-10',
    type: 'update',
    link: '/team',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Flutter Forward Workshop — March 15',
    description: 'Join us for a hands-on Flutter workshop covering state management, animations, and deploying to Play Store. Open to all skill levels.',
    date: '2026-03-08',
    type: 'event',
    link: '/events',
  },
  {
    id: 'ann-3',
    title: 'Google Cloud Study Jam — Registrations Open',
    description: 'Free 4-week program to learn Google Cloud. Earn badges, get certified, and win exclusive swag. Limited seats!',
    date: '2026-03-05',
    type: 'event',
    link: '/events',
  },
  {
    id: 'ann-4',
    title: 'GDGoC IAR — Top Chapter Recognition',
    description: 'We\'ve been recognized among the highest-performing GDG on Campus chapters worldwide. Thank you for making this possible!',
    date: '2026-02-28',
    type: 'achievement',
  },
  {
    id: 'ann-5',
    title: 'New Media Page Launched 📷',
    description: 'Check out our new Media page to stay updated with our latest LinkedIn posts, Instagram highlights, YouTube talks, and more.',
    date: '2026-02-25',
    type: 'update',
    link: '/media',
  },
  {
    id: 'ann-6',
    title: 'Hackathon Season is Here! 🏆',
    description: 'Get ready for back-to-back hackathons this semester. Form your teams and start ideating. Details dropping soon.',
    date: '2026-02-20',
    type: 'event',
  },
];
