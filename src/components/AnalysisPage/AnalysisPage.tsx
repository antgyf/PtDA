import { useAlert } from "../../hooks/AlertContext";
import ReportPage from "../ReportPage/PDFReport/ReportPage";
import Alert from "../UI/Alert";
import BackButton from "../UI/Button/BackButton";
import LanguageToggle from "../UI/Button/LanguageToggle";
import LogoutButton from "../UI/Button/LogoutButton";
import AfterSurgery from "./AfterSurgery/AfterSurgery";
import BeforeSurgery from "./BeforeSurgery/BeforeSurgery";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const AnalysisPage: React.FC = () => {
  const { alert } = useAlert();

  // Read ?lang= from URL
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const urlLang = query.get("lang");

  // Initialize language from URL default: "en"
  const [currentLang, setCurrentLang] = useState<string>(urlLang ?? "en");

  const [activeTab, setActiveTab] = useState<"summary" | "before" | "after">(
    "summary"
  );

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
    <div className="w-screen min-h-screen flex flex-col max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
      {alert.message && <Alert />}

      {/* Fixed Tab Navigation */}
      <div className="fixed top-0 left-0 w-full bg-white text-gray-900 z-50 shadow-md p-5 max-lg:dark:bg-white max-lg:dark:text-gray-900">
        {/* Desktop top bar - unchanged */}
        <div className="hidden md:flex justify-between">
          {/* Back Button */}
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Priority Page"
                  : currentLang === "zh"
                  ? "优先事项页"
                  : ""
              }
              to={`/priorities?lang=${currentLang}`}
            />
          </div>

          {/* Language Dropdown */}
          <div className="flex-1 flex justify-center">
            <LanguageToggle
              currentLang={currentLang}
              onChange={setCurrentLang}
            />
          </div>

          {/* Logout */}
          <div className="flex items-center">
            <LogoutButton language={currentLang} />
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="flex md:hidden justify-between items-center">
          {/* Back button stays visible */}
          <div className="flex items-center">
            <BackButton
              target={
                currentLang === "en"
                  ? "Priority Page"
                  : currentLang === "zh"
                  ? "优先事项页"
                  : ""
              }
              to={`/priorities?lang=${currentLang}`}
            />
          </div>

          {/* Language + Logout menu in logout position */}
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

        {/* Tab Buttons */}
        <div className="flex justify-center flex-wrap mt-4">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "summary"
                ? "bg-primary !text-white max-lg:dark:!text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 max-lg:text-gray-900 max-lg:dark:bg-gray-200 max-lg:dark:text-gray-900"
            }`}
          >
            {currentLang === "en"
              ? "Summary Report"
              : currentLang === "zh"
              ? "总结报告"
              : ""}
          </button>

          <button
            onClick={() => setActiveTab("before")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "before"
                ? "bg-primary !text-white max-lg:dark:!text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 max-lg:text-gray-900 max-lg:dark:bg-gray-200 max-lg:dark:text-gray-900"
            }`}
          >
            {currentLang === "en"
              ? "Before Surgery"
              : currentLang === "zh"
              ? "手术前"
              : ""}
          </button>

          <button
            onClick={() => setActiveTab("after")}
            className={`px-6 py-3 font-bold text-lg rounded-sm transition-all ${
              activeTab === "after"
                ? "bg-primary !text-white max-lg:dark:!text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 max-lg:text-gray-900 max-lg:dark:bg-gray-200 max-lg:dark:text-gray-900"
            }`}
          >
            {currentLang === "en"
              ? "More Analysis"
              : currentLang === "zh"
              ? "更多分析"
              : ""}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-40 bg-neutral text-gray-900 p-6 max-lg:dark:bg-neutral max-lg:dark:text-gray-900">
        <div style={{ display: activeTab === "summary" ? "block" : "none" }}>
          <ReportPage activeTab={activeTab} currentLang={currentLang} />
        </div>

        <div style={{ display: activeTab === "before" ? "block" : "none" }}>
          <BeforeSurgery activeTab={activeTab} currentLang={currentLang} />
        </div>

        <div style={{ display: activeTab === "after" ? "block" : "none" }}>
          <AfterSurgery activeTab={activeTab} currentLang={currentLang} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;