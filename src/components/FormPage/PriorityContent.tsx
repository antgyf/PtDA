import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAlert } from "../../hooks/AlertContext";
import { useForm } from "../../hooks/FormContext";
import { QuestionType, Questions } from "../../models/patient/patientDetails";
import {
  getAdditionalPriorities,
  isMandatoryPriority,
  MANDATORY_PRIORITY_IDS,
  MAX_ADDITIONAL_PRIORITIES,
  MIN_ADDITIONAL_PRIORITIES,
  normalizeReportPriorities,
} from "../../utils/priorities";
import GreenButton from "../UI/Button/GreenButton";

interface PriorityContentProps {
  term: number;
  language: string;
  onSubmit?: () => void;
}

type AvailableQuestion = {
  question: QuestionType;
  answervalue: number;
};

const PrioritiesContent: React.FC<PriorityContentProps> = ({
  term,
  language,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { patient, form, setPriorities } = useForm();
  const [availableQuestions, setAvailableQuestions] = useState<
    AvailableQuestion[]
  >([]);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>(() =>
    normalizeReportPriorities()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [maxAdditionalPriorities, setMaxAdditionalPriorities] = useState(
    MAX_ADDITIONAL_PRIORITIES
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalPriorities, setOriginalPriorities] = useState<number[]>(() =>
    normalizeReportPriorities()
  );

  const selectedAdditionalPriorities =
    getAdditionalPriorities(selectedPriorities);

  /** Fetch responses to determine available questions and previous priorities. */
  useEffect(() => {
    if (!patient?.patientid || term === undefined) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        showAlert(
          language === "en" ? "Loading priorities..." : "加载优先事项...",
          "info"
        );

        const response = await api.get("/patients/responses", {
          params: { patientid: patient.patientid, term },
        });

        const responses = response.data as {
          code: string;
          answervalue: number;
        }[];

        const questionsWithAnswers = responses
          .map((responseItem): AvailableQuestion | null => {
            const question = Questions.find(
              (item) => item.code === responseItem.code
            );
            if (
              !question ||
              (responseItem.answervalue === 0 &&
                !isMandatoryPriority(question.id))
            ) {
              return null;
            }
            return { question, answervalue: responseItem.answervalue };
          })
          .filter((item): item is AvailableQuestion => item !== null);

        // These areas appear even when the patient reported no current problem.
        MANDATORY_PRIORITY_IDS.forEach((questionId) => {
          if (
            !questionsWithAnswers.some((item) => item.question.id === questionId)
          ) {
            const question = Questions.find((item) => item.id === questionId);
            if (question) {
              const savedResponse = responses.find(
                (item) => item.code === question.code
              );
              questionsWithAnswers.push({
                question,
                answervalue: savedResponse?.answervalue ?? 0,
              });
            }
          }
        });

        questionsWithAnswers.sort((a, b) => {
          const mandatoryDifference =
            Number(isMandatoryPriority(b.question.id)) -
            Number(isMandatoryPriority(a.question.id));
          return mandatoryDifference || a.question.id - b.question.id;
        });
        setAvailableQuestions(questionsWithAnswers);

        const additionalQuestionCount = questionsWithAnswers.filter(
          (item) => !isMandatoryPriority(item.question.id)
        ).length;
        const calculatedMaximum = Math.min(
          MAX_ADDITIONAL_PRIORITIES,
          additionalQuestionCount
        );
        setMaxAdditionalPriorities(calculatedMaximum);

        if (additionalQuestionCount < MAX_ADDITIONAL_PRIORITIES) {
          showAlert(
            language === "en"
              ? `Only ${additionalQuestionCount} additional problem area(s) are available for prioritization.`
              : `只有${additionalQuestionCount}个其他问题方面可供优先排序。`,
            "info"
          );
        }

        const existingPriorities = await api.get("/patients/priority", {
          params: { patientid: patient.patientid, term },
        });

        if (existingPriorities.data?.length > 0) {
          const normalizedPriorities = normalizeReportPriorities(
            existingPriorities.data
          );
          setSelectedPriorities(normalizedPriorities);
          setOriginalPriorities(normalizedPriorities);
          setPriorities(normalizedPriorities);
          setIsDisabled(true);
          setIsEditing(false);
          return;
        }

        const initialPriorities = normalizeReportPriorities(
          form?.term === term ? form.priorities : []
        );
        setSelectedPriorities(initialPriorities);
        setOriginalPriorities(initialPriorities);
        setPriorities(initialPriorities);
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
    if (isDisabled || isMandatoryPriority(questionId)) return;

    setSelectedPriorities((previous) => {
      if (previous.includes(questionId)) {
        return previous.filter((id) => id !== questionId);
      }

      return getAdditionalPriorities(previous).length < maxAdditionalPriorities
        ? [...previous, questionId]
        : previous;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patient?.patientid || term === undefined) return;

    if (
      selectedAdditionalPriorities.length < MIN_ADDITIONAL_PRIORITIES ||
      selectedAdditionalPriorities.length > maxAdditionalPriorities
    ) {
      showAlert(
        language === "en"
          ? "Please select between 1 and 3 additional areas."
          : "请选择1至3个其他方面。",
        "error"
      );
      return;
    }

    const normalizedPriorities = normalizeReportPriorities(selectedPriorities);
    const prioritiesData = {
      patientid: patient.patientid,
      term,
      priorities: normalizedPriorities,
    };

    try {
      showAlert(
        language === "en" ? "Submitting priorities..." : "提交优先事项...",
        "info"
      );
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

      setSelectedPriorities(normalizedPriorities);
      setPriorities(normalizedPriorities);
      setOriginalPriorities(normalizedPriorities);
      setIsDisabled(true);
      setIsEditing(false);
      onSubmit?.();
      if (!wasEditing) {
        navigate(`/analysis?term=${term}&lang=${language}`);
      }
    } catch (err) {
      console.error("Error submitting priorities:", err);
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "An error occurred while submitting priorities.";
      showAlert(message, "error");
    }
  };

  if (isLoading) {
    return (
      <p className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
        {language === "en" ? "Loading priorities..." : "加载优先事项..."}
      </p>
    );
  }

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 text-2xl max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6">
        <h3 className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
          {language === "en"
            ? "Food Enjoyment and Gastrointestinal Problems are included automatically. Please select 1 to 3 additional health problems you wish to improve most."
            : "食物享受和肠胃问题已自动包括。请选择1至3个您最希望改善的其他健康问题。"}
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {availableQuestions.map((item) => {
            const questionId = item.question.id;
            const mandatory = isMandatoryPriority(questionId);
            const selected = selectedPriorities.includes(questionId);

            return (
              <div
                key={questionId}
                aria-disabled={mandatory || isDisabled}
                className={`p-4 border rounded-xl shadow-sm flex flex-col gap-2 transition-all max-lg:text-gray-900 max-lg:dark:text-gray-900 ${
                  mandatory
                    ? "ring-2 ring-green-600 bg-green-50 border-green-300 cursor-not-allowed max-lg:dark:bg-green-50 max-lg:dark:border-green-300"
                    : isDisabled
                    ? selected
                      ? "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed max-lg:dark:bg-gray-100 max-lg:dark:border-gray-300"
                      : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed max-lg:dark:bg-gray-50 max-lg:dark:border-gray-200"
                    : selected
                    ? "ring-2 ring-green-500 bg-green-50 border-green-300 cursor-pointer max-lg:dark:bg-green-50 max-lg:dark:border-green-300"
                    : "bg-white hover:bg-gray-50 hover:shadow-md cursor-pointer max-lg:dark:bg-white max-lg:dark:hover:bg-gray-50"
                }`}
                onClick={() => handleTogglePriority(questionId)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-5 w-5 shrink-0 border-2 rounded flex items-center justify-center ${
                      selected
                        ? "bg-green-600 border-green-600"
                        : "border-gray-400 max-lg:dark:border-gray-400"
                    }`}
                  >
                    {selected && (
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
                      {`${questionId}. ${
                        language === "en"
                          ? item.question.question
                          : item.question.chQuestion
                      }`}
                    </span>
                    {mandatory && (
                      <span className="mt-1 text-base font-semibold text-green-700 max-lg:dark:text-green-700">
                        {language === "en"
                          ? "Included automatically - cannot be deselected"
                          : "已自动包括 - 无法取消选择"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-8 p-2 rounded text-gray-700 max-lg:dark:text-gray-700">
                  {language === "en"
                    ? "Previously selected option: "
                    : "先前选择的选项："}
                  <strong>
                    {language === "en"
                      ? item.question.list[item.answervalue]
                      : item.question.chList[item.answervalue]}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky top-6 h-fit bg-white border rounded-xl shadow p-4 max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
        <h4 className="font-bold mb-1 max-lg:text-gray-900 max-lg:dark:text-gray-900">
          {language === "en"
            ? `Areas included in the report (${selectedPriorities.length}/5)`
            : `报告中包括的方面 (${selectedPriorities.length}/5)`}
        </h4>
        <p className="mb-3 text-base text-gray-600 max-lg:dark:text-gray-600">
          {language === "en"
            ? `Additional choices: ${selectedAdditionalPriorities.length}/${MAX_ADDITIONAL_PRIORITIES}`
            : `其他选择：${selectedAdditionalPriorities.length}/${MAX_ADDITIONAL_PRIORITIES}`}
        </p>

        {selectedAdditionalPriorities.length === 0 && (
          <p className="mb-3 text-gray-500 text-lg max-lg:dark:text-gray-600">
            {language === "en"
              ? "Select at least one additional area."
              : "请至少选择一个其他方面。"}
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {selectedPriorities.map((id) => {
            const question =
              availableQuestions.find((item) => item.question.id === id)
                ?.question || Questions.find((item) => item.id === id);
            const mandatory = isMandatoryPriority(id);

            return (
              <li
                key={id}
                className="p-2 rounded bg-green-50 border border-green-200 flex justify-between items-center max-lg:text-gray-900 max-lg:dark:bg-green-50 max-lg:dark:text-gray-900 max-lg:dark:border-green-200"
              >
                <span className="text-lg max-lg:text-gray-900 max-lg:dark:text-gray-900">
                  {question?.id}.{" "}
                  {language === "en"
                    ? question?.description
                    : question?.chineseDescription}
                  {mandatory && (
                    <span className="block text-sm font-semibold text-green-700 max-lg:dark:text-green-700">
                      {language === "en" ? "Required" : "必选"}
                    </span>
                  )}
                </span>

                {!isDisabled && !mandatory && (
                  <button
                    type="button"
                    onClick={() => handleTogglePriority(id)}
                    className="text-red-600 max-lg:dark:text-red-600 text-sm"
                    aria-label={`Remove ${question?.description || "priority"}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex gap-4 flex-wrap">
          {isDisabled && !isEditing && (
            <GreenButton
              buttonText={language === "en" ? "Redo" : "更改选项"}
              onButtonClick={() => {
                setIsEditing(true);
                setIsDisabled(false);
              }}
            />
          )}

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
