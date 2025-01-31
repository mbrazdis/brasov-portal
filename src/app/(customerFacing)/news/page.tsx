import React, { Suspense } from "react";
import db from "@/db/db";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardSkeleton from "@/components/CardSkeleton";

async function getNewsData() {
  const news = await db.news.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      date: true,
      imagePath: true,
    },
    orderBy: { date: "desc" },
  });

  return news.map((newsItem) => ({
    ...newsItem,
    date: newsItem.date.toISOString(),
  }));
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imagePath: string;
}

function renderNews(news: NewsItem[]) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {news.map((newsItem) => (
        <Card key={newsItem.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-2">{newsItem.title}</CardTitle>
            <p className="text-gray-500">{new Date(newsItem.date).toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
            
              <Image src={newsItem.imagePath} alt={newsItem.title} width={300} height={225} className="rounded-lg" />
            </div>
            <p className="text-gray-500 mb-4">
              {newsItem.content.length > 100 ? `${newsItem.content.substring(0, 100)}...` : newsItem.content}
            </p>
           
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function NewsPage() {
  const news = await getNewsData();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 mb-8">
        <h1 className="text-3xl font-bold text-center">News</h1>
      </header>
      <main className="container mx-auto px-4">
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Latest News</h2>
          <Suspense fallback={<CardSkeleton />}>
            {renderNews(news)}
          </Suspense>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">More News</h2>
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