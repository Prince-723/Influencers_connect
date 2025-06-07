import { 
  Search, 
  BarChart2, 
  MessageSquare, 
  FileText, 
  Shield, 
  CreditCard 
} from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      id: 1,
      icon: <Search className="h-8 w-8" />,
      title: "Advanced Search",
      description: "Find the perfect match with filters for niche, audience demographics, platform, and more.",
      color: "text-primary",
    },
    {
      id: 2,
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Track campaign performance, engagement metrics, and ROI in real-time.",
      color: "text-secondary",
    },
    {
      id: 3,
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Secure Messaging",
      description: "Communicate directly with potential partners through our built-in messaging system.",
      color: "text-primary",
    },
    {
      id: 4,
      icon: <FileText className="h-8 w-8" />,
      title: "Contract Templates",
      description: "Streamline your agreements with customizable legal templates for collaborations.",
      color: "text-secondary",
    },
    {
      id: 5,
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Profiles",
      description: "Work with confidence knowing all profiles are verified for authenticity.",
      color: "text-primary",
    },
    {
      id: 6,
      icon: <CreditCard className="h-8 w-8" />,
      title: "Secure Payments",
      description: "Process payments safely through our integrated payment gateway.",
      color: "text-secondary",
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to succeed in influencer marketing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
