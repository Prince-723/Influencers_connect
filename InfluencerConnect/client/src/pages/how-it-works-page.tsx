import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Handshake,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function HowItWorksPage() {
  const { user } = useAuth();

  const steps = [
    {
      title: "Create Your Profile",
      description:
        "Sign up and create a detailed profile highlighting your business needs or your influencer skills and audience.",
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      forInfluencer:
        "Showcase your niche, audience demographics, engagement rates, and previous collaborations.",
      forBusiness:
        "Describe your brand, target audience, campaign goals, and collaboration preferences.",
    },
    {
      title: "Connect and Collaborate",
      description:
        "Browse through our marketplace to find the perfect match for your campaign or brand partnership.",
      icon: <Handshake className="h-10 w-10 text-primary" />,
      forInfluencer:
        "Browse through campaigns that align with your content style and audience demographics.",
      forBusiness:
        "Search for influencers by niche, platform, follower count, location, and other key metrics.",
    },
    {
      title: "Grow Together",
      description:
        "Communicate, negotiate terms, and launch successful campaigns that benefit both parties.",
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      forInfluencer:
        "Track your earnings, manage multiple brand partnerships, and grow your influence.",
      forBusiness:
        "Monitor campaign performance, manage influencer relationships, and scale your marketing efforts.",
    },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">How HustleHub Works</h1>
            <p className="text-xl mb-8">
              We connect brands with the perfect content creators to elevate
              their marketing campaigns
            </p>
            <Button size="lg" className="bg-black hover:bg-grey" asChild>
              <Link href={user ? "/explore" : "/auth"}>Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Three Simple Steps to Success
            </h2>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex items-start justify-center md:justify-start">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{step.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                            For Influencers
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {step.forInfluencer}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                            For Businesses
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {step.forBusiness}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  How do I get paid as an influencer?
                </h3>
                <p className="text-gray-600">
                  When you join a campaign, payment terms are established
                  upfront. Once your content is approved and published, you'll
                  receive payment through our secure payment system directly to
                  your connected account.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  How much does it cost for businesses?
                </h3>
                <p className="text-gray-600">
                  HustleHub offers flexible pricing plans for businesses. You
                  only pay for the campaigns you create, with no hidden fees.
                  You set your campaign budget based on your marketing goals.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Can I work with international influencers?
                </h3>
                <p className="text-gray-600">
                  Absolutely! HustleHub connects you with influencers worldwide.
                  You can filter by location to find influencers in specific
                  regions or countries for targeted campaigns.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  How do I measure campaign success?
                </h3>
                <p className="text-gray-600">
                  Our platform provides comprehensive analytics for every
                  campaign, including engagement rates, click-through rates,
                  conversion metrics, and audience demographics to measure ROI
                  effectively.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                asChild
              >
                <Link href={user ? "/explore" : "/auth"}>
                  Ready to get started? <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
