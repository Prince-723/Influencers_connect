import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, Check } from "lucide-react";

const HowItWorks = () => {
  const businessSteps = [
    "Create your business profile",
    "Search for influencers by niche, audience, and more",
    "Send collaboration requests",
    "Manage campaigns and track results",
  ];

  const influencerSteps = [
    "Create your influencer profile",
    "Showcase your content and audience stats",
    "Receive collaboration offers",
    "Get paid for your influence",
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How HustleHub Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting businesses and influencers has never been easier. Our platform streamlines the entire process from discovery to collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Businesses */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Building className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">For Businesses</h3>
            <ul className="space-y-3">
              {businessSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p>{step}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/auth">Start Finding Influencers</Link>
              </Button>
            </div>
          </div>

          {/* Center Image */}
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/vector-1744893448359-6759811da810?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Collaboration process" 
              className="rounded-xl h-full object-cover" 
            />
          </div>

          {/* For Influencers */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Check className="text-secondary text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">For Influencers</h3>
            <ul className="space-y-3">
              {influencerSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p>{step}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/auth">Join as Influencer</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
