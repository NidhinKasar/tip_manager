import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { CalculateTip } from "../services/api.ts";

const TipCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<any>("");
  const [place, setPlace] = useState<string>("");
  const [tipResult, setTipResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const userDetails: any = JSON.parse(localStorage.getItem('user_data') || '{}');

  const mutation = useMutation({
    mutationKey: ["tip_calculator"],

    // Update to accept an object as the argument
    mutationFn: ({
      amount_in,
      percentage_in,
      place_in,
    }: {
      amount_in: any;
      percentage_in: any;
      place_in: any;
    }) => CalculateTip(userDetails?.user_id, amount_in, percentage_in, place_in),

    onSuccess: (data) => {
      // Handle success logic here
      // setSuccess("Calculation successful!");
      // setError(null);
      setTipResult(data?.tip_amount)
      
    },

    onError: (err: any) => {
      // Handle error logic here
      setError("Calculation failed. Please try again.");
      // setSuccess(null);
    },
  });

  const calculateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || !tipPercentage || !place) {
      setError("Please enter the amount, tip percentage, and place.");
      return;
    }
    if (tipPercentage < 0) {
      setError("Tip percentage should be positive");
      return
   }
    try {
      mutation.mutate({
        amount_in: amount,
        percentage_in: tipPercentage,
        place_in: place,
      }); // setTipResult(response.data.tip);
    } catch (err) {
      setError("Error calculating tip. Please try again.");
    }
  };

  const handleTipPercentage = (input: any) => {
    if (input > 0 || input === '') {
      setTipPercentage(input)
      setError('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">Tip Calculator</h2>
        <form onSubmit={calculateTip} className="space-y-4">
          <div>
            <label
              htmlFor="place"
              className="block text-sm font-medium text-gray-700"
            >
              Place:
            </label>
            <input
              type="text"
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Total Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label
              htmlFor="tipPercentage"
              className="block text-sm font-medium text-gray-700"
            >
              Tip Percentage (%):
            </label>
            <input
              type="number"
              id="tipPercentage"
              value={tipPercentage}
              onChange={(e) => handleTipPercentage(e?.target?.value) }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Calculate Tip
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {tipResult !== null && (
          <h3 className="mt-4 text-md font-semibold">
            Tip Amount: ₹{tipResult?.toFixed(2)} at {place}
          </h3>
        )}
      </div>
    </div>
  );
};

export default TipCalculator;
