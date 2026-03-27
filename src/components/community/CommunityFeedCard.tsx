import Card from "../ui/Card";
import type { CommunityExperience } from "./types";

export default function CommunityFeedCard({ experience }: { experience: CommunityExperience }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900">{experience.fraudType}</h3>
        <p className="text-xs text-gray-500">{experience.postedDate}</p>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
        <p>
          <span className="font-medium text-gray-900">Loss Range:</span> {experience.lossRange}
        </p>
        <p>
          <span className="font-medium text-gray-900">Region:</span> {experience.region}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {experience.emotionalImpact.map((impact) => (
          <span key={`${experience.id}-${impact}`} className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-700">
            {impact}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-700">{experience.description}</p>
    </Card>
  );
}
