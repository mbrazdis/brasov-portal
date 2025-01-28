import React, { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Event, Attraction, ForumPost, Review } from "@prisma/client";

const getEventData = cache(
  () => db.event.findMany(),
  ["/", "getEventData"],
  { revalidate: 60 * 60 * 24 }
);

const getAttractionData = cache(
  () => db.attraction.findMany(),
  ["/", "getAttractionData"],
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

export default function AdminDashboard() {
  return (
    <div className="font-sans w-full">
      <div className="container pl-6 pr-6">
        {/* Main Content */}

        {/* Events Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Evenimente</h2>
            <Suspense fallback={<CardSkeleton />}>
              <DataSuspense dataFetcher={getEventData} renderData={renderEvent} />
            </Suspense>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Atractii Turistice</h2>
            <Suspense fallback={<CardSkeleton />}>
              <DataSuspense dataFetcher={getAttractionData} renderData={renderAttraction} />
            </Suspense>
          </div>
        </section>

        {/* Forum Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Forum</h2>
            <Suspense fallback={<CardSkeleton />}>
              <DataSuspense dataFetcher={getForumPostData} renderData={renderForumPost} />
            </Suspense>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Recenzii la Evenimente</h2>
            <Suspense fallback={<CardSkeleton />}>
              <DataSuspense dataFetcher={getReviewData} renderData={renderReview} />
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
    <div>
      <h3>{attraction.name}</h3>
      <p>{attraction.description}</p>
      <p>{attraction.location}</p>
    </div>
  );
}

function renderForumPost(forumPost: ForumPost) {
  return (
    <div>
      <h3>{forumPost.title}</h3>
      <p>{forumPost.content}</p>
      <p>{new Date(forumPost.createdAt).toLocaleDateString()}</p>
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

function CardSkeleton() {
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