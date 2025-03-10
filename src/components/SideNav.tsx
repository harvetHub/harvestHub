import { FC } from "react";
import Link from "next/link";

const SideNav: FC = () => {
  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/products" className="mr-4">
          Products
        </Link>
        <Link href="/about" className="mr-4">
          About
        </Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default SideNav;
