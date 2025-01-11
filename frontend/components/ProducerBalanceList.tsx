import React from 'react';
import PropTypes from 'prop-types';
import { BalanceDetail } from '@/types/producerBalance';

interface ProducerBalanceListProps {
  balanceDetails: BalanceDetail[];
}

const ProducerBalanceList = ({ balanceDetails }: ProducerBalanceListProps) => {
  if (balanceDetails.length === 0) {
    return <div>No balance information found.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Balance Information</h2>
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
            <p>
              <strong>Producer:</strong> {balance.Producer.businessName || 'Not specified'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProducerBalanceList.propTypes = {
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
      Producer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        businessName: PropTypes.string,
        description: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
};

export default ProducerBalanceList;
