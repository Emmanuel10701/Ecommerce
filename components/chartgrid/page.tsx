import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart, Bar } from 'recharts';

// Define the data types
interface AreaChartData {
  name: string;
  uv: number;
}

interface HistogramData {
  name: string;
  value: number;
}

interface ChartgridProps {
  areaChartData: AreaChartData[];
  histogramData: HistogramData[];
}

const Chartgrid: React.FC<ChartgridProps> = ({ areaChartData, histogramData }) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-center gap-8">
        {/* Area Chart */}
        <div className="flex-1 min-w-[240px] max-w-[360px] p-4 border rounded-lg">
          <h2 className="text-base font-semibold mb-2 text-center">Area Chart</h2>
          <AreaChart width={320} height={200} data={areaChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </div>

        {/* Histogram */}
        <div className="flex-1 min-w-[240px] max-w-[360px] p-4 border rounded-lg">
          <h2 className="text-base font-semibold mb-2 text-center">Histogram</h2>
          <BarChart width={320} height={200} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Chartgrid;
