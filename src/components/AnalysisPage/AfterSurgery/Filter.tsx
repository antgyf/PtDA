import React, { useState } from "react";
import { FilterType } from "../../../models/patient/patientDetails";

interface FilterButtonsComponentProps {
  onFilterApply: (selectedFilters: FilterType) => void;
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

type FilterKey = keyof FilterType;
type FilterValue = 0 | 1 | "";

const FilterButtonsComponent: React.FC<FilterButtonsComponentProps> = ({
  onFilterApply,
  currentLang,
}) => {
  const defaultFilters: FilterType = {
    age: 0,
    bmi: 0,
  };

  const [selectedFilters, setSelectedFilters] =
    useState<FilterType>(defaultFilters);

  const updateFilter = (key: FilterKey, value: FilterValue) => {
    const updatedFilters: FilterType = { ...selectedFilters };

    if (value === "") {
      delete updatedFilters[key];
    } else {
      updatedFilters[key] = value as 0 | 1;
    }

    setSelectedFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterApply({});
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
  };

  const renderDropdown = (
    key: FilterKey,
    label: string,
    placeholder: string | null,
    options: { label: string; value: 0 | 1 }[],
    requiredDefault: boolean = false
  ) => {
    return (
      <div className="bg-white rounded-md p-4 shadow-sm">
        <label className="font-semibold mb-2 block">{label}</label>

        <select
          className="select select-bordered w-full"
          value={
            selectedFilters[key] !== undefined
              ? selectedFilters[key]
              : ""
          }
          onChange={(e) => {
            const value =
              e.target.value === "" ? "" : Number(e.target.value);

            updateFilter(key, value as FilterValue);
          }}
        >
          {!requiredDefault && (
            <option value="">{placeholder}</option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="p-5 bg-secondary rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4">
        {currentLang === "zh"
          ? "使用以下选项根据手术前的特征定义相似的患者"
          : "Use the filters below to define similar patients based on their characteristics before surgery"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT SIDE — DEFAULT FILTERS */}
        <div className="flex flex-col gap-4">
          {renderDropdown(
            "age",
            currentLang === "zh" ? "年龄" : "Age",
            currentLang === "zh" ? "不筛选年龄" : "Do not filter age",
            [
              { label: "Below 50 years", value: 0 },
              { label: "50 years and above", value: 1 },
            ],
            
          )}

          {renderDropdown(
            "bmi",
            currentLang === "zh" ? "BMI" : "BMI",
            currentLang === "zh" ? "不筛选BMI" : "Do not filter BMI",
            [
              { label: "32.5–37.4", value: 0 },
              { label: "37.5+", value: 1 },
            ],
            
          )}
        </div>

        {/* RIGHT SIDE — OPTIONAL FILTERS */}
        <div className="flex flex-col gap-4">
          {renderDropdown(
            "sex",
            currentLang === "zh" ? "性别" : "Gender",
            currentLang === "zh" ? "不筛选性别" : "Do not filter gender",
            [
              { label: currentLang === "zh" ? "男" : "Male", value: 0 },
              { label: currentLang === "zh" ? "女" : "Female", value: 1 },
            ]
          )}

          {renderDropdown(
            "ethnicity",
            currentLang === "zh" ? "种族" : "Ethnicity",
            currentLang === "zh" ? "不筛选种族" : "Do not filter ethnicity",
            [
              { label: currentLang === "zh" ? "华人" : "Chinese", value: 0 },
              {
                label: currentLang === "zh" ? "非华人" : "Non-Chinese",
                value: 1,
              },
            ]
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={clearAllFilters}
          className="py-2 px-6 bg-accent text-white rounded-md transition-all hover:bg-accent-dark"
        >
          {currentLang === "zh" ? "清除" : "Clear"}
        </button>

        <button
          type="button"
          onClick={handleApplyFilters}
          className="py-2 px-6 bg-accent text-white rounded-md transition-all hover:bg-accent-dark"
        >
          {currentLang === "zh" ? "应用" : "Apply Filters"}
        </button>
      </div>
    </div>
  );
};

export default FilterButtonsComponent;