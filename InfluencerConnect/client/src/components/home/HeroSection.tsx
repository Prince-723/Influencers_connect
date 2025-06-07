import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              Connect Businesses With Influencers
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              The ultimate platform where businesses find their perfect influencer match and influencers monetize their following.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black" asChild>
                <Link href={user ? "/explore" : "/auth"}>
                  Find Influencers
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-primary text-white border-primary hover:bg-black hover:text-white hover:border-primary" asChild>
                <Link href={user ? "/dashboard" : "/auth"}>
                  Join as Influencer
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://plus.unsplash.com/premium_vector-1731948527880-a191bccecb24?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Influencer marketing collaboration" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-t-3xl h-16"></div>
    </section>
  );
};

export default HeroSection;
