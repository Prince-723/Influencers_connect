import { Star, StarHalf } from "lucide-react";

const Testimonials = () => {
  const businessTestimonials = [
    {
      id: 1,
      name: "James Wilson",
      role: "CEO, FitTech Solutions",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&q=75&fit=crop&w=64",
      content:
        "HustleHub transformed our influencer marketing strategy. We found the perfect fitness influencers who genuinely connected with our brand. ROI has increased by 120% since our first campaign.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sandra Lee",
      role: "Marketing Director, EcoBox",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&q=75&fit=crop&w=64",
      content:
        "The filtering tools on HustleHub made it easy to find sustainability-focused influencers who aligned with our eco-friendly brand values. Our product launch reached double the audience we expected.",
      rating: 4.5,
    },
  ];

  const influencerTestimonials = [
    {
      id: 1,
      name: "Tina Rodriguez",
      role: "Fashion & Lifestyle Influencer",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&q=75&fit=crop&w=64",
      content:
        "I went from spending hours pitching to brands to having quality collaboration offers come directly to me. HustleHub has helped me turn my passion into a sustainable career without the constant hustle.",
      rating: 5,
    },
    {
      id: 2,
      name: "Marcus Green",
      role: "Tech & Gaming Creator",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&q=75&fit=crop&w=64",
      content:
        "HustleHub provides the tools I need to showcase my work and audience demographics professionally. The platform has connected me with brands I actually care about and use, making authentic partnerships easy.",
      rating: 4.5,
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it — hear from the businesses and influencers who've found success on HustleHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Testimonials */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              From Businesses
            </h3>

            <div className="space-y-6">
              {businessTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"{testimonial.content}"</p>
                  <div className="mt-4 flex text-yellow-400">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Influencer Testimonials */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-secondary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              From Influencers
            </h3>

            <div className="space-y-6">
              {influencerTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"{testimonial.content}"</p>
                  <div className="mt-4 flex text-yellow-400">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
