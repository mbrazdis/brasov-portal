import React, { Suspense } from "react";
import db from "@/db/db";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardSkeleton from "@/components/CardSkeleton";

async function getEventData() {
  const events = await db.event.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
    },
    orderBy: { date: "desc" },
  });
  return events;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
}

function renderEvents(events: Event[]) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-2">{event.title}</CardTitle>
            <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
            </p>
            <p className="text-gray-500">{event.location}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function EventsPage() {
  const events = await getEventData();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 mb-8">
        <h1 className="text-3xl font-bold text-center">Events</h1>
      </header>
      <main className="container mx-auto px-4">
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <Suspense fallback={<CardSkeleton />}>
            {renderEvents(events)}
          </Suspense>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">More Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder elements for design */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Placeholder Title</h3>
              <p className="text-gray-500 mb-4">This is a placeholder content for design purposes.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Placeholder Title</h3>
              <p className="text-gray-500 mb-4">This is a placeholder content for design purposes.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Placeholder Title</h3>
              <p className="text-gray-500 mb-4">This is a placeholder content for design purposes.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Placeholder Title</h3>
              <p className="text-gray-500 mb-4">This is a placeholder content for design purposes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}