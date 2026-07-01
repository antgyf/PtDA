import React, { useEffect, useRef, useState } from "react";
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

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-neutral">
      {/* Fixed top banner */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 shadow-md p-4 h-20">
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
        <div className="flex md:hidden justify-between items-center h-full">
          {/* Back button stays visible */}
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

          {/* Forward button + Language/Logout menu */}
          <div className="flex flex-row gap-3 items-center">
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

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-medium"
              >
                ☰
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                  <div className="flex flex-col gap-4">
                    {/* Language change */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {currentLang === "zh" ? "语言" : "Language"}
                      </p>
                      <LanguageToggle
                        currentLang={currentLang}
                        onChange={setCurrentLang}
                      />
                    </div>

                    {/* Logout */}
                    <div className="pt-2 border-t border-gray-200">
                      <LogoutButton language={currentLang} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl px-4 mt-24 overflow-y-auto">
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