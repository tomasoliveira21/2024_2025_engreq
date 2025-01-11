import React, { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createSeason } from "@/api/createSeason";

interface CreateSeasonFormProps {
  sessionToken: string;
  onSeasonCreated: () => void;
}

const CreateSeasonForm = ({
  sessionToken,
  onSeasonCreated,
}: CreateSeasonFormProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [season, setSeason] = useState("");

  const isFormValid = name && startDate && endDate && season;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await createSeason(sessionToken, {
        name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        season,
      });
      onSeasonCreated();
      setName("");
      setStartDate(null);
      setEndDate(null);
      setSeason("");
    } catch (error) {
      console.error("Error creating season:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-8">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
        required
      />
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={new Date()}
        dateFormat="yyyy-MM-dd"
        placeholderText="Start Date"
        className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        minDate={startDate || new Date()}
        dateFormat="yyyy-MM-dd"
        placeholderText="End Date"
        className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
      />
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
        required
      >
        <option value="" disabled>
          Select Season
        </option>
        <option value="winter">Winter</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="autumn">Autumn</option>
      </select>
      <button
        type="submit"
        className={`px-4 py-2 rounded-md text-sm text-white ${
          isFormValid
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        Create
      </button>
    </form>
  );
};

CreateSeasonForm.propTypes = {
  sessionToken: PropTypes.string.isRequired,
  onSeasonCreated: PropTypes.func.isRequired,
};

export default CreateSeasonForm;
