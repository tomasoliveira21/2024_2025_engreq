"use client";

import React, { useState, useEffect } from "react";
import { fetchCoProducerCriticalKPIs } from "@/api/fetchCoProducerCriticalKPIs";
import { KpisResponse } from "@/types/coproducerCriticalKPIs";

interface KPIsProps {
  sessionToken: string;
}

const CoProducerCriticalKPIs = ({ sessionToken }: KPIsProps) => {
  const [kpiData, setKpiData] = useState<KpisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCoProducerCriticalKPIs(sessionToken);
        setKpiData(data);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, [sessionToken]);

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p className="text-lg">Loading KPIs...</p>
      </div>
    );
  }

  if (!kpiData || kpiData.kpis.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p className="text-lg">No data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {kpiData.kpis.map((seasonData, seasonIndex) => (
        <div
          key={seasonIndex}
          className="border border-gray-700 p-6 rounded-lg bg-gray-800 shadow-md"
        >
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            {seasonData.season.name}
          </h2>
          <p className="text-sm text-gray-400">
            {new Date(seasonData.season.startDate).toLocaleDateString()} -{" "}
            {new Date(seasonData.season.endDate).toLocaleDateString()}
          </p>
          <h3 className="text-lg font-semibold text-yellow-400 mt-6">KPIs:</h3>
          <ul className="list-none space-y-4 text-gray-300">
            {seasonData.season.kpis.map((kpi, kpiIndex) => (
              <li
                key={kpiIndex}
                className="border border-gray-700 p-4 rounded-lg bg-gray-900"
              >
                <p className="text-sm">
                  <span className="font-bold">Total Orders:</span>{" "}
                  {kpi.totalOrders}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Total Value:</span>{" "}
                  {kpi.totalValue.toFixed(2)}€
                </p>
                <p className="text-sm">
                  <span className="font-bold">Average Quantity:</span>{" "}
                  {kpi.averageQuantity.toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Average Price:</span>{" "}
                  {kpi.averagePrice.toFixed(2)}€
                </p>
                <p className="text-sm">
                  <span className="font-bold">User:</span>{" "}
                  {kpi.user.name} ({kpi.user.email})
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CoProducerCriticalKPIs;
