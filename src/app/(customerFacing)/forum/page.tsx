import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { ForumPost } from "@prisma/client";

const getForumPostData = cache(
  () => db.forumPost.findMany(),
  ["/forum", "getForumPostData"],
  { revalidate: 60 * 60 * 24 }
);

export default function ForumPage() {
  return (
    <div className="font-sans w-full pt-4">
      <div className="container pl-6 pr-6">
        <section className="py-8 bg-gray-50 text-center w-full">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Forum</h2>
            <Suspense fallback={<LocalCardSkeleton />}>
              <DataSuspense dataFetcher={getForumPostData} renderData={renderForumPost} />
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

function renderForumPost(forumPost: ForumPost) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{forumPost.title}</h3>
      <p className="text-gray-700">{forumPost.content}</p>
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