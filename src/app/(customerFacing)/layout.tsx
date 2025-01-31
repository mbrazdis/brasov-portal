import { Nav, NavLink } from "@/components/Nav";
import Image from "next/image";

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
        <NavLink href="/news">Stiri</NavLink>
        <NavLink href="/forum">Forum</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>
      {/* Brasov City Image Section */}
      <section className="py-8 bg-gray-50 text-center w-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-6">Brasov City</h2>
          <div className="flex justify-center overflow-hidden" style={{ height: '300px' }}>
        <Image
          src="/brasov-romania.jpg"
          alt="Brasov City"
          width={1757}
          height={600}
          className="rounded-lg shadow-md object-cover"
          style={{ height: 'auto', width: 'auto' }}
        />
          </div>
        </div>
      </section>
      <div className="w-full">{children}</div>
    </>
  );
}
