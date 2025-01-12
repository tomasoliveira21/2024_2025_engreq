import React from "react";
import PropTypes from "prop-types";
import { SeasonDetail } from "@/types/amapSeasons";

interface SeasonListProps {
  seasons: SeasonDetail[];
}

const SeasonList = ({ seasons }: SeasonListProps) => {
  if (seasons.length === 0) {
    return <div>No seasons available.</div>;
  }

  return (
    <div className="space-y-6">
      {seasons.map((season) => (
        <div
          key={season.id}
          className="p-4 border border-gray-700 rounded-md bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{season.name}</h2>
              <p className="text-sm text-gray-400">
                {`Season: ${
                  season.season.charAt(0).toUpperCase() + season.season.slice(1)
                }`}
              </p>
              <p className="text-sm text-gray-400">
                {`Start Date: ${new Date(season.startDate).toLocaleDateString()}`}
              </p>
              <p className="text-sm text-gray-400">
                {`End Date: ${new Date(season.endDate).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          {season.DeliveryDates.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold">Delivery Dates:</h3>
              <ul className="list-disc list-inside text-gray-300">
                {season.DeliveryDates.map((date, index) => (
                  <li key={index}>{new Date(date.date).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-400 text-sm">
              No delivery dates available.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

SeasonList.propTypes = {
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      season: PropTypes.string.isRequired,
      DeliveryDates: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
};

export default SeasonList;
