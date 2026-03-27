import RegionalAnalyticsCharts from "../components/RegionalAnalyticsCharts";
import RegionalRiskMap from "../components/RegionalRiskMap";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { canadaRegionalFraudData, type RegionalFraudInsight } from "../data/canadaRegionalFraudData";
import { useGeolocation } from "../hooks/useGeolocation";

function nearestRegion(lat: number, lng: number): RegionalFraudInsight {
  return canadaRegionalFraudData.reduce((previous, current) => {
    const currentDistance = Math.hypot(current.coordinates.lat - lat, current.coordinates.lng - lng);
    const previousDistance = Math.hypot(previous.coordinates.lat - lat, previous.coordinates.lng - lng);
    return currentDistance < previousDistance ? current : previous;
  }, canadaRegionalFraudData[0]);
}

export default function LocationRiskIntelligencePage() {
  const { location, error, isLoading, requestLocation } = useGeolocation();
  const selectedRegion = location ? nearestRegion(location.latitude, location.longitude) : canadaRegionalFraudData[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Location Intelligence"
        subtitle="Regional risk trends and fraud distribution across the Canada demo dataset."
      />

      <Card className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Detected Region: {selectedRegion.regionName}</p>
            <p className="mt-1 text-sm text-gray-600">
              Trend: +{selectedRegion.trendChangePercent}% | Risk Heat: {selectedRegion.riskHeat}/100
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={requestLocation}>
            Refresh Geolocation
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {isLoading && (
            <div className="animate-pulse space-y-2">
              <div className="h-3 w-32 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-200" />
            </div>
          )}
          {error && error}
          {!isLoading && !error && location && `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-xl font-semibold text-gray-900">Region Map</h2>
        <div className="mt-6">
          <RegionalRiskMap />
        </div>
      </Card>

      <RegionalAnalyticsCharts />
    </div>
  );
}
