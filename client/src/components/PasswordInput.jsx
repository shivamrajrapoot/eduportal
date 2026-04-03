// client/src/components/PasswordInput.jsx
import React, { useState } from 'react';

const PasswordInput = ({ name, placeholder, value, onChange, required }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <input
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{ width: '100%', padding: '8px', paddingRight: '70px' }}
      />
      <span
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'blue',
          userSelect: 'none',
        }}
      >
        {show ? 'Hide' : 'Show'}
      </span>
    </div>
  );
};

export default PasswordInput;