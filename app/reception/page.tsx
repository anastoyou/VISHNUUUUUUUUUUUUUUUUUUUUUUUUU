import { Metadata } from 'next';
import WeddingView from '@/components/WeddingView';
import { EVENT_DATA } from '@/lib/events';

export const metadata: Metadata = {
  title: EVENT_DATA.reception.pageTitle,
  description: EVENT_DATA.reception.ogDesc,
  openGraph: {
    title: EVENT_DATA.reception.ogTitle,
    description: EVENT_DATA.reception.ogDesc,
    images: ['/assets/couple.jpeg'],
  },
};

export default function ReceptionPage() {
  return <WeddingView eventType="reception" />;
}

