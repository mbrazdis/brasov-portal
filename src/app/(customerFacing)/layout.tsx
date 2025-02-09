'use client';

import { Nav, NavLink } from "@/components/Nav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Nav>
        <NavLink href="/">Acasa</NavLink>
        <NavLink href="/places">Locuri</NavLink>
        <NavLink href="/events">Evenimente</NavLink>
        <NavLink href="/news">Stiri</NavLink>
        <NavLink href="/forum">Forum</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <NavLink href="/login">Login</NavLink>
            <NavLink href="/register">Register</NavLink>
          </>
        )}
      </Nav>
      {children}
    </>
  );
}