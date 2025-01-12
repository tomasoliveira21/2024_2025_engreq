import React from 'react';
import PropTypes from 'prop-types';
import { AccountValues } from '@/types/producerBalance';

interface ProducerAccountValuesListProps {
    accountDetails: AccountValues[];
}

const ProducerAccountValues = ({ accountDetails }: ProducerAccountValuesListProps) => {
  if (accountDetails.length === 0) {
    return <div>No balance information found.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4 text-white">Account Values</h2>
      <ul className="space-y-4">
        {accountDetails.map((account, index) => (
          <li key={index} className="border-b border-gray-700 pb-4">
            <p className="text-white">
              <strong>Current Balance:</strong> €{account.pendingValue.toFixed(2)}
            </p>
            <p className="text-white">
              <strong>User ID:</strong> {account.User.id}
            </p>
            <p className="text-white">
              <strong>Email:</strong> {account.User.email}
            </p>
            <p className="text-white">
              <strong>NIF:</strong> {account.User.nif}
            </p>
            <p className="text-white">
              <strong>Name:</strong> {account.User.name}
            </p>
            <p className="text-white">
              <strong>Producer ID:</strong> {account.Producer.id}
            </p>
            <p className="text-white">
              <strong>Business Name:</strong> {account.Producer.businessName || 'Not specified'}
            </p>
            <p className="text-white">
              <strong>Description:</strong> {account.Producer.description || 'Not specified'}
            </p>
            <p className="text-white">
              <strong>Pending Value:</strong> €{account.pendingValue.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProducerAccountValues.propTypes = {
  accountDetails: PropTypes.arrayOf(
    PropTypes.shape({
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

export default ProducerAccountValues;