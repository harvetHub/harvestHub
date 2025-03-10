import { FC } from "react";
import Link from "next/link";

const Header: FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">HarvestHub</Link>
        </h1>
        <nav>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
