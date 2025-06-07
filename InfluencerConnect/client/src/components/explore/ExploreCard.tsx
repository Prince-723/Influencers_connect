import { Link } from 'react-router-dom';

export interface ExploreCardProps {
  id: number;
  title: string;
  location: string;
  image: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export default function ExploreCard({ data }: { data: ExploreCardProps }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video rounded-t-lg overflow-hidden">
        <img
          src={data.image || '/placeholder-card.jpg'}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
          <span className="text-sm text-gray-500 shrink-0">{data.location}</span>
        </div>

        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.metrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="text-gray-500">{metric.label}</div>
              <div className="font-medium text-gray-900">{metric.value}</div>
            </div>
          ))}
        </div>

        <Link
          to={`/explore/${data.id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}