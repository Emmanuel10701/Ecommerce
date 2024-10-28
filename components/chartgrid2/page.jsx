// components/ChartGridComponent.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip
} from 'recharts';
import {
  ScatterChart, Scatter, XAxis as ScatterXAxis, YAxis as ScatterYAxis, Tooltip as ScatterTooltip
} from 'recharts';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartGridComponent = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [scatterPlotData, setScatterPlotData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    // Dummy data for line chart
    const dummyLineChartData = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 500 },
      { name: 'Apr', value: 400 },
      { name: 'May', value: 600 },
    ];
    setLineChartData(dummyLineChartData);

    // Dummy data for scatter plot
    const dummyScatterPlotData = [
      { x: 1, y: 20 },
      { x: 2, y: 30 },
      { x: 3, y: 25 },
      { x: 4, y: 35 },
      { x: 5, y: 50 },
    ];
    setScatterPlotData(dummyScatterPlotData);

    // Dummy data for pie chart
    const dummyPieChartData = [
      { name: 'Subscribers', value: 400 },
      { name: 'Admins', value: 100 },
      { name: 'Users', value: 300 },
    ];
    setPieChartData(dummyPieChartData);
  }, []);

  return (
    <div className="flex flex-wrap justify-between gap-4 p-6">
      {/* Line Chart */}
      <div className="flex-1 min-w-[150px] max-w-[250px] w-full p-4 border rounded-lg bg-gray-50">
        <h2 className="text-sm font-semibold mb-2 text-center">Line Chart</h2>
        <LineChart width={250} height={150} data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <LineTooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>

      {/* Scatter Plot */}
      <div className="flex-1 min-w-[150px] max-w-[250px] w-full p-4 border rounded-lg bg-gray-50">
        <h2 className="text-sm font-semibold mb-2 text-center">Scatter Plot</h2>
        <ScatterChart width={250} height={150}>
          <ScatterXAxis dataKey="x" />
          <ScatterYAxis dataKey="y" />
          <Scatter data={scatterPlotData} fill="#8884d8" />
          <ScatterTooltip />
        </ScatterChart>
      </div>

      {/* Pie Chart */}
      <div className="flex-1 min-w-[150px] max-w-[250px] w-full p-4 border rounded-lg bg-gray-50">
        <h2 className="text-sm font-semibold mb-2 text-center">Pie Chart</h2>
        <PieChart width={250} height={150}>
          <Pie data={pieChartData} dataKey="value" outerRadius={50}>
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default ChartGridComponent;
