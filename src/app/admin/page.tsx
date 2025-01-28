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

export default async function AdminDashboard() {
  const [events, attractions, forumPosts, reviews] = await Promise.all([
    getEventData(),
    getAttractionData(),
    getForumPostData(),
    getReviewData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Evenimente"
        subtitle="Lista de evenimente"
        body={events.map(event => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
          </div>
        ))}
      />
      <DashboardCard
        title="Atractii Turistice"
        subtitle="Lista de atractii turistice"
        body={attractions.map(attraction => (
          <div key={attraction.id}>
            <h3>{attraction.name}</h3>
            <p>{attraction.description}</p>
            <p>{attraction.location}</p>
          </div>
        ))}
      />
      <DashboardCard
        title="Forum"
        subtitle="Postari recente pe forum"
        body={forumPosts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      />
      <DashboardCard
        title="Recenzii la Evenimente"
        subtitle="Recenzii recente la evenimente"
        body={reviews.map(review => (
          <div key={review.id}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
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