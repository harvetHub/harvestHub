import SideNav from "@/components/user/SideNav";
import { MainLayout } from "@/layout/MainLayout";
import ItemList from "@/components/user/purchase/ItemList";

const PurchasePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="myContainer flex flex-col md:flex-row gap-6">
        {/* Side Navigation */}
        <SideNav />

        {/* Profile Form */}
        <div className="flex-1 bg-gray-50">
          <ItemList />
        </div>
      </div>
    </MainLayout>
  );
};

export default PurchasePage;
