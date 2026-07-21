import { useAlert } from "../../hooks/AlertContext";
import ReportPage from "../ReportPage/PDFReport/ReportPage";
import Alert from "../UI/Alert";
import BackButton from "../UI/Button/BackButton";
import LanguageToggle from "../UI/Button/LanguageToggle";
import LogoutButton from "../UI/Button/LogoutButton";
import AfterSurgery from "./AfterSurgery/AfterSurgery";
import BeforeSurgery from "./BeforeSurgery/BeforeSurgery";
import { useState } from "react";
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

  return (
    <div className="w-screen min-h-screen flex flex-col max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
      {alert.message && <Alert />}

      {/* Top navigation */}
      <div className="w-full shrink-0 bg-white text-gray-900 z-50 shadow-md px-4 py-3 md:p-5 max-lg:dark:bg-white max-lg:dark:text-gray-900">
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
        <div className="flex md:hidden flex-col items-start gap-1">
          <div className="w-full">
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

        {/* Tab Buttons */}
        <div className="flex justify-center flex-wrap mt-3 md:mt-4">
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
      <div className="flex-1 bg-neutral text-gray-900 p-6 max-lg:dark:bg-neutral max-lg:dark:text-gray-900">
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
