import { useEffect, useState } from "react";
import {
  AddPatientForm,
  Ethnicity,
  Sex,
} from "../../../models/patient/patientDetails";
import { useAlert } from "../../../hooks/AlertContext";
import ToggleUp from "../../UI/Button/ToggleUp";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import SelectInput from "../../UI/Form/SelectInput";
import TextInput from "../../UI/Form/TextInput";
import RadioChoice from "../../UI/Form/RadioChoice";
import { useForm } from "../../../hooks/FormContext";

interface AddPatientBoxProps {
  onClose: () => void;
}

const AddPatientBox: React.FC<AddPatientBoxProps> = ({ onClose }) => {
  const { showAlert } = useAlert();
  const { setCurrentPatient } = useForm();
  const navigate = useNavigate();

  const [form, setForm] = useState<AddPatientForm>({
    fullname: "",
    sex: "",
    ethnicity: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    bmicategory: "",
    agegroup: ""
  });

  // Automatically calculate BMI whenever height or weight changes
  useEffect(() => {
    const height = parseFloat(form.height || "0");
    const weight = parseFloat(form.weight || "0");

    if (height > 0 && weight > 0) {
      const calculatedBMI = (weight / (height * height)).toFixed(2);
      setForm((prev) => ({ ...prev, bmi: calculatedBMI }));
    } else {
      setForm((prev) => ({ ...prev, bmi: "" }));
    }
  }, [form.height, form.weight]);

  const handleSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if all fields are filled (excluding surgeonid and surgeontitle if user is a surgeon)
    const requiredFields = Object.entries(form).filter(([value]) => {

      // Return fields that are missing/empty
      return value === "" || value === undefined;
    });

    // Show alert if any required field is missing
    if (requiredFields.length > 0) {
      showAlert("Please ensure all input fields are filled.", "error");
      return;
    }

    try {
      showAlert("Adding patient...", "info");
      const response = await api.post(`/patients/add`,
        {
          ...form,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      showAlert(response.data.message, "success");

      // console.log("New patient added:", response.data.patient);

      // Reset form
      setForm({
        fullname: "",
        sex: "",
        ethnicity: "",
        age: "",
        height: "",
        weight: "",
        bmi: "",
        bmicategory: "",
        agegroup: "",
      });

      // Ensure state updates before navigating
      setTimeout(() => {
      setCurrentPatient({ 
        ...response.data.patient      
      });
      navigate(`/form?${response.data.patient.patientid}&term=0`); // Navigate to form page for the new patient
      }, 100);
    } catch (error) {
      console.error("Error submitting the form:", error);
      showAlert(
        "An error occurred while adding the patient. Please try again.",
        "error"
      );
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  Restrict height/weight inputs to numbers & 2 decimal places
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "height" | "weight"
  ) => {
    let value = e.target.value;

    // Allow only numbers and up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    // Allow empty value while typing
    if (value === "") {
      setForm((prev) => ({
        ...prev,
        [type]: "",
      }));
      return;
    }

    // Convert to float for range validation
    const numericValue = parseFloat(value);

    // Validate within accepted ranges
    if (type === "height" && numericValue >= 0.5 && numericValue <= 3) {
      setForm((prev) => ({ ...prev, [type]: value }));
    } else if (type === "weight" && numericValue >= 1 && numericValue <= 300) {
      setForm((prev) => ({ ...prev, [type]: value }));
    }
  };

  //  Restrict age/surgeonid inputs to integers only
  const handleIntegerInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "age"
  ) => {
    let value = e.target.value;

    //  Allow only integers (no decimals)
    if (!/^\d*$/.test(value)) return;

    // Allow empty value while typing
    if (value === "") {
      setForm((prev) => ({ ...prev, [type]: "" }));
      return;
    }

    // Convert to integer and validate ranges
    const numericValue = parseInt(value, 10);

    if (type === "age" && numericValue >= 0 && numericValue <= 120) {
      setForm((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSexInput = (value: string) => {
    setForm((prev) => ({
      ...prev,
      sex: value,
    }));
  };

  return (
    <div className="bg-secondary p-5 rounded-md w-full">
      <div className="flex flex-row justify-between">
        <article className="prose">
          <h2>Add new patient</h2>
        </article>
        <ToggleUp onClose={onClose} />
      </div>

      <form onSubmit={handleSubmitEvent}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Section */}
          <div>
            <TextInput
              name="fullname"
              label="Full name"
              onChange={handleInput}
            />
            <TextInput
              name="age"
              label="Age (in years)"
              onChange={(e) => handleIntegerInput(e, "age")}
              value={form.age}
              placeholder="0 - 120"
            />
            <TextInput
              name="agegroup"
              label="Age Group"
              value={form.agegroup}
              disabled
            />
            <SelectInput
              name="ethnicity"
              label="Ethnicity"
              list={Ethnicity}
              placeholder="Please select"
              onChange={handleSelect}
            />
          </div>

          {/* Middle Section */}
          <div>
            <TextInput
              name="height"
              label="Height (in m)"
              onChange={(e) => handleNumberInput(e, "height")}
              value={form.height}
              placeholder="0.5 - 3.0"
            />
            <TextInput
              name="weight"
              label="Weight (in kg)"
              onChange={(e) => handleNumberInput(e, "weight")}
              value={form.weight}
              placeholder="1 - 300"
            />
            <TextInput
              name="bmi"
              label="Body Mass Index"
              value={form.bmi}
              disabled
            />
            <TextInput
              name="bmicategory"
              label="BMI Category"
              value={form.bmicategory}
              disabled
            />
          </div>

          {/* Right Section */}
          <div>
            <RadioChoice
              name="sex"
              question="Sex assigned at birth?"
              onChange={handleSexInput}
              list={Sex}
              value={form.sex}
            />
          </div>
        </div>

        <div className="flex justify-end w-full">
          <button
            className="btn btn-accent min-w-10 border-0 m-2"
            type="submit"
          >
            <h4 className="text-white">Add patient</h4>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientBox;
