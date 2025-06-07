const StatsBar = () => {
  const stats = [
    { value: "2,500+", label: "Active Influencers" },
    { value: "1,200+", label: "Businesses" },
    { value: "15K+", label: "Collaborations" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
