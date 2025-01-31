/* eslint-disable */

import React, { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Event, Attraction, ForumPost, Review } from "@prisma/client";
import Image from "next/image";
import CardSkeleton from "@/components/CardSkeleton";
import { getAttractionData } from "@/lib/dataFetcher";

const getEventData = cache(
  () => db.event.findMany(),
  ["/", "getEventData"],
  { revalidate: 60 * 60 * 24 }
);

const fetchAttractionData = cache(
  async () => {
    const attractions = await db.attraction.findMany();
    return attractions;
  },
  ["/", "getAttractionData"],
  { revalidate: 60 * 60 * 24 }
);

const fetchNewsData = cache(
  async () => {
    const news = await db.news.findMany();
    return news;
  },
  ["/", "getNewsData"],
  { revalidate: 60 * 60 * 24 }
);

const getForumPostData = cache(
  () => db.forumPost.findMany(),
  ["/", "getForumPostData"],
  { revalidate: 60 * 60 * 24 }
);

const getReviewData = cache(
  () => db.review.findMany(),
  ["/", "getReviewData"],
  { revalidate: 60 * 60 * 24 }
);

const getNewsData = cache(
  () => db.news.findMany(),
  ["/", "getNewsData"],
  { revalidate: 60 * 60 * 24 }
);

export default function AdminDashboard() {
  return (
    <div className="font-sans w-full pt-4">
      <div className="container pl-6 pr-6">
        {/* Main Content */}

      {/* Brasov City Description Section */}
      <section className="py-8 bg-gray-50 text-center w-full">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Brasov</h2>
          <p className="text-gray-700 text-lg">
            Brasov is a city in Romania, located in the central part of the country. It is known for its medieval
            architecture, vibrant cultural scene, and beautiful natural surroundings. The city is surrounded by the
            Carpathian Mountains, making it a popular destination for outdoor activities such as hiking, skiing, and
            mountain biking. Brasov is also home to several historical landmarks, including the Black Church, the
            Council Square, and the Brasov Fortress. With its rich history and stunning scenery, Brasov is a must-visit
            destination for travelers.
          </p>
        </div>
      </section>

        {/* Events Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Evenimente</h2>
            <Suspense fallback={<LocalCardSkeleton />}>
              <DataSuspense dataFetcher={getEventData} renderData={renderEvent} />
            </Suspense>
          </div>
        </section>

        {/* News Section */}
        <section className="py-8 bg-gray-50 text-center w-full mt-8">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Stiri</h2>
            <Suspense fallback={<LocalCardSkeleton />}>
              <DataSuspense dataFetcher={fetchNewsData} renderData={renderNews} />
            </Suspense>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Atractii Turistice</h2>
            <Suspense fallback={<CardSkeleton />}>
              <DataSuspense dataFetcher={fetchAttractionData} renderData={renderAttraction} />
            </Suspense>
          </div>
        </section>

      </div>
    </div>
  );
}

type DataSuspenseProps<T> = {
  dataFetcher: () => Promise<T[]>;
  renderData: (data: T) => React.ReactNode;
};

async function DataSuspense<T>({ dataFetcher, renderData }: DataSuspenseProps<T>) {
  const data = await dataFetcher();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {data.map((item, index) => (
        <Card key={index}>
          <CardContent>{renderData(item)}</CardContent>
        </Card>
      ))}
    </div>
  );
}

function renderEvent(event: Event) {
  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>{event.location}</p>
    </div>
  );
}

function renderAttraction(attraction: Attraction) {
  return (
    <div key={attraction.id} className="bg-white p-4 rounded-lg shadow-md">
      <Image
        src={attraction.imagePath}
        alt={attraction.name}
        width={400}
        height={300}
        className="rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
      <p className="text-gray-700 mb-2">{attraction.location}</p>
      <p className="text-gray-500">{attraction.description}</p>
    </div>
  );
}

function renderForumPost(forumPost: ForumPost) {
  return (
    <div>
      <h3>{forumPost.title}</h3>
      <p>{forumPost.content}</p>
    </div>
  );
}

function renderNews(news: { id: string; title: string; content: string; date: Date; imagePath: string; isActive: boolean; }) {
  return (
    <div>
      <h3>{news.title}</h3>
      <div className="flex justify-center">
        <Image src={news.imagePath} alt={news.title} width={300} height={225} />
      </div>
      <p>{news.content}</p>
      <p>{new Date(news.date).toLocaleDateString()}</p>
      
    </div>
  );
}

function renderReview(review: Review) {
  return (
    <div>
      <p>{review.content}</p>
      <p>Rating: {review.rating}</p>
    </div>
  );
}

function LocalCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Loading content...</p>
      </CardContent>
    </Card>
  );
}