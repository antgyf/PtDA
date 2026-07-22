import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useForm } from "../../../hooks/FormContext";
import {
  FilterType,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import PatientDetail from "../../FormPage/PatientDetail";
import FilterButtonsComponent from "./Filter";
import SelectVariable from "../SelectVariable";
import { endColor, generateGradientColors, startColor } from "../../../models/UI/Color";
import { useAlert } from "../../../hooks/AlertContext";
import Alert from "../../UI/Alert";
import { GraphData } from "../../../models/patient/patientReport";
import {
  getFilterDescription,
  getName,
  getRankDescription,
} from "../../../utils/helper";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { normalizeReportPriorities } from "../../../utils/priorities";

interface AfterData {
  totalRows: number;
  data: {
    option: number;
    count: number;
    percentage: number;
  }[];
}

interface Description {
  description: string; // The text of the description
  color: string; // The corresponding color for the description
}

interface AfterSurgeryProps {
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

const AfterSurgery: React.FC<AfterSurgeryProps> = ({ activeTab, currentLang }) => {
  const { form, patient } = useForm();
  const { alert, showAlert } = useAlert();

  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [gradientColors, setGradientScheme] = useState<string[]>([]);
  const [afterData, setAfterData] = useState<AfterData | null>(null);
  const [, setDescriptionList] = useState<Description[]>([]);
  const [_, setGraphData] = useState<GraphData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [filters, setFilters] = useState<FilterType>({
    age: 0,
    bmi: 0
  });

  const termToMonths = (term: number) => {
    switch (term) {
      case 1: return 6;
      case 2: return 12;
      case 3: return 24;
      default: return term; // fallback
    }
  };

  // Fetch data whenever filters or variable change
  useEffect(() => {
    if (!question) return;

    const fetchData = async () => {
      setIsLoading(true);
      
      showAlert(currentLang === "en" ? "Fetching data..." : currentLang === "zh" ? "正在获取数据..." : "Fetching data...", "info");
      try {
        const options = Object.entries(question?.list).map(([key]) =>
          parseInt(key, 10)
        );

        const scrollY = window.scrollY; // Save current scroll position

        const response = await api.post(
          "/patients/after",
          {
            questionid: question.id,
            options: options,
            filters: filters,
            patient: patient,
            term: selectedTerm,
            initial: form?.responses.find(
              (r) => r.questionid === question.id
            )?.answervalue,
          }
        );
        
        showAlert(currentLang === "en" ? "Successfully fetched patient data" : currentLang === "zh" ? "成功获取患者数据" : "Successfully fetched patient data", "success");

        const newAfterData = {
          totalRows: +response.data.totalRows,
          data: response.data.data,
        };

        setAfterData(newAfterData);

        setTimeout(() => {
          window.scrollTo(0, scrollY); // Restore scroll position
        }, 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert(currentLang === "en" ? "Failed to fetch data. Please try again." : currentLang === "zh" ? "获取数据失败。请再试一次。" : "Failed to fetch data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters, selectedTerm, currentLang]);

  // Process data after `afterData` is updated
  useEffect(() => {
    if (!afterData || !question) return;

    const processGraphData = (): GraphData => {
      if (!afterData || !afterData.data || !question || !question.list) {
        showAlert(
          currentLang === "en" ? "Something went wrong with retrieving the data. Please try again." : currentLang === "zh" ? "检索数据时出错。请再试一次。" : "Something went wrong with retrieving the data. Please try again.",
          "error"
        );
        return [];
      }

      const gradient = generateGradientColors(afterData.data.length, startColor, endColor);
      setGradientScheme(gradient);

      return [
        [
          "Option",
          "Count",
          { role: "style" },
          {
            role: "annotation",
            type: "string",
          },
        ],
        ...afterData.data.map((item): [string, number, string, string] => [
          `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]} `,
          +item.count,
          gradientColors[item.option % gradientColors.length],
          `${item.count} (${String(item.percentage)}%)`,
        ]),
      ];
    };

    const processDescriptionList = () => {
      if (!question?.list || !afterData?.data) {
        return [];
      }

      return afterData.data.map((item, index) => ({
        description: `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]}`,
        color: gradientColors[index % gradientColors.length],
      }));
    };

    setGraphData(processGraphData());
    setDescriptionList(processDescriptionList());
  }, [afterData, question]);

  // Handle filter changes from FilterButtonsComponent
  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  if (!form || !patient) {
    return (
      <div className="w-full bg-white text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
        {currentLang === "en"
          ? "No patient form found."
          : currentLang === "zh"
          ? "未找到患者表单。"
          : "No patient form found."}
      </div>
    );
  }

  const renderHumanIcons = () => {
    if (!afterData || !afterData.data || !question) return null;

    return afterData.data.map((item: any, index: number) => (
      <div key={index} className="flex items-start mb-4 w-full">
        {/* Fixed Left Space for "Currently Here" Box */}
        <div className="w-1/5 min-w-[150px] flex justify-start items-center">
          {index == Number(form.responses.find((r) => r.questionid === question.id)?.answervalue) ? (
            <div className="flex items-center">
              <div className="bg-white text-gray-900 rounded-md px-3 py-2 shadow-md max-lg:dark:bg-white max-lg:dark:text-gray-900">
                {getName(currentLang)} {currentLang === "en" ? "is currently here" : currentLang === "zh" ? "当前在这里" : "is currently here"}
              </div>
              <div className="text-4xl ml-2">👉</div>
            </div>
          ) : (
            <div className="w-1/5 min-w-[150px]"></div>
          )}
        </div>

        {/* Human Icons and Label */}
        <div className="flex flex-col w-4/5">
          <div className="flex flex-row items-center mb-2">
            <div
              className="text-lg font-semibold mr-2 "
              style={{
                color: gradientColors[index % gradientColors.length],
              }}
            >
              {currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]}
            </div>
            <div className="text-gray-900 max-lg:dark:text-gray-900">
              {item.count} ({String(item.percentage)}%)
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: item.count }).map((_, i) => (
              <div key={i} className="flex items-center">
                <FontAwesomeIcon
                  key={i}
                  icon={faUser}
                  className="text-xl mx-1"
                  style={{
                    color: gradientColors[index % gradientColors.length],
                    // filter:
                    //   "drop-shadow(0 0 .5px black) drop-shadow(0 0 .5px black)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full h-full rounded-md max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
      <div className="flex flex-col max-lg:text-gray-900 max-lg:dark:text-gray-900">
        {alert.message && <Alert />}

        {/* Information Section */}
        <article className="prose mb-5 max-w-none max-lg:text-gray-900 max-lg:dark:text-gray-900 max-lg:prose-h3:text-gray-900 max-lg:dark:prose-h3:text-gray-900 max-lg:prose-p:text-gray-900 max-lg:dark:prose-p:text-gray-900 max-lg:prose-li:text-gray-900 max-lg:dark:prose-li:text-gray-900">
          {currentLang === "en" && (
            <h3 className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
              The {normalizeReportPriorities(form.priorities).length} areas{" "}
              <strong style={{ color: "#1976D2" }}>
                {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
              </strong>{" "}
              hopes to see improvement in are:
            </h3>
          )}

          {currentLang === "zh" && (
            <h3 className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
              {normalizeReportPriorities(form.priorities).length} 个{" "}
              <strong style={{ color: "#1976D2" }}>
                {patient?.fullname} {patient?.sex ? "女士" : "先生"}
              </strong>{" "}
              希望看到改善的主要方面是：
            </h3>
          )}

          <ul className="text-xl mb-3 text-gray-900 max-lg:dark:text-gray-900">
            {getRankDescription(currentLang)}

            <SelectVariable
              value={question?.code || ""}
              onChange={(e) => {
                const selectedCode = e.target.value;
                const foundQuestion = Questions.find(
                  (q) => q.code === selectedCode
                );
                if (foundQuestion) setQuestion(foundQuestion);
              }}
              currentLang={currentLang}
            />

            <select
              className="select select-bordered w-full max-w-xs text-xl bg-white text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
            >
              <option disabled value="">
                {currentLang === "en"
                  ? "Select a post-surgery time point"
                  : currentLang === "zh"
                  ? "选择一个术后时间点"
                  : "Select area"}
              </option>
              <option value={1}>
                6 {currentLang === "en" ? "months" : currentLang === "zh" ? "个月" : "months"}
              </option>
              <option value={2}>
                12 {currentLang === "en" ? "months" : currentLang === "zh" ? "个月" : "months"}
              </option>
              <option value={3}>
                24 {currentLang === "en" ? "months" : currentLang === "zh" ? "个月" : "months"}
              </option>
            </select>
          </ul>

          <div className="text-2xl mb-3 text-gray-900 max-lg:dark:text-gray-900">
            {currentLang === "en"
              ? "Self-reported Functions of Similar Patients after Surgery"
              : currentLang === "zh"
              ? "相似患者手术后报告的功能"
              : "Self-reported Functions of Similar Patients 6 Months after Surgery"}
          </div>
        </article>

        {/* Filter Buttons */}
        <div className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
          <FilterButtonsComponent
            onFilterApply={handleFilterChange}
            activeTab={activeTab}
            currentLang={currentLang}
          />
        </div>

        <div className="max-lg:bg-white max-lg:text-gray-900 max-lg:dark:bg-white max-lg:dark:text-gray-900">
          <PatientDetail currentLang={currentLang} />
        </div>
      </div>

      {/* Loading, Error, or Graph Section */}
      {isLoading ? (
        <div className="text-gray-900 max-lg:dark:text-gray-900">
          Loading data...
        </div>
      ) : (
        question && (
          <div className="bg-secondary text-gray-900 p-4 shadow-md max-lg:dark:bg-secondary max-lg:dark:text-gray-900">
            {/* Responsive Container for Text and Chart */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4">
              <div className="w-full">
                <article className="prose max-w-none max-lg:text-gray-900 max-lg:dark:text-gray-900 max-lg:prose-h3:text-gray-900 max-lg:dark:prose-h3:text-gray-900 max-lg:prose-p:text-gray-900 max-lg:dark:prose-p:text-gray-900">
                  <h3 className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
                    {currentLang === "en"
                      ? question.question
                      : currentLang === "zh"
                      ? question.chQuestion
                      : question.question}
                  </h3>

                  <p className="max-lg:text-gray-900 max-lg:dark:text-gray-900">
                    {currentLang === "en" && (
                      <>
                        Below are responses of {afterData?.totalRows} patients at{" "}
                        {termToMonths(selectedTerm)} months after surgery. Those
                        patients are similar to {getName(currentLang)} in{" "}
                        {getFilterDescription(filters, currentLang)} before
                        surgery, and they experienced the same level of problems
                        as {getName(currentLang)} in this function before surgery.
                      </>
                    )}

                    {currentLang === "zh" && (
                      <>
                        下面是{afterData?.totalRows}名与
                        {getName(currentLang)}相似的患者在手术后
                        {termToMonths(selectedTerm)}个月的回答。 这些患者手术前与
                        {getName(currentLang)}在
                        {getFilterDescription(filters, currentLang)}
                        方面相似，并且他们手术前在这项功能方面经历了与
                        {getName(currentLang)}相同程度的问题。
                      </>
                    )}
                  </p>
                </article>

                <div className="w-full flex flex-row items-start mt-5 text-gray-900 max-lg:dark:text-gray-900">
                  <div>{renderHumanIcons()}</div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AfterSurgery;
