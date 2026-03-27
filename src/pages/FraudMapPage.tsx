import { canadaRegionalFraudData, type RegionalFraudInsight } from "../data/canadaRegionalFraudData";
import { useGeolocation } from "../hooks/useGeolocation";

function getNearestRegion(lat: number, lng: number): RegionalFraudInsight {
  return canadaRegionalFraudData.reduce((closest, current) => {
    const currentDistance = Math.hypot(current.coordinates.lat - lat, current.coordinates.lng - lng);
    const closestDistance = Math.hypot(closest.coordinates.lat - lat, closest.coordinates.lng - lng);
    return currentDistance < closestDistance ? current : closest;
  }, canadaRegionalFraudData[0]);
}

export default function FraudMapPage() {
  const { location, error, isLoading, requestLocation } = useGeolocation();
  const selectedRegion = location
    ? getNearestRegion(location.latitude, location.longitude)
    : canadaRegionalFraudData[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="glass-panel p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Regional Intelligence</p>
        <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">Fraud Map & Regional Alerts</h1>
        <p className="mt-3 max-w-3xl text-sm text-neutral-300">
          Geolocation-enabled insights based on a Canada-focused mock fraud dataset. Use this panel to monitor regional fraud trends and common attack vectors.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          <button type="button" className="btn-secondary" onClick={requestLocation}>
            Refresh Location
          </button>
          {isLoading && <span className="text-neutral-400">Detecting location...</span>}
          {error && <span className="text-risk-high">Location error: {error}</span>}
          {!isLoading && !error && location && (
            <span className="text-neutral-400">
              Coordinates: {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
            </span>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="glass-panel p-5">
          <p className="text-xs uppercase tracking-widest text-neutral-400">Detected Region</p>
          <p className="mt-2 font-display text-2xl text-white">{selectedRegion.regionName}</p>
          <p className="mt-1 text-sm text-neutral-400">Code: {selectedRegion.regionCode}</p>
        </article>

        <article className="glass-panel p-5">
          <p className="text-xs uppercase tracking-widest text-neutral-400">Fraud Trend Statistics</p>
          <p className="mt-2 font-display text-2xl text-white">+{selectedRegion.trendChangePercent}%</p>
          <p className="mt-1 text-sm text-neutral-400">Change over last 30 days</p>
        </article>

        <article className="glass-panel p-5">
          <p className="text-xs uppercase tracking-widest text-neutral-400">Risk Heat Indicator</p>
          <p className="mt-2 font-display text-2xl text-white">{selectedRegion.riskHeat}/100</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-gradient-to-r from-white to-risk-critical" style={{ width: `${selectedRegion.riskHeat}%` }} />
          </div>
        </article>
      </section>

      <section className="mt-6 glass-panel p-6">
        <h2 className="font-display text-2xl text-white">Common Fraud Types</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedRegion.recentFraudTypes.map((fraudType) => (
            <div key={fraudType} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-200">
              {fraudType}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 glass-panel p-6">
        <h2 className="font-display text-2xl text-white">National Snapshot (Canada Demo Dataset)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-neutral-400">
              <tr>
                <th className="pb-2">Region</th>
                <th className="pb-2">Risk Heat</th>
                <th className="pb-2">Trend</th>
                <th className="pb-2">Incidents (30d)</th>
              </tr>
            </thead>
            <tbody>
              {canadaRegionalFraudData.map((region) => (
                <tr key={region.regionCode} className="border-t border-white/10 text-neutral-200">
                  <td className="py-2">{region.regionName}</td>
                  <td className="py-2">{region.riskHeat}</td>
                  <td className="py-2">+{region.trendChangePercent}%</td>
                  <td className="py-2">{region.incidentsLast30Days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
