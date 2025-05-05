"use client";

import { UserIcon, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav: React.FC = () => {
  const pathname = usePathname(); // Get the current path

  const isActive = (path: string) => pathname === path; // Check if the path is active

  return (
    <div className="w-fit py-8">
      <ul className="space-y-6">
        {/* My Account Section */}
        <li>
          <div className="flex items-center space-x-2 mb-2">
            <UserIcon className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-gray-700">My Account</h3>
          </div>

          <ul className="ml-4 space-y-1">
            <li>
              <Link
                href="/user/account/profile"
                className={`text-sm ${
                  isActive("/user/account/profile")
                    ? "text-gray-800 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/user/account/addresses"
                className={`text-sm ${
                  isActive("/user/account/addresses")
                    ? "text-gray-800 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Addresses
              </Link>
            </li>
            <li>
              <Link
                href="/user/account/change-password"
                className={`text-sm ${
                  isActive("/user/account/change-password")
                    ? "text-gray-800 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Change Password
              </Link>
            </li>
          </ul>
        </li>

        {/* My Purchase Section */}
        <li>
          <div className="flex items-center space-x-2 mb-2">
            <ReceiptText className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-gray-700">My Purchase</h3>
          </div>

          <ul className="ml-4 space-y-1">
            <li>
              <Link
                href="/user/purchase"
                className={`text-sm ${
                  isActive("/user/purchase")
                    ? "text-gray-800 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Purchase History
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
