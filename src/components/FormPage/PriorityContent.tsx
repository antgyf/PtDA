import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/AlertContext";
import { Questions, QuestionType } from "../../models/patient/patientDetails";
import api from "../../api/api";
import { useForm,  } from "../../hooks/FormContext";
import GreenButton from "../UI/Button/GreenButton";

interface PriorityContentProps {
  term: number;
  language: string;
  onSubmit?: () => void;
}

const PrioritiesContent: React.FC<PriorityContentProps> = ({ term, language, onSubmit }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, form, setPriorities } = useForm();
  const [availableQuestions, setAvailableQuestions] = useState<{ question : QuestionType, answervalue: number }[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPriorities, setMaxPriorities] = useState(5);
  const [isDisabled, setIsDisabled] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [originalPriorities, setOriginalPriorities] = useState<number[]>([]);

  /** Fetch responses to determine available questions & previous priorities */
  useEffect(() => {
    if (!patient?.patientid || term === undefined) return;

    const fetchData = async () => {
      
      try {
      setIsLoading(true);
      showAlert(language === "en" ? "Loading priorities..." : language === "zh" ? "加载优先事项..." : "", "info");
        if (!patient?.patientid) throw new Error("No patient ID found");

        const response = await api.get("/patients/responses", {
          params: { patientid: patient.patientid, term },
        });

        const filteredResponses = response.data
          .filter((r: { code: string; answervalue: number }) => r.answervalue !== 0)

        const questionsWithAnswers = filteredResponses.map((r : { code: string; answervalue: number }) => {
                const question = Questions.find((q) => q.code === r.code);
                return question ? { question, answervalue: r.answervalue } : null;
        });
        
        setAvailableQuestions(questionsWithAnswers);
        const calculatedMinPriorities = Math.min(5, questionsWithAnswers.length);
        setMaxPriorities(calculatedMinPriorities);

        if (filteredResponses.length < 5) {
          showAlert(language === "en" ? `Only ${calculatedMinPriorities} problem areas available for prioritization.` : 
            language === "zh" ? `只有${calculatedMinPriorities}个问题方面可供优先排序。` : "", "info");
        }

        const existingPriorities = await api.get("/patients/priority", {
          params: { patientid: patient.patientid, term }
        });

        if (existingPriorities.data && existingPriorities.data.length > 0) {
          setSelectedPriorities(existingPriorities.data);
          setOriginalPriorities(existingPriorities.data);
          setPriorities(existingPriorities.data);
          setIsDisabled(true);
          setIsEditing(false);
          return;
        }

        // fallback to context
        if (form?.priorities && form.term === term) {
          setSelectedPriorities(form.priorities);
          setOriginalPriorities(form.priorities);
          setPriorities(form.priorities);

          if (form.priorities.length > 0) {
            setIsDisabled(true);
            setIsEditing(false);
          } else {
            setIsDisabled(false); // ✅ allow selection
          }

          return;
        }

        
        setSelectedPriorities([]);
        setIsDisabled(false);

      } catch (err) {
        console.error("Error fetching responses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patient?.patientid, term]);

  const handleTogglePriority = (questionId: number) => {
    if (isDisabled) return; // do nothing if priorities already exist

    setSelectedPriorities((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : prev.length < maxPriorities
        ? [...prev, questionId]
        : prev
    );
  };

  /** Submit via form onSubmit to get event object automatically */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patient?.patientid || term === undefined) return;

    if (selectedPriorities.length > maxPriorities) {
      
      showAlert(language === "en" ? `Please select ${maxPriorities} or less priorities.` : 
        language === "zh" ? `请选择不超过${maxPriorities}个优先事项。` : "", "error");
      return;
    }

    const prioritiesData = {
      patientid: patient.patientid,
      term,
      priorities: selectedPriorities,
      maxPriorities: maxPriorities,
    };

    try {
      showAlert(language === "en" ? "Submitting priorities..." : 
        language === "zh" ? "提交优先事项..." : "", "info");
      const wasEditing = isEditing;

      const method = isEditing ? api.put : api.post;

      const response = await method("/patients/priorities", prioritiesData, {
        headers: { "Content-Type": "application/json" },
      });

      showAlert(
        response.data.message ||
          (language === "en"
            ? wasEditing
              ? "Priorities updated successfully!"
              : "Priorities submitted successfully!"
            : wasEditing
            ? "优先事项更新成功！"
            : "优先事项提交成功！"),
        "success"
      );

      setPriorities(selectedPriorities);
      setOriginalPriorities(selectedPriorities); // ⭐ update snapshot
      setIsDisabled(true);
      setIsEditing(false);
      onSubmit?.();
      if (!wasEditing) {
        navigate(`/analysis?term=${term}&lang=${language}`); // navigate on first submit only
      }
    } catch (err) {
      console.error("Error submitting priorities:", err);
      showAlert("An error occurred while submitting priorities.", "error");
    }
  };
  
  if (isLoading)
    return (
      <p className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
        {language === "en"
          ? "Loading priorities..."
          : language === "zh"
          ? "加载优先事项..."
          : ""}
      </p>
    );

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 text-2xl max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900"
      onSubmit={handleSubmit}
    >
      {/* LEFT SIDE — QUESTION SELECTION */}
      <div className="flex flex-col gap-6">
        <h3 className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
          {language === "en"
            ? "Below are the health problems you reported. Please select up to 5 problems you wish to improve most."
            : language === "zh"
            ? "以下是您报告的健康问题。请选择最多5个您最希望改善的问题。"
            : ""}
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {availableQuestions.map((q) => (
            <div
              key={q.question.id}
              className={`p-4 border rounded-xl shadow-sm flex flex-col gap-2 transition-all max-lg:text-gray-900 max-lg:dark:text-gray-900 ${
                isDisabled
                  ? selectedPriorities.includes(q.question.id)
                    ? "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed max-lg:dark:bg-gray-100 max-lg:dark:border-gray-300"
                    : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed max-lg:dark:bg-gray-50 max-lg:dark:border-gray-200"
                  : selectedPriorities.includes(q.question.id)
                  ? "ring-2 ring-green-500 bg-green-50 border-green-300 cursor-pointer max-lg:dark:bg-green-50 max-lg:dark:border-green-300"
                  : "bg-white hover:bg-gray-50 hover:shadow-md cursor-pointer max-lg:dark:bg-white max-lg:dark:hover:bg-gray-50"
              }`}
              onClick={() =>
                !isDisabled && handleTogglePriority(q.question.id)
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-5 w-5 shrink-0 border-2 rounded flex items-center justify-center ${
                    selectedPriorities.includes(q.question.id)
                      ? "bg-green-600 border-green-600"
                      : "border-gray-400 max-lg:dark:border-gray-400"
                  }`}
                >
                  {selectedPriorities.includes(q.question.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex flex-col text-2xl">
                  <span className="font-medium max-lg:text-gray-900 max-lg:dark:text-gray-900">
                    {`${q.question.id}. ${
                      language === "en"
                        ? q.question.question
                        : language === "zh"
                        ? q.question.chQuestion
                        : ""
                    }`}
                  </span>
                </div>
              </div>

              <div className="ml-8 p-2 rounded text-gray-700 max-lg:dark:text-gray-700">
                {language === "en"
                  ? "Previously selected option: "
                  : language === "zh"
                  ? "先前选择的选项："
                  : ""}
                <strong>
                  {language === "en"
                    ? q.question.list[q.answervalue]
                    : language === "zh"
                    ? q.question.chList[q.answervalue]
                    : ""}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — STICKY CHOSEN AREAS PANEL */}
      <div className="sticky top-6 h-fit bg-white border rounded-xl shadow p-4 max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
        <h4 className="font-bold mb-3 max-lg:text-gray-900 max-lg:dark:text-gray-900">
          {language === "en"
            ? `Problems you wish to improve most (${selectedPriorities.length}/5)`
            : `您最希望改善的问题 (${selectedPriorities.length}/5)`}
        </h4>

        {selectedPriorities.length === 0 && (
          <p className="text-gray-500 text-lg max-lg:dark:text-gray-600">
            {language === "en" ? "No areas selected yet." : "尚未选择问题。"}
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {[...selectedPriorities]
            .sort((a, b) => a - b)
            .map((id) => {
              const q = availableQuestions.find(
                (q) => q.question.id === id
              );

              return (
                <li
                  key={id}
                  className="p-2 rounded bg-green-50 border border-green-200 flex justify-between items-center max-lg:text-gray-900 max-lg:dark:bg-green-50 max-lg:dark:text-gray-900 max-lg:dark:border-green-200"
                >
                  <span className="text-lg max-lg:text-gray-900 max-lg:dark:text-gray-900">
                    {q?.question.id}.{" "}
                    {language === "en"
                      ? q?.question.description
                      : q?.question.chineseDescription}
                  </span>

                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => handleTogglePriority(id)}
                      className="text-red-600 max-lg:dark:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </li>
              );
            })}
        </ul>

        <div className="mt-4 flex gap-4 flex-wrap">
          {/* EDIT BUTTON */}
          {isDisabled && !isEditing && (
            <GreenButton
              buttonText={language === "en" ? "Redo" : "更改选项"}
              onButtonClick={() => {
                setIsEditing(true);
                setIsDisabled(false);
              }}
            />
          )}

          {/* CANCEL BUTTON */}
          {isEditing && (
            <GreenButton
              buttonText={language === "en" ? "Cancel" : "取消"}
              onButtonClick={() => {
                setSelectedPriorities(originalPriorities);
                setIsEditing(false);
                setIsDisabled(true);
              }}
            />
          )}

          {/* SUBMIT / UPDATE BUTTON */}
          {!isDisabled && (
            <GreenButton
              buttonText={
                isEditing
                  ? language === "en"
                    ? "Update Priorities"
                    : "更新优先事项"
                  : language === "en"
                  ? "Submit"
                  : "提交"
              }
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default PrioritiesContent;
