
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";

async function getEventData() {
  const events = await db.event.findMany();
  return events;
}

async function getAttractionData() {
  const attractions = await db.attraction.findMany();
  return attractions;
}

async function getForumPostData() {
  const forumPosts = await db.forumPost.findMany();
  return forumPosts;
}

async function getReviewData() {
  const reviews = await db.review.findMany();
  return reviews;
}

async function getNewsData() {
  const news = await db.news.findMany();
  return news;
}
export default async function AdminDashboard() {
  const [events, attractions, forumPosts, reviews, news] = await Promise.all([
    getEventData(),
    getAttractionData(),
    getForumPostData(),
    getReviewData(),
    getNewsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Evenimente"
        subtitle="Numar de evenimente"
        body={<p>{events.length} evenimente</p>}
      />
      <DashboardCard
        title="Atractii Turistice"
        subtitle="Numar de atractii turistice: "
        body={<p>{attractions.length} atractii</p>}
          />
          <DashboardCard
            title="Forum"
            subtitle="Numar de postari recente pe forum"
            body={<p>{forumPosts.length} postari</p>}
          />
          <DashboardCard
            title="Recenzii la Evenimente"
            subtitle="Recenzii recente la evenimente"
            body={<p>{reviews.length} review-uri</p>}
      />
      <DashboardCard
            title="Stiri"
            subtitle="Numar de stiri postate: "
            body={<p>{news.length} postari</p>}
          />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: React.ReactNode;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {body}
      </CardContent>
    </Card>
  );
}