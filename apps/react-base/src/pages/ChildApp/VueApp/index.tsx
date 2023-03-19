import React from 'react';

const VueApp = () => {
  return (
    <div>
      <h1>VueApp</h1>
      <micro-app name="app2" url="http://localhost:3002/" baseroute="/app2" />
    </div>
  );
};

export default VueApp;
