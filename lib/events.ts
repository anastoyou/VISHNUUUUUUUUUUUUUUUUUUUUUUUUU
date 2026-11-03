export type EventType = 'invitation' | 'reception';

export interface TimelineItem {
  time: string;
  icon: string;
  title: string;
  sub?: string;
  desc: string;
  tag: string;
  highlight?: boolean;
  ribbon?: string;
}

export interface FamilyPerson {
  relation: string;
  names: string[];
}

export interface WeddingEventData {
  id: EventType;
  pageTitle: string;
  ogTitle: string;
  ogDesc: string;
  tagline: string;
  heroDate: string;
  heroSubtext: string;
  badgeText: string;
  announcementDate: string;
  timingPill: string;
  quote: string;
  groom: {
    name: string;
    parents: string;
    grandparents: string[];
  };
  bride: {
    name: string;
    parents: string;
    grandparents: string[];
  };
  withLove: string[];
  contacts: string[];
  familyAddress: {
    line1: string;
    line2: string;
    line3: string;
  };
  timelineTitle: string;
  timelineSubtitle: string;
  countdownHeading: string;
  countdownTarget: string; // ISO string
  venueName: string;
  venueLocationSub: string;
  venueBlockTitle: string;
  venueBlockDesc: string;
  venueTiming: string;
  templeMentioned?: string;
  mapUrl: string;
  phone: string;
  whatsappNumber: string;
  whatsappMsg: string;
  calendarSummary: string;
  calendarDetails: string;
  calendarLocation: string;
  startUtc: string;
  endUtc: string;
}

export const EVENT_DATA: Record<EventType, WeddingEventData> = {
  invitation: {
    id: 'invitation',
    pageTitle: 'Vishnu & Vani — Wedding Invitation',
    ogTitle: 'Wedding Invitation: Vishnu & Vani',
    ogDesc: 'Wednesday, 11 November 2026 • PMR Auditorium, Kuzhalmannam, Palakkad',
    tagline: 'Wedding Ceremony',
    heroDate: 'Wednesday, 11 November 2026',
    heroSubtext: 'Together with their families',
    badgeText: 'Wedding Ceremony',
    announcementDate: 'Wednesday, 11 November 2026',
    timingPill: '11:00 AM – 12:00 PM',
    quote: 'Together with their families, we cordially invite you to celebrate the wedding of Vishnu & Vani.',
    groom: {
      name: 'Vishnu',
      parents: 'Mr. Ramesh Kumar & Mrs. Girija V',
      grandparents: [
        'Late V.V. Nair & Late V. Sarada',
        'Late Ravindranath Pillai & Late Kunjikali Amma'
      ]
    },
    bride: {
      name: 'Vani',
      parents: 'Late Suveendran R & Prema K',
      grandparents: ['Late Raman K & Late Sarojini A']
    },
    withLove: ['Jishnu V', 'Pradeep V'],
    contacts: ['941777114', '9072937020'],
    familyAddress: {
      line1: 'Kunnath House,',
      line2: 'Kanakkanur, Manapadam (PO),',
      line3: 'Palakkad, Kerala – 678687'
    },
    timelineTitle: 'Wedding Schedule',
    timelineSubtitle: 'Wednesday, 11 November 2026 • 11:00 AM – 12:00 PM',
    countdownHeading: 'Counting Down To Auspicious Muhurtham',
    countdownTarget: '2026-11-11T11:00:00+05:30',
    venueName: 'PMR Auditorium',
    venueLocationSub: 'Kuzhalmannam, Palakkad, Kerala',
    venueBlockTitle: 'Wedding Ceremony Venue',
    venueBlockDesc: 'PMR Auditorium\nKuzhalmannam, Palakkad, Kerala',
    venueTiming: '11:00 AM – 12:00 PM\nWednesday, 11 Nov 2026',
    templeMentioned: 'Guruvayur Temple',
    mapUrl: 'https://maps.app.goo.gl/uHZyDtW8SwWSA46v9',
    phone: '+91941777114',
    whatsappNumber: '91941777114',
    whatsappMsg: 'Heartiest congratulations to Vishnu and Vani! Looking forward to attending the wedding ceremony at PMR Auditorium, Kuzhalmannam.',
    calendarSummary: 'Wedding of Vishnu & Vani',
    calendarDetails: 'Wedding Ceremony of Vishnu & Vani.\n• Venue: PMR Auditorium, Kuzhalmannam, Palakkad, Kerala\n• Temple Mentioned: Guruvayur Temple\n• Time: 11:00 AM – 12:00 PM\n• Contact: 941777114 / 9072937020',
    calendarLocation: 'PMR Auditorium, Kuzhalmannam, Palakkad, Kerala',
    startUtc: '20261111T053000Z',
    endUtc: '20261111T063000Z'
  },
  reception: {
    id: 'reception',
    pageTitle: 'Vishnu & Vani — Wedding Reception Invitation',
    ogTitle: 'Wedding Reception: Vishnu & Vani',
    ogDesc: 'Thursday, 12 November 2026 • Thanima Auditorium, Puthucode, Palakkad',
    tagline: 'Wedding Reception',
    heroDate: 'Thursday, 12 November 2026',
    heroSubtext: 'With immense joy and happiness',
    badgeText: 'Wedding Reception',
    announcementDate: 'Thursday, 12 November 2026',
    timingPill: '4:00 PM – 8:00 PM',
    quote: 'With immense joy and happiness, we invite you to join us for the wedding reception of Vishnu & Vani.',
    groom: {
      name: 'Vishnu',
      parents: 'Mr. Ramesh Kumar & Mrs. Girija V',
      grandparents: [
        'Late V.V. Nair & Late V. Sarada',
        'Late Ravindranath Pillai & Late Kunjikali Amma'
      ]
    },
    bride: {
      name: 'Vani',
      parents: 'Late Suveendran R & Prema K',
      grandparents: ['Late Raman K & Late Sarojini A']
    },
    withLove: ['Jishnu V', 'Pradeep V'],
    contacts: ['941777114', '9072937020'],
    familyAddress: {
      line1: 'Kunnath House,',
      line2: 'Kanakkanur, Manapadam (PO),',
      line3: 'Palakkad, Kerala – 678687'
    },
    timelineTitle: 'Reception Schedule',
    timelineSubtitle: 'Thursday, 12 November 2026 • 4:00 PM – 8:00 PM',
    countdownHeading: 'Counting Down To Evening Reception',
    countdownTarget: '2026-11-12T16:00:00+05:30',
    venueName: 'Thanima Auditorium',
    venueLocationSub: 'Puthucode, Palakkad, Kerala',
    venueBlockTitle: 'Wedding Reception Venue',
    venueBlockDesc: 'Thanima Auditorium\nPuthucode, Palakkad, Kerala',
    venueTiming: '4:00 PM – 8:00 PM\nThursday, 12 Nov 2026',
    mapUrl: 'https://maps.app.goo.gl/L3oTKRj22yUnTunw9',
    phone: '+91941777114',
    whatsappNumber: '91941777114',
    whatsappMsg: 'Warmest congratulations to Vishnu and Vani! Delighted to join the wedding reception at Thanima Auditorium, Puthucode.',
    calendarSummary: 'Wedding Reception of Vishnu & Vani',
    calendarDetails: 'Wedding Reception of Vishnu & Vani.\n• Venue: Thanima Auditorium, Puthucode, Palakkad, Kerala\n• Time: 4:00 PM – 8:00 PM\n• Contact: 941777114 / 9072937020',
    calendarLocation: 'Thanima Auditorium, Puthucode, Palakkad, Kerala',
    startUtc: '20261112T103000Z',
    endUtc: '20261112T143000Z'
  }
};
