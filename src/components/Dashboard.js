import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountrySelector from './CountrySelector';
import Chart from './Chart';
import '../App.css';
import worldBankLogo from '../assets/world_bank_logo.png'; 


const Dashboard = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartType, setChartType] = useState('line'); 
  const [yearRange, setYearRange] = useState({ start: 2000, end: 2020 }); 
  const [externalDebtData, setExternalDebtData] = useState([]);
  const [educationExpenditureData, setEducationExpenditureData] = useState([]);

  useEffect(() => {
    axios.get('https://api.worldbank.org/v2/country/all?format=json')
      .then(response => {
        const countriesData = response.data[1];
        setCountries(countriesData);
      })
      .catch(error => {
        console.error('Error fetching countries data:', error);
      });

    const countryCodes = 'AFE;ABW;AFG;AFR;AFW;AGO;AFR;ALB;AND;ARB;ARE;ARG;ARM;CHL;CHI;CHE;ASM;ATG;AUS;AUT;AZE;BDI;BFA;BEL;BEN;BGD;BGR;BHR;BHS;BIH;BLR;BLZ;BMU;BOL;BRA;BRB;BRN;BTN;BWA;CAF;CAN;';
    const countryCodeList = countryCodes.split(';');
    const externalDebtRequests = countryCodeList.map(code => 
      axios.get(`https://api.worldbank.org/v2/country/${code}/indicator/DT.DOD.DECT.CD?format=json`)
    );

    Promise.all(externalDebtRequests)
      .then(responses => {
        const debtData = responses.flatMap(response => response.data[1] || []);
        setExternalDebtData(debtData);
      })
      .catch(error => {
        console.error('Error fetching external debt data:', error);
      });

    const educationExpenditureRequests = countryCodeList.map(code => 
      axios.get(`https://api.worldbank.org/v2/country/${code}/indicator/SE.XPD.TOTL.GB.ZS?format=json`)
    );

    Promise.all(educationExpenditureRequests)
      .then(responses => {
        const expenditureData = responses.flatMap(response => response.data[1] || []);
        setEducationExpenditureData(expenditureData);
      })
      .catch(error => {
        console.error('Error fetching education expenditure data:', error);
      });
  }, []);

  const handleCountrySelect = (selectedCountryIds) => {
    setSelectedCountries(selectedCountryIds);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleYearRangeChange = (startYear, endYear) => {
    setYearRange({ start: startYear, end: endYear });
  };

  const filteredExternalDebtData = externalDebtData.filter(item =>
    item && selectedCountries.includes(item.countryiso3code)
  );

  const filteredEducationExpenditureData = educationExpenditureData.filter(item =>
    item && selectedCountries.includes(item.countryiso3code)
  );

  return (
    <div className="dashboard">
      <div className="header">
        <img src={worldBankLogo} alt="World Bank Logo" className="world-bank-logo" />
      </div>
      {countries.length > 0 && (
        <CountrySelector
          countries={countries}
          selectedCountries={selectedCountries}
          onSelect={handleCountrySelect}
        />
      )}
      <div className="chart-container">
        <Chart
          countries={selectedCountries}
          externalDebtData={filteredExternalDebtData}
          educationExpenditureData={filteredEducationExpenditureData}
          chartType={chartType}
          yearRange={yearRange}
          onChartTypeChange={handleChartTypeChange}
          onYearRangeChange={handleYearRangeChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
