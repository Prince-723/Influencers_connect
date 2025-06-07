import { useAuth } from "@/hooks/use-auth";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";
import InfluencerDashboard from "@/components/dashboard/InfluencerDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Return the appropriate dashboard based on user type
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {user?.userType === "business" ? (
          <BusinessDashboard />
        ) : (
          <InfluencerDashboard />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
