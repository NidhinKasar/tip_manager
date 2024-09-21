import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetAllTips } from '../services/api.ts';

const UsageHistory: React.FC = () => {
  const userDetails: any = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to hold error message

  const { data: history, isError, isLoading, error } = useQuery({
    queryKey: ["tips_history", startDate, endDate],
    queryFn: () => GetAllTips(userDetails?.user_id, startDate, endDate),
    enabled: !!userDetails?.user_id,
  });

  // Handle error state using `isError` and `error` directly
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError && error instanceof Error) {
    return <p className="text-red-500">{error.message}</p>; // Display error message from the API
  }

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-2xl font-semibold mb-6">Usage History</h2>

      {/* Date Range Filters */}
      <div className="mb-4">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="mr-2 p-1 border" 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="mr-2 p-1 border" 
        />
      </div>
      
      {/* Container for the table with scrolling */}
      <div className="overflow-auto max-h-96"> {/* Adjust max-height as needed */}
        <table className="min-w-full bg-gray-100 border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Percentage</th>
              <th className="py-2 px-4">Tip</th>
              <th className="py-2 px-4">Place</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {history && history.length > 0 ? (
              history.map((entry: any) => (
                <tr key={entry.id} className="border-t">
                  <td className="py-2 px-4">{entry.id}</td>
                  <td className="py-2 px-4">{entry.amount}</td>
                  <td className="py-2 px-4">{entry.percentage}%</td>
                  <td className="py-2 px-4">₹{entry.tip.toFixed(2)}</td>
                  <td className="py-2 px-4">{entry.place}</td>
                  <td className="py-2 px-4">{new Date(entry.created_on).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 text-center" colSpan={6}>
                  No history available for the selected date range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsageHistory;
