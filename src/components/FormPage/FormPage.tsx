import React, { useState } from "react";
import BackButton from "../UI/Button/BackButton";
import ForwardButton from "../UI/Button/ForwardButton";
import LogoutButton from "../UI/Button/LogoutButton";
import FormContent from "./FormContent";
import Alert from "../UI/Alert";
import { useForm } from "../../hooks/FormContext";
import { useAlert } from "../../hooks/AlertContext";
import LanguageToggle from "../UI/Button/LanguageToggle";
import { useLocation } from "react-router-dom";

const FormPage: React.FC = () => {
  const { patient, term } = useForm();
  const { alert } = useAlert();

  // Read search params
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // Read ?lang= from URL
  const urlLang = query.get("lang");

  // Initialize language from URL fallback to "en"
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");

  // Term dropdown
  const [selectedTerm] = useState<number>(term ?? 0);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Top banner */}
      <div className="w-full shrink-0 bg-white z-40 shadow-md px-4 py-3 md:h-20 md:py-4">
        {alert.message && <Alert />}

        {/* Desktop top bar - unchanged */}
        <div className="hidden md:flex justify-between items-center h-full">
          {/* Left side: Back */}
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Patient Page"
                  : currentLang === "zh"
                  ? "患者主页"
                  : ""
              }
              to={`/home?lang=${currentLang}`}
            />
          </div>

          {/* Center: Language Dropdown */}
          <div className="flex-1 flex justify-center">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          {/* Right side: Forward + Logout */}
          <div className="flex flex-row gap-4 items-center">
            {patient?.hasform && (
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Priorities Page"
                    : currentLang === "zh"
                    ? "优先事项页"
                    : ""
                }
                to={`/priorities?term=${selectedTerm}&lang=${currentLang}`}
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
                  ? "Patient Page"
                  : currentLang === "zh"
                  ? "患者主页"
                  : ""
              }
              to={`/home?lang=${currentLang}`}
            />
          </div>

          {patient?.hasform && (
            <div className="w-full">
              <ForwardButton
                target={
                  currentLang === "en"
                    ? "Priorities Page"
                    : currentLang === "zh"
                    ? "优先事项页"
                    : ""
                }
                to={`/priorities?term=${selectedTerm}&lang=${currentLang}`}
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
        <div className="flex-1 w-full max-w-7xl rounded-lg overflow-y-auto">
          <FormContent
            key={selectedTerm}
            term={selectedTerm}
            language={currentLang}
          />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
