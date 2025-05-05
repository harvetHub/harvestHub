import AddressList from "@/components/user/account/address/AddressList";
import SideNav from "@/components/user/SideNav";
import { MainLayout } from "@/layout/MainLayout";

const AddressPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="myContainer flex flex-col md:flex-row gap-6 ">
        {/* Side Navigation */}
        <SideNav />

        {/* Delivery Address */}
        <div className="flex-1 bg-gray-50 p-8 rounded-sm shadow">
          <AddressList />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddressPage;
