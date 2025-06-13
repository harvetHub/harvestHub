"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileForm from "@/components/user/account/profile/ProfileForm";
import SideNav from "@/components/user/SideNav";
import { MainLayout } from "@/layout/MainLayout";
import { User } from "@/lib/definitions";
import { useEffect, useState } from "react";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile from API
    const fetchProfile = async () => {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <MainLayout>
      <div className="myContainer flex flex-col md:flex-row gap-6 ">
        {/* Side Navigation */}
        <SideNav />

        {/* Profile Form */}
        <div className="flex-1 bg-white p-8 rounded-sm shadow">
          {loading ? <LoadingSpinner /> : <ProfileForm profile={profile} />}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
