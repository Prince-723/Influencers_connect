import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const CallToAction = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up Your Business?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of businesses and influencers already collaborating on HustleHub.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-black" asChild>
              <Link href={user ? "/explore" : "/auth"}>Find Influencers</Link>
            </Button>
            <Button variant="outline" className="bg-primary text-white border-primary hover:bg-black hover:text-white hover:border-primary" size="lg" asChild>
              <Link href={user ? "/dashboard" : "/auth"}>Join as Influencer</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-blue-100">No credit card required. Get started for free.</p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
