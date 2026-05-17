import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useAlert } from "../../hooks/AlertContext";
import { useForm } from "../../hooks/FormContext";
import {
  AddPatientForm,
  BMICategory,
  Ethnicity,
  Sex,
} from "../../models/patient/patientDetails";
import TextInput from "../UI/Form/TextInput";
import SelectInput from "../UI/Form/SelectInput";
import RadioChoice from "../UI/Form/RadioChoice";

interface EditPatientBoxProps {
  onClose: () => void; // Function to close the edit form
}

const EditPatientBox: React.FC<EditPatientBoxProps> = ({ onClose }) => {
  const { showAlert } = useAlert();
  const { patient, setCurrentPatient } = useForm();

  // Initialize state with patient data (or empty default values)
  const [formData, setFormData] = useState<AddPatientForm>({
    fullname: patient?.fullname || "",
    sex: patient?.sex?.toString() || "",
    ethnicity: patient?.ethnicity?.toString() || "",
    age: patient?.age?.toString() || "",
    bmi: patient?.bmi?.toString() || "",
    height: patient?.height?.toString() || "",
    weight: patient?.weight?.toString() || "",
    bmicategory: patient?.bmicategory?.toString() || "",
    agegroup: patient?.agegroup?.toString() || "",
  });

  // Calculate BMICategory whenever height or weight changes
  useEffect(() => {
    const height = parseFloat(formData.height || "0");
    const weight = parseFloat(formData.weight || "0");

    if (height > 0 && weight > 0) {
      const calculatedBMI = (weight / (height * height)).toFixed(2);
      setFormData((prev) => ({ ...prev, bmi: calculatedBMI }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: "" }));
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    const bmi = parseFloat(formData.bmi || "0");
    let bmicategory = "";

    if (bmi > 0 && bmi < 23.0) {
      bmicategory = "0";
    } else if (bmi >= 23.0 && bmi < 27.5) {
      bmicategory = "1";
    } else if (bmi >= 27.5 && bmi < 32.5) {
      bmicategory = "2";
    } else if (bmi >= 32.5 && bmi < 37.5) {
      bmicategory = "3";
    } else if (bmi >= 37.5) {
      bmicategory = "4";
    }

    setFormData((prev) => ({ ...prev, bmicategory }));
  }, [formData.bmi]);

  // Calculate AgeGroup whenever age changes
  useEffect(() => {
    const age = parseInt(formData.age || "", 10);
    let agegroup = "";

    if (!Number.isNaN(age)) {
      agegroup = age < 50 ? "0" : "1";
    }

    setFormData((prev) => ({ ...prev, agegroup }));
  }, [formData.age]);

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Sex Selection
  const handleSexChange = (value: string) => {
    setFormData({ ...formData, sex: value });
  };

  // Handle Form Submission
  const handleUpdate = async () => {
    try {
      showAlert("Updating patient...", "info");
      const response = await api.put(`/patients/edit`,
        { ...patient, ...formData }
      );

      showAlert(response.data.message, "success");
      setCurrentPatient(response.data.patient);

      onClose(); // Close edit form after successful update
    } catch (error) {
      console.error("Error updating patient:", error);
      showAlert("An error occurred while updating the patient.", "error");
    }
  };

  return (
    <div className="bg-secondary p-5 rounded-md w-full">
      <article className="prose">
        <h2>Edit Patient</h2>
      </article>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Name, Age, Ethnicity */}
        <div>
          <TextInput
            name="fullname"
            label="Full Name"
            value={formData.fullname}
            onChange={handleInputChange}
          />
          <TextInput
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleInputChange}
          />
          <SelectInput
            name="ethnicity"
            label="Ethnicity"
            list={Ethnicity}
            currValue={formData.ethnicity}
            onChange={handleInputChange}
          />
        </div>

        {/* Height, Weight, BMI */}
        <div>
          <TextInput
            name="height"
            label="Height (m)"
            value={formData.height}
            onChange={handleInputChange}
          />
          <TextInput
            name="weight"
            label="Weight (kg)"
            value={formData.weight}
            onChange={handleInputChange}
          />
          <TextInput name="bmi" label="BMI" value={formData.bmi} disabled />
          <TextInput name="bmicategory" label="BMI Category" value={formData.bmicategory ? BMICategory[formData.bmicategory] : ""} disabled />
        </div>

        {/* Sex Selection */}
        <div>
          <RadioChoice
            name="sex"
            question="Sex"
            list={Sex}
            value={formData.sex}
            onChange={handleSexChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-accent min-w-10 border-0 m-2"
          onClick={handleUpdate}
        >
          Save
        </button>
        <button
          className="btn btn-accent min-w-10 border-0 m-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPatientBox;
