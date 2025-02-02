// src/components/LanguageSelector.jsx

import React, { useState } from 'react';

const LanguageSelector = ({ onLanguageChange }) => {
  const [language, setLanguage] = useState('hi'); // Default language Hindi

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    onLanguageChange(selectedLanguage); // Call the parent function to update the language
  };

  return (
    <div>
      <select value={language} onChange={handleLanguageChange}>
        <option value="hi">Hindi</option>
        <option value="bn">Bengali</option>
        <option value="gu">Gujarati</option>
        <option value="ta">Tamil</option>
        {/* Add more languages as needed */}
      </select>
    </div>
  );
};

export default LanguageSelector;
