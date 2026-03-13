export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subTeam: string;
  avatar: string;
  bio: string;
  isLead?: boolean;
  isCampusLead?: boolean;
  socials: {
    linkedin?: string;
    gmail?: string;
    github?: string;
  };
}

/* ── Campus Leads ────────────────────────────────────── */
export const campusLeads: TeamMember[] = [
  {
    id: 'cl-1',
    name: 'Jeet Chauhan',
    role: 'Campus Lead',
    subTeam: 'Leadership',
    avatar: 'https://picsum.photos/seed/jeetchauhan/400',
    bio: 'Driving the vision of GDG on Campus IAR — empowering students to learn, build, and grow through technology and community.',
    isCampusLead: true,
    socials: {
      linkedin: 'https://linkedin.com',
      gmail: 'mailto:jeet@example.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'cl-2',
    name: 'Anuj Bhadouria',
    role: 'Campus Lead',
    subTeam: 'Leadership',
    avatar: 'https://picsum.photos/seed/anujbhadouria/400',
    bio: 'Passionate about building impactful developer communities and creating opportunities for every student on campus.',
    isCampusLead: true,
    socials: {
      linkedin: 'https://linkedin.com',
      gmail: 'mailto:anuj@example.com',
      github: 'https://github.com',
    },
  },
];

/* backward-compat: single campusLead alias */
export const campusLead = campusLeads[0];

/* ── All Team Members ────────────────────────────────── */
export const mockTeam: TeamMember[] = [
  /* ── 💻 Tech Team ───────────────────────────────── */
  {
    id: 't-1',
    name: 'Manthan Balani',
    role: 'Tech Lead',
    subTeam: 'Technical',
    avatar: 'https://picsum.photos/seed/manthanbalani/400',
    bio: 'Leading the tech team — building scalable solutions and fostering engineering excellence.',
    isLead: true,
    socials: { linkedin: 'https://linkedin.com', gmail: 'mailto:manthan@example.com', github: 'https://github.com' },
  },
  {
    id: 't-2',
    name: 'Chidatma Patel',
    role: 'Developer',
    subTeam: 'Technical',
    avatar: 'https://picsum.photos/seed/chidatmapatel/400',
    bio: 'Turning ideas into code, one commit at a time.',
    socials: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
  },
  {
    id: 't-3',
    name: 'Devashya Jethva',
    role: 'Developer',
    subTeam: 'Technical',
    avatar: 'https://picsum.photos/seed/devashyajethva/400',
    bio: 'Passionate about web technologies and open-source contributions.',
    socials: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
  },
  {
    id: 't-4',
    name: 'Neil',
    role: 'Developer',
    subTeam: 'Technical',
    avatar: 'https://picsum.photos/seed/neildev/400',
    bio: 'Building cool stuff with modern frameworks and tools.',
    socials: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
  },

  /* ── 📝 Documentation Team ──────────────────────── */
  {
    id: 'doc-1',
    name: 'Naitri Mori',
    role: 'Documentation Lead',
    subTeam: 'Documentation',
    avatar: 'https://picsum.photos/seed/naitrimori/400',
    bio: 'Making knowledge accessible through clear, thorough documentation.',
    isLead: true,
    socials: { linkedin: 'https://linkedin.com', gmail: 'mailto:naitri@example.com' },
  },
  {
    id: 'doc-2',
    name: 'Alifiya Pisawadi',
    role: 'Technical Writer',
    subTeam: 'Documentation',
    avatar: 'https://picsum.photos/seed/alifiyapisawadi/400',
    bio: 'Translating complex tech into easy-to-follow guides.',
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    id: 'doc-3',
    name: 'Ruhan Chanchalani',
    role: 'Technical Writer',
    subTeam: 'Documentation',
    avatar: 'https://picsum.photos/seed/ruhanchanchalani/400',
    bio: 'Documenting the journey, one page at a time.',
    socials: { linkedin: 'https://linkedin.com' },
  },

  /* ── 📢 Marketing Team ──────────────────────────── */
  {
    id: 'm-1',
    name: 'Dhruvil Mamtora',
    role: 'Marketing Lead',
    subTeam: 'Marketing',
    avatar: 'https://picsum.photos/seed/dhruvilmamtora/400',
    bio: 'Spreading the word and building the GDGoC IAR brand on campus.',
    isLead: true,
    socials: { linkedin: 'https://linkedin.com', gmail: 'mailto:dhruvil@example.com' },
  },
  {
    id: 'm-2',
    name: 'Chauhan Rajvardhansingh',
    role: 'Marketing Executive',
    subTeam: 'Marketing',
    avatar: 'https://picsum.photos/seed/rajvardhan/400',
    bio: 'Creating engaging campaigns that connect with our community.',
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    id: 'm-3',
    name: 'Radhe M Thakkar',
    role: 'Marketing Executive',
    subTeam: 'Marketing',
    avatar: 'https://picsum.photos/seed/radhethakkar/400',
    bio: 'Driving outreach and engagement across all channels.',
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    id: 'm-4',
    name: 'Janvi Verma',
    role: 'Marketing Executive',
    subTeam: 'Marketing',
    avatar: 'https://picsum.photos/seed/janviverma/400',
    bio: 'Content creator with a knack for storytelling.',
    socials: { linkedin: 'https://linkedin.com' },
  },

  /* ── 🤝 Outreach Team ───────────────────────────── */
  {
    id: 'out-1',
    name: 'Shailey Maheshwari',
    role: 'Outreach Lead',
    subTeam: 'Outreach',
    avatar: 'https://picsum.photos/seed/shaileymaheshwari/400',
    bio: 'Building bridges between GDGoC IAR and the wider tech ecosystem.',
    isLead: true,
    socials: { linkedin: 'https://linkedin.com', gmail: 'mailto:shailey@example.com' },
  },
  {
    id: 'out-2',
    name: 'Diya Dave',
    role: 'Outreach Executive',
    subTeam: 'Outreach',
    avatar: 'https://picsum.photos/seed/diyadave/400',
    bio: 'Connecting communities and fostering meaningful partnerships.',
    socials: { linkedin: 'https://linkedin.com' },
  },

  /* ── ⚙️ Operations Team ─────────────────────────── */
  {
    id: 'o-1',
    name: 'Trusha Kansara',
    role: 'Operations Lead',
    subTeam: 'Operations',
    avatar: 'https://picsum.photos/seed/trushakansara/400',
    bio: 'Orchestrating events and keeping everything running like clockwork.',
    isLead: true,
    socials: { linkedin: 'https://linkedin.com', gmail: 'mailto:trusha@example.com' },
  },
  {
    id: 'o-2',
    name: 'Vachna Shah',
    role: 'Operations Executive',
    subTeam: 'Operations',
    avatar: 'https://picsum.photos/seed/vachnashah/400',
    bio: 'Making sure every event detail is flawlessly executed.',
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    id: 'o-3',
    name: 'Shrusti Chauhan',
    role: 'Operations Executive',
    subTeam: 'Operations',
    avatar: 'https://picsum.photos/seed/shrusichauhan/400',
    bio: 'Planning and coordinating community activities with precision.',
    socials: { linkedin: 'https://linkedin.com' },
  },
];
