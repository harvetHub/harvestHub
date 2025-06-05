import ProfileForm from "@/components/user/account/profile/ProfileForm";
import SideNav from "@/components/user/SideNav";
import { MainLayout } from "@/layout/MainLayout";

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="myContainer flex flex-col md:flex-row gap-6 ">
        {/* Side Navigation */}
        <SideNav />

        {/* Profile Form */}
        <div className="flex-1 bg-white p-8 rounded-sm shadow">
          <ProfileForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
