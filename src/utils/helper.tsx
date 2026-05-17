import React from "react";
import { useForm } from "../hooks/FormContext";
import {
  FilterType,
  Questions,
} from "../models/patient/patientDetails";
import { Patient } from "../models/patient/patientReport";

export const getRankDescription = (lan: string) => {
  const { form } = useForm();
  let priorityQuestions: string[] | undefined;
  if (lan === "zh") {
    priorityQuestions = form?.priorities?.map((id) => {
      const description = Questions.find((q) => q.id === id)?.chineseDescription || "N/A";
      return description;
    });
  } else {
    priorityQuestions = form?.priorities?.map((id) => {
      const description = Questions.find((q) => q.id === id)?.description || "N/A";
      return description;
    });
  }

  if (lan === "en") {
    return (
      <>

        <ul className="leading-tight">
          {(priorityQuestions ?? []).map((q) => (
            <li key={q}>{"  "}{q}</li>
          ))}
        </ul>
      </>
    );
  } else if (lan === "zh") {
    return (
      <>
        <ul className="leading-tight">
          {(priorityQuestions ?? []).map((q) => (
            <li key={q}>{"  "}{q}</li>
          ))}
        </ul>
      </>
    );
  }
};

export const getName = (language: string) => {
  const { patient } = useForm();
  if (language === "en") {
    return (
    <strong style={{ color: "#1976D2" }}>
      {" "}
      {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
    </strong>
  );
} else if (language === "zh") {
    return (
      <strong style={{ color: "#1976D2" }}>
        {" "}
        {patient?.fullname} {patient?.sex ? "女士" : "先生"}
      </strong>
    );
  }
};

export const getFilterDescription = (
  filters: FilterType,
  lan: string
) => {
  const parts: React.ReactNode[] = [];

  // Age: 0 = <50, 1 = 50+
  if (filters.age !== undefined) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Age</strong>{" "}
          ({filters.age === 0 ? "below 50 years" : "50 years and above"})
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>年龄</strong>
          （{filters.age === 0 ? "50岁以下" : "50岁及以上"}）
        </>
      );
    }
  }

  // BMI: 0 = 32.5–37.4, 1 = 37.5+
  if (filters.bmi !== undefined) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>BMI</strong>{" "}
          ({filters.bmi === 0 ? "32.5–37.4" : "37.5 and above"})
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>体重指数</strong>
          （{filters.bmi === 0 ? "32.5至37.4" : "37.5及以上"}）
        </>
      );
    }
  }

  // Gender: 0 = Male, 1 = Female
  if (filters.sex !== undefined) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Gender</strong>{" "}
          ({filters.sex === 0 ? "Male" : "Female"})
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>性别</strong>
          （{filters.sex === 0 ? "男" : "女"}）
        </>
      );
    }
  }

  // Ethnicity: 0 = Chinese, 1 = Non-Chinese
  if (filters.ethnicity !== undefined) {
    if (lan === "en") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>Ethnicity</strong>{" "}
          ({filters.ethnicity === 0 ? "Chinese" : "Non-Chinese"})
        </>
      );
    } else if (lan === "zh") {
      parts.push(
        <>
          <strong style={{ color: "#1976D2" }}>种族</strong>
          （{filters.ethnicity === 0 ? "华人" : "非华人"}）
        </>
      );
    }
  }

  if (parts.length === 0) {
    return (
      <>
        {lan === "zh" ? "未选择筛选条件" : "no selected filter characteristics"}
      </>
    );
  }

  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && ", "}
          {part}
        </React.Fragment>
      ))}
    </>
  );
};