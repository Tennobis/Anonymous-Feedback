"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className="p-4 md:p-6 bg-slate-900 shadow-md ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-2xl text-white font-bold mb-4 md:mb-0" href="#">
          Mystery Message
        </a>
        {session ? (
          <>
            <span className="mr-4 font-bold text-white text-xl">
              Welcome, {user?.username || user?.email}
            </span>
            <Button className="w-full  text-black bg-white hover:bg-gray-100 md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto text-black bg-white hover:bg-gray-100">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
