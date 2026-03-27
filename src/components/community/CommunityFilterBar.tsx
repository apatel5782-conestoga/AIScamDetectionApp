import Card from "../ui/Card";

export default function CommunityFilterBar({
  fraudType,
  region,
  fraudTypes,
  regions,
  onFraudTypeChange,
  onRegionChange,
}: {
  fraudType: string;
  region: string;
  fraudTypes: string[];
  regions: string[];
  onFraudTypeChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}) {
  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Filter by Fraud Type</span>
          <select
            value={fraudType}
            onChange={(event) => onFraudTypeChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            <option value="All">All Types</option>
            {fraudTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium text-gray-900">Filter by Region</span>
          <select
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          >
            <option value="All">All Regions</option>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Card>
  );
}
