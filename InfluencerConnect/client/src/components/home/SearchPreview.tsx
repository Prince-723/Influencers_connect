import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";

const SearchPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find The Perfect Influencers For Your Brand</h2>
            <p className="text-gray-600 mb-6">
              Our advanced search tools help you discover influencers who match your specific requirements and audience demographics.
            </p>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-6">
              <h3 className="font-semibold mb-4">Filter by:</h3>

              {/* Search Filters Preview */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry/Niche</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 py-2 px-3 bg-white">
                    <option>All Niches</option>
                    <option>Fashion & Style</option>
                    <option>Beauty & Cosmetics</option>
                    <option>Fitness & Health</option>
                    <option>Food & Cooking</option>
                    <option>Technology & Gaming</option>
                    <option>Travel & Lifestyle</option>
                    <option>Business & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default" size="sm" className="rounded-full">Instagram</Button>
                    <Button variant="outline" size="sm" className="rounded-full">TikTok</Button>
                    <Button variant="outline" size="sm" className="rounded-full">YouTube</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Twitter</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience Size</label>
                  <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1K+</span>
                    <span>100K+</span>
                    <span>1M+</span>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full" asChild>
                <Link href="/explore">Find Matches</Link>
              </Button>
            </div>
          </div>

          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&q=75&fit=crop&w=700"
              alt="Search interface"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPreview;
