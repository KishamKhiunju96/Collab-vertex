import EventDetailPage from "@/components/events/EventDetailPage";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  // If params is a Promise, await it
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <EventDetailPage eventId={id} />;
}
