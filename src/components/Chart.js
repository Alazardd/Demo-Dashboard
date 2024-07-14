import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ countries, externalDebtData, educationExpenditureData, yearRange, onChartTypeChange, onYearRangeChange }) => {
  const [educationChartType, setEducationChartType] = useState('line');
  const [externalDebtChartType, setExternalDebtChartType] = useState('line');

  const filterDataByCountries = (data, selectedCountryIds) => {
    return data.filter(item => selectedCountryIds.includes(item.countryiso3code));
  };

  const filterDataByYearRange = (data, startYear, endYear) => {
    return data.filter(item => {
      const year = parseInt(item.date);
      return year >= startYear && year <= endYear;
    });
  };

  const prepareChartData = (data, selectedCountryIds, startYear, endYear) => {
    const filteredData = filterDataByCountries(data, selectedCountryIds);
    const filteredByYear = filterDataByYearRange(filteredData, startYear, endYear);

    const labels = [...new Set(filteredByYear.map(item => item.date))].sort();

    const datasets = selectedCountryIds.map(countryId => {
      const countryData = filteredByYear.filter(item => item.countryiso3code === countryId);
      return {
        label: countries.find(country => country.id === countryId)?.name || countryId,
        data: labels.map(date => {
          const dataPoint = countryData.find(item => item.date === date);
          return dataPoint ? dataPoint.value : null;
        }),
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.1
      };
    });

    return {
      labels,
      datasets
    };
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleEducationChartTypeChange = (type) => {
    setEducationChartType(type);
    onChartTypeChange(type);
  };

  const handleExternalDebtChartTypeChange = (type) => {
    setExternalDebtChartType(type);
    onChartTypeChange(type);
  };

  const renderEducationChart = () => {
    const educationChartData = prepareChartData(educationExpenditureData, countries, yearRange.start, yearRange.end);

    const options = {
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return value + '%'; // Convert values to percentage
            }
          }
        }
      }
    };

    if (educationChartType === 'line') {
      return <Line data={educationChartData} options={options} />;
    } else if (educationChartType === 'bar') {
      return <Bar data={educationChartData} options={options} />;
    } else if (educationChartType === 'pie') {
      return <Pie data={educationChartData} />;
    }
  };

  const renderExternalDebtChart = () => {
    const externalDebtChartData = prepareChartData(externalDebtData, countries, yearRange.start, yearRange.end);

    if (externalDebtChartType === 'line') {
      return <Line data={externalDebtChartData} />;
    } else if (externalDebtChartType === 'bar') {
      return <Bar data={externalDebtChartData} />;
    } else if (externalDebtChartType === 'pie') {
      return <Pie data={externalDebtChartData} />;
    }
  };

  return (
    <div className="chart-container">
      <div className="chart">
        <div className="chart-title">
          <h2>Government expenditure on education, total (% of government expenditure)</h2>
        </div>
        <div className="controls">
          <label>Chart Type:</label>
          <select value={educationChartType} onChange={(e) => handleEducationChartTypeChange(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>

          <label>Year Range:</label>
          <input type="number" value={yearRange.start} onChange={(e) => onYearRangeChange(e.target.value, yearRange.end)} />
          <span> to </span>
          <input type="number" value={yearRange.end} onChange={(e) => onYearRangeChange(yearRange.start, e.target.value)} />
        </div>

        {/* Render Education Chart based on educationChartType */}
        {renderEducationChart()}
      </div>

      <div className="chart">
        <div className="chart-title">
          <h2>International Debt Statistics</h2>
        </div>
        <div className="controls">
          <label>Chart Type:</label>
          <select value={externalDebtChartType} onChange={(e) => handleExternalDebtChartTypeChange(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>

          <label>Year Range:</label>
          <input type="number" value={yearRange.start} onChange={(e) => onYearRangeChange(e.target.value, yearRange.end)} />
          <span> to </span>
          <input type="number" value={yearRange.end} onChange={(e) => onYearRangeChange(yearRange.start, e.target.value)} />
        </div>

        {/* Render External Debt Chart based on externalDebtChartType */}
        {renderExternalDebtChart()}
      </div>
    </div>
  );
};

export default Chart;
