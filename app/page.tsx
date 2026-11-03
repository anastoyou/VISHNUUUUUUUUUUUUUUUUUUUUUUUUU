import { Metadata } from 'next';
import WeddingView from '@/components/WeddingView';
import { EVENT_DATA } from '@/lib/events';

  export const metadata: Metadata = {
    title: EVENT_DATA.invitation.pageTitle,
    description: EVENT_DATA.invitation.ogDesc,
    openGraph: {
      title: EVENT_DATA.invitation.ogTitle,
      description: EVENT_DATA.invitation.ogDesc,
      images: ['/assets/couple.jpeg'],
    },
  };

  export default function HomePage() {
    return <WeddingView eventType="invitation" />;
  }
