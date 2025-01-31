import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "react-feather";
import { DeleteDropdownItem } from "./_components/NewsActions";

export default function AdminNewsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>News</PageHeader>
        <Button asChild className="hover:bg-[#FF5733]">
          <Link href="/admin/news/new">Add News</Link>
        </Button>
      </div>
      <NewsTable />
    </>
  );
}

async function NewsTable() {
  const newsArticles = await db.news.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      date: true,
      imagePath: true,
      isActive: true,
    },
    orderBy: { title: "asc" },
  });

  if (newsArticles.length === 0) return <p>No news articles found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Visit</span>
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newsArticles.map((news) => (
          <TableRow key={news.id}>
            <TableCell>
              {news.isActive ? <CheckCircle2 /> : <XCircle />}
            </TableCell>
            <TableCell>{news.title}</TableCell>
            <TableCell>{news.content}</TableCell>
            <TableCell>{new Date(news.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <img src={news.imagePath} alt={news.title} width={100} />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-[#FF5733] hover:text-white">
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/news/${news.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={news.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}