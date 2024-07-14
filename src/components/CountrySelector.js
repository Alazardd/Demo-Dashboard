import React from 'react';
import '../App.css';

const CountrySelector = ({ countries, selectedCountries, onSelect }) => {
  const handleCheckboxChange = (event) => {
    const countryId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      onSelect([...selectedCountries, countryId]);
    } else {
      onSelect(selectedCountries.filter(id => id !== countryId));
    }
  };

  return (
    <div className="country-selector">
      <label>Select Countries:</label>
      <div className="checkbox-list">
        {countries.map(country => (
          <label key={country.id}>
            <input
              type="checkbox"
              value={country.id}
              checked={selectedCountries.includes(country.id)}
              onChange={handleCheckboxChange}
            />
            {country.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;
