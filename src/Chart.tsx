import React, {useState, useEffect, useCallback, Dispatch, SetStateAction, ChangeEvent} from 'react';
import { Line } from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import {ChartData, ResponseItem} from "./types";
import {api} from "./endpoints";
import {key} from "./keys";

Chart.register(...registerables);

const GdpChart: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('1995-01-02');
  const [endDate, setEndDate] = useState<string>('2024-01-02');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const onChange = useCallback( (callback: Dispatch<SetStateAction<string>>) =>
      (e: ChangeEvent<HTMLInputElement>) => callback(e.target.value), [])
  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;

    try {
      const response1 =
          await fetch(`${api}/historical/country/mexico,sweden/indicator/gdp/${startDate}/${endDate}?c=${key}`);

      const dataLoc = await response1.json();
      const labels: string[] = [], dataSweden: number[] = [], dataMexico: number[] = []

      dataLoc.forEach((val: ResponseItem)=> {
        if (val.Country === "Sweden") {
          dataSweden.push(val.Value)
          labels.push(val.DateTime)
        } else if (val.Country === "Mexico")  {
          dataMexico.push(val.Value)
        }
      })

      setChartData({
        labels,
        datasets: [
          {
            label: "Mexico",
            data: dataSweden,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: "Sweden",
            data: dataMexico,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [startDate, endDate]);

useEffect(() => {
      fetchData();
  }, [fetchData]);

  return (
      <div style={{ padding: '20px' }}>
        <h1>GDP Per Capita Comparison</h1>

        <div>
          <input
              type="date"
              value={startDate}
              onChange={onChange(setStartDate)}
          />
          <input
              type="date"
              value={endDate}
              onChange={onChange(setEndDate)}
          />
        </div>
        <div>
          {chartData.labels.length > 0 && <Line data={chartData} />}
        </div>
      </div>
  );
};

export default GdpChart;
