import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { canadaRegionalFraudData } from "../data/canadaRegionalFraudData";

export default function RegionalRiskMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) {
      setIsMapLoading(false);
      return;
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([56.1304, -95.7129], 3);

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const getColor = (heat: number) => {
      if (heat >= 80) return "#0f172a";
      if (heat >= 65) return "#475569";
      return "#94a3b8";
    };

    const getRadius = (incidents: number) => Math.max(10, Math.min(30, incidents / 12));

    canadaRegionalFraudData.forEach((item) => {
      const circle = L.circleMarker([item.coordinates.lat, item.coordinates.lng], {
        radius: getRadius(item.incidentsLast30Days),
        color: "#ffffff",
        weight: 1,
        fillColor: getColor(item.riskHeat),
        fillOpacity: 0.75,
      }).addTo(map);

      circle.bindTooltip(String(item.incidentsLast30Days), {
        permanent: true,
        direction: "center",
        className: "map-count",
      });

      circle.bindPopup(
        `<div style="font-size:12px;line-height:1.4">
          <strong style="font-size:13px">${item.regionName}</strong><br/>
          Incidents (30d): <strong>${item.incidentsLast30Days}</strong><br/>
          Trend: <strong>${item.trendChangePercent}%</strong><br/>
          Top fraud types: ${item.recentFraudTypes.join(", ")}<br/>
          Impacted groups: ${item.impactedGroups.join(", ")}
        </div>`,
      );
    });

    setIsMapLoading(false);

    return () => {
      setIsMapLoading(false);
      map.remove();
    };
  }, []);

  return (
    <div className="relative h-[380px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute left-4 top-4 rounded-xl border border-gray-200 bg-white/95 px-3 py-2 text-xs text-gray-700 shadow-sm">
        <p className="text-[10px] uppercase tracking-wide text-gray-400">Legend</p>
        <p className="mt-1">Bubble size = incidents (30d)</p>
        <p>Bubble color = risk heat</p>
      </div>
      {isMapLoading && (
        <div className="absolute inset-0 animate-pulse bg-white/95 p-4">
          <div className="h-full rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 h-4 w-32 rounded bg-gray-200" />
            <div className="grid h-[calc(100%-1.75rem)] grid-cols-3 gap-3">
              <div className="rounded bg-gray-200" />
              <div className="rounded bg-gray-200" />
              <div className="rounded bg-gray-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
