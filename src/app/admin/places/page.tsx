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

export default function AdminAttractionsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Attractions</PageHeader>
        <Button asChild className="hover:bg-[#FF5733]">
          <Link href="/admin/places/new">Add Attraction</Link>
        </Button>
      </div>
      <AttractionsTable />
    </>
  );
}

async function AttractionsTable() {
const attractions = await db.attraction.findMany({
    select: {
        id: true,
        name: true,
        location: true,
        _count: { select: { reviews: true } },
    },
    orderBy: { name: "asc" },
});

  if (attractions.length === 0) return <p>No attractions found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Visit</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attractions.map((attraction) => (
          <TableRow key={attraction.id}>
            <TableCell>
              <CheckCircle2 />
            </TableCell>
            <TableCell>{attraction.name}</TableCell>
            <TableCell>{attraction.location}</TableCell>
            <TableCell>{attraction._count.reviews}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-[#FF5733] hover:text-white">
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/places/${attraction.id}/edit`}>
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
