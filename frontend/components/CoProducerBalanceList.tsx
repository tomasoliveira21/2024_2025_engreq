import React from "react";
import PropTypes from "prop-types";
import { BalanceDetail } from "@/types/producerBalance";

interface CoProducerBalanceListProps {
  balanceDetails: BalanceDetail[];
}

const CoProducerBalanceList = ({ balanceDetails }: CoProducerBalanceListProps) => {
  if (balanceDetails.length === 0) {
    return <div>No co-producer balance information found.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Co-Producer Balance Information</h2>
      <ul className="space-y-4">
        {balanceDetails.map((balance, index) => (
          <li key={index} className="border-b border-gray-700 pb-4">
            <p>
              <strong>User:</strong> {balance.User.name} ({balance.User.email})
            </p>
            <p>
              <strong>Total Due:</strong> €{balance.totalCostSum.toFixed(2)}
            </p>
            <p>
              <strong>Total Paid:</strong> €{balance.paidCostSum.toFixed(2)}
            </p>
            <p>
              <strong>Pending Amount:</strong> €{balance.pendingValue.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

CoProducerBalanceList.propTypes = {
  balanceDetails: PropTypes.arrayOf(
    PropTypes.shape({
      totalCostSum: PropTypes.number.isRequired,
      paidCostSum: PropTypes.number.isRequired,
      pendingValue: PropTypes.number.isRequired,
      User: PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        nif: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default CoProducerBalanceList;
