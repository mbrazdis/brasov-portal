/* eslint-disable */

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
import { DeleteDropdownItem } from "./_componets/EventsActions";

export default function AdminEventsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Events</PageHeader>
        <Button asChild className="hover:bg-[#FF5733]">
          <Link href="/admin/events/new">Add Event</Link>
        </Button>
      </div>
      <EventsTable />
    </>
  );
}

async function EventsTable() {
  const events = await db.event.findMany({
    select: {
      id: true,
      title: true,
      location: true,
      date: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { title: "asc" },
  });

  if (events.length === 0) return <p>No events found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Visit</span>
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead className="w-10">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <CheckCircle2 />
            </TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
            <TableCell>{event._count.reviews}</TableCell>
            <TableCell>
            <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-[#FF5733] hover:text-white">
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}