import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const data = [
    { date: '2023-01-01', emotion: 5 },
    { date: '2023-01-02', emotion: 3 }
];

// const DailyEmotionsChart = ({ isAnimationActive = true }) => (
//     <AreaChart
//         style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
//         responsive
//         data={data}
//         margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
//     >
//     </AreaChart>
//     <RechartsDevtools />
// );

const DailyEmotionsChart = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold">Daily Emotions</h2>
      <p className="text-gray-600">View your daily emotions.</p>
    </div>
  );
};

export default DailyEmotionsChart;