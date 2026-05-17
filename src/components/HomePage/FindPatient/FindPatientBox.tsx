import { useEffect, useState, useCallback } from "react";
import { Age, BMICategory, Ethnicity, Sex } from "../../../models/patient/patientDetails";
import FilterInput from "../../UI/Form/FilterInput";
import SearchBar from "./SearchBar";
import ToggleUp from "../../UI/Button/ToggleUp";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../../api/api";
import { useAlert } from "../../../hooks/AlertContext";
import { useAuth } from "../../../hooks/AuthContext";
import { Patient } from "../../../models/patient/patientReport";
import { useForm } from "../../../hooks/FormContext";
import BrownButton from "../../UI/Button/BrownButton";


interface FilterState {
  age?: number;
  sex?: number;
  ethnicity?: number;
  bmicategory?: number;
}

interface FindPatientBoxProps {
  onClose: () => void;
}

const FindPatientBox: React.FC<FindPatientBoxProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { setCurrentPatient } = useForm();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  /** Navigate to Form Page & Set Current Patient */
  const handleNavigate = (patient: Patient) => {
    setCurrentPatient(patient);
    navigate("/form");
  };

  /** Handle Input Change for Search Query */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  /** Handle Filter Change */
  const handleFilterChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Default case for other filters
    const numericFields = ["age", "sex", "ethnicity", "bmicategory"];
    setFilters((prev) => ({
      ...prev,
      [name]: value
        ? numericFields.includes(name)
          ? Number(value)
          : value
        : undefined,
    }));
  };


  /** Fetch Patients with Filters & Pagination */
  const fetchPatients = useCallback(
    async (page: number, resetFilters = false) => {
      try {
        const params = resetFilters
          ? { page, limit: 8 }
          : { page, limit: 8, ...filters };

        showAlert("Finding patient...", "info");

        const response = await api.get("/patients/filter",
        {
          params,
          headers: { "Cache-Control": "no-cache" },
        }
      );

        showAlert("Patient matching filters found", "success");
        setPatients(response.data.patients);
        setTotalPatients(response.data.totalPatients);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching patients:", error);
        showAlert("Error fetching patients", "error");
      }
    },
    [filters, showAlert, user?.id]
  );

  /** Clear Filters and Reset Pagination */
  const handleClearFilters = () => {
    setFilters({});
    setQuery("");
    setCurrentPage(1); // Reset to first page
    fetchPatients(1, true); // Fetch without filters
  };

  /** Pagination Controls */
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /** Fetch Data on Page Change */
  useEffect(() => {
    if (!query) {
      fetchPatients(currentPage);
    }
  }, [currentPage, filters, query]);

  /** Handle Search */
  const handleSearch = async () => {
    try {
      showAlert("Searching...", "info");
      const response = await api.get("patients/searchByName",
        {
          params: { name: query },
        }
      );

      setPatients(response.data.patients);
      setTotalPatients(response.data.totalPatients);
      setTotalPages(response.data.totalPages);
      showAlert(`Showing results for ${query}`, "success");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error filtering patients", error);
        showAlert(`Error filtering patients`, "error");
      } else {
        showAlert("An unexpected error occurred", "error");
      }
    }
  };

  return (
    <div className="bg-secondary p-5 mt-2 rounded-md w-full">
      <div className="flex flex-row justify-between">
        <article className="prose">
          <h2>Find patient</h2>
          <h4>Total patients matching filters: {totalPatients}</h4>
        </article>
        <ToggleUp onClose={onClose} />
      </div>

      {/* Search Bar */}
      <SearchBar
        query={query}
        onChange={handleNameChange}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterInput
          label="Age"
          list={Age}
          name="age"
          value={filters.age !== undefined ? filters.age.toString() : ""}
          onChange={handleFilterChange}
        />
        <FilterInput
          label="Sex"
          list={Sex}
          name="sex"
          value={filters.sex !== undefined ? filters.sex.toString() : ""}
          onChange={handleFilterChange}
        />
        <FilterInput
          label="Ethnicity"
          list={Ethnicity}
          name="ethnicity"
          value={filters.ethnicity !== undefined ? filters.ethnicity.toString() : ""}
          onChange={handleFilterChange}
        />
        <FilterInput
          label="BMI Category"
          list={BMICategory}
          name="bmicategory"
          value={
            filters.bmicategory !== undefined
              ? filters.bmicategory.toString()
              : ""
          }
          onChange={handleFilterChange}
        />

        <BrownButton buttonText="Clear" onButtonClick={handleClearFilters} />
      </div>
      

      {/* 📋 Patient Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="text-lg">
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Ethnicity</th>
              <th>BMI</th>
              <th>Forms</th>
            </tr>
          </thead>
          <tbody className="text-[16px]">
            {patients.map((patient) => (
              <tr key={patient.patientid}>
                <td>{patient.patientid}</td>
                <td>{patient.fullname}</td>
                <td>{patient.age}</td>
                <td>{Sex[patient.sex]}</td>
                <td>{Ethnicity[patient.ethnicity]}</td>
                <td>{patient.bmi}</td>
                <td
                  className="underline text-blue-600 cursor-pointer"
                  onClick={() => handleNavigate(patient)}
                >
                  {patient.hasform ? "View More" : "Add Form"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Patients Found Message */}
      {!patients.length && (
        <div className="flex justify-center items-center w-full h-full">
          No patient found.
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between">
          <BrownButton
            onButtonClick={handlePrevious}
            disabled={currentPage === 1}
            buttonText="Previous"
          />
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <BrownButton
            onButtonClick={handleNext}
            disabled={currentPage === totalPages}
            buttonText="Next"
          />
        </div>
      )}
    </div>
  );
};

export default FindPatientBox;
