import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import { useAlert } from "../../hooks/AlertContext";
import Alert from "../UI/Alert";
import PrioritiesContent from "./PriorityContent";
import { useForm } from "../../hooks/FormContext";
import LanguageToggle from "../UI/Button/LanguageToggle";
import { hasValidAdditionalPriorityCount } from "../../utils/priorities";

const PrioritiesPage: React.FC = () => {
  const { alert } = useAlert();
  const { form } = useForm();

  // Read search params
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // Extract values
  const term = Number(query.get("term"));
  const urlLang = query.get("lang");

  // Initialize language based on URL fallback to "en"
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");

  if (isNaN(term)) {
    return <div>Error: No term specified</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Top banner */}
      <div className="w-full shrink-0 bg-white z-40 shadow-md px-4 py-3 md:h-20 md:py-4">
        {alert.message && <Alert />}

        {/* Desktop top bar - unchanged */}
        <div className="hidden md:flex justify-between items-center h-full">
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Form Page"
                  : currentLang === "zh"
                  ? "表格页"
                  : ""
              }
              to={`/form?lang=${currentLang}`}
            />
          </div>

          <div className="flex-1 flex justify-center">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            {hasValidAdditionalPriorityCount(form?.priorities) && (
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Analysis Page"
                    : currentLang === "zh"
                    ? "分析页"
                    : ""
                }
                to={`/analysis?lang=${currentLang}`}
              />
            )}
            <LogoutButton language={currentLang} />
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex md:hidden flex-col items-start gap-1">
          <div className="w-full">
            <BackButton
              target={
                currentLang === "en"
                  ? "Form Page"
                  : currentLang === "zh"
                  ? "表格页"
                  : ""
              }
              to={`/form?lang=${currentLang}`}
            />
          </div>

          {hasValidAdditionalPriorityCount(form?.priorities) && (
            <div className="w-full">
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Analysis Page"
                    : currentLang === "zh"
                    ? "分析页"
                    : ""
                }
                to={`/analysis?lang=${currentLang}`}
              />
            </div>
          )}

          <div className="w-full">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          <div className="w-full">
            <LogoutButton language={currentLang} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 py-4 overflow-y-auto">
        <PrioritiesContent key={term} term={term} language={currentLang} />
      </div>
    </div>
  );
};

export default PrioritiesPage;
