import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic"

export default function AdminLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return <>
    <Nav> 
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/news">News</NavLink>
        <NavLink href="/admin/places">Places</NavLink>
        <NavLink href="/admin/events">Events</NavLink>
        <NavLink href="/admin/forum">Forum</NavLink>
        <NavLink href="/admin/review">Reviews</NavLink>
    </Nav>
    <div className="container my-6 pl-6 pr-6">{children}</div>
    </>
}