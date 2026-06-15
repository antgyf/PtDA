import React, { useState } from "react";
import RadioChoice from "../UI/Form/RadioChoice";
import { Questions as QuestionsType } from "../../models/patient/patientDetails";

interface MobileFormProps {
  Questions: typeof QuestionsType;
  answers: Record<string, string>;
  handleRadioInput: (code: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  language: string;

  isDisabled: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  setIsDisabled: (val: boolean) => void;
  setAnswers: (val: Record<string, string>) => void;
  originalAnswers: Record<string, string>;
}

const MobileForm: React.FC<MobileFormProps> = ({
  Questions,
  answers,
  handleRadioInput,
  handleSubmit,
  language,
  isDisabled,
  isEditing,
  setIsEditing,
  setIsDisabled,
  setAnswers,
  originalAnswers,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);

  const isUnchanged = React.useMemo(() => {
    return JSON.stringify(answers) === JSON.stringify(originalAnswers);
  }, [answers, originalAnswers]);

  // ✅ Safety check
  if (!Questions || Questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const q = Questions[currentIndex];

  // ✅ Progress based on answered questions (better UX)
  const answeredCount = Object.values(answers).filter((v) => v !== "").length;
  const progress = answeredCount / Questions.length;

  const handleNext = () => {
    if (!answers[q.code]) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCurrentIndex((prev) =>
      Math.min(prev + 1, Questions.length - 1)
    );
  };

  const handleBack = () => {
    setShowError(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <form
      className="flex flex-col h-full justify-between bg-white text-gray-900 dark:bg-white dark:text-gray-900"
      onSubmit={handleSubmit}
    >
      {/* QUESTION */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold">
          {language === "en"
            ? `Question ${currentIndex + 1} of ${Questions.length}`
            : `问题 ${currentIndex + 1} / ${Questions.length}`}
        </h3>

        <h4 className="text-3xl font-bold">
        {language === "en"
          ? "Under each heading, please choose the ONE that best describes your health TODAY."
          : "在每个标题下，请选择最能描述您今天健康状况的选项。"}
      </h4>

        <div
          className={`p-2 rounded ${
            answers[q.code] ? "ring-2 ring-green-500" : ""
          }`}
        >
          <RadioChoice
            name={q.code}
            question={
              language === "en" ? q.question : q.chQuestion
            }
            list={language === "en" ? q.list : q.chList}
            onChange={(value) => handleRadioInput(q.code, value)}
            value={answers[q.code]}
            disabled={isDisabled}
          />
        </div>

        {/* Error message */}
        {showError && (
          <p className="text-red-500 text-sm">
            {language === "en"
              ? "Please select an answer before proceeding."
              : "请先选择一个答案。"}
          </p>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col gap-4 mt-6">

        {/* Progress + Navigation */}
        <div className="flex items-center gap-3">

          {/* Progress bar */}
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Back */}
          {currentIndex > 0 && (
            <button type="button" onClick={handleBack}>
              {language === "en" ? "Back" : "返回"}
            </button>
          )}

            {/* Next / Submit */}
            {currentIndex < Questions.length - 1 ? (
            <button type="button" onClick={handleNext}>
                {language === "en" ? "Next" : "下一步"}
            </button>
            ) : (
            <button
                type="submit"
                disabled={isDisabled || (isEditing && isUnchanged)}
                className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
                {isEditing
                ? language === "en"
                    ? "Update"
                    : "更新"
                : language === "en"
                ? "Submit"
                : "提交"}
            </button>
            )}

        {/* EDIT BUTTON */}
        {isDisabled && !isEditing && (
          <button
            type="button"
            className="text-green-600 font-medium"
            onClick={() => {
              setIsEditing(true);
              setIsDisabled(false);
            }}
          >
            {language === "en" ? "Redo" : "更改选项"}
          </button>
        )}

        {/* CANCEL BUTTON */}
        {isEditing && (
          <button
            type="button"
            className="text-red-500 font-medium"
            onClick={() => {
              setAnswers(originalAnswers);
              setIsEditing(false);
              setIsDisabled(true);
            }}
          >
            {language === "en" ? "Cancel" : "取消"}
          </button>
        )}
        </div>
      </div>
    </form>
  );
};

export default MobileForm;