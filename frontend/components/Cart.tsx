import React from 'react';
import PropTypes from 'prop-types';

interface CardTypes {
    header: string;
    description: string;
    footer: string;
    onClick?: () => void;
}

const Card = ({ header, description, footer, onClick }: CardTypes) => {
  return (
    <div
      className="bg-blue-900 text-white rounded-lg p-6 text-center w-full shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-2xl font-bold mb-4">{header}</div>
      <div className="text-base mb-6">{description}</div>
      <div className="text-sm">
        Managed by: <span className="font-medium">{footer}</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Card;
