import React from "react";
import BrownButton from "../../UI/Button/BrownButton";

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex items-center gap-2 mt-2 w-full max-w-md max-sm:flex-col max-sm:items-stretch max-lg:text-gray-900 max-lg:dark:text-gray-900">
      <input
        type="text"
        className="input input-bordered grow bg-white text-gray-900 placeholder:text-gray-500 dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-500 max-sm:w-full"
        placeholder="Search by name of patient"
        value={query}
        onChange={onChange}
      />

      <div className="flex gap-2 max-sm:w-full">
        <BrownButton buttonText="Search" onButtonClick={onSearch} />
        <BrownButton buttonText="Clear" onButtonClick={onClear} />
      </div>
    </div>
  );
};

export default SearchBar;