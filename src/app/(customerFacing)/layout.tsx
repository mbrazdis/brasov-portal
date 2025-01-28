import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Acasa</NavLink>
        <NavLink href="/places">Locuri</NavLink>
        <NavLink href="/events">Evenimente</NavLink>
        <NavLink href="/forum">Forum</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>
      <div className="w-full">{children}</div>
    </>
  );
}
