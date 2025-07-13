import React from 'react';
import PropTypes from 'prop-types';

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      {children}
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
