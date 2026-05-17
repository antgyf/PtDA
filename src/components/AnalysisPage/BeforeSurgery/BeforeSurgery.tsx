import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import {
  FilterType,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import PatientDetail from "../../FormPage/PatientDetail";
import SelectVariable from "../SelectVariable";
import { endColor, generateGradientColors, startColor } from "../../../models/UI/Color";
import { useForm } from "../../../hooks/FormContext";
import { useAlert } from "../../../hooks/AlertContext";
import Alert from "../../UI/Alert";
import { GraphData } from "../../../models/patient/patientReport";
import FilterButtonsComponent from "../AfterSurgery/Filter";
import {
  getFilterDescription,
  getName,
  getRankDescription,
} from "../../../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface BeforeData {
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

interface BeforeSurgeryProps {
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

const BeforeSurgery: React.FC<BeforeSurgeryProps> = ({ activeTab, currentLang }) => {
  const { form, patient } = useForm();
  const { alert, showAlert } = useAlert();

  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [gradientColors, setGradientScheme] = useState<string[]>([]);
  const [beforeData, setBeforeData] = useState<BeforeData | null>(null);
  const [, setDescriptionList] = useState<Description[]>([]);
  const [, setGraphData] = useState<GraphData>([]);
  const [filters, setFilters] = useState<FilterType>({
    age: 0,
    bmi: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  // Fetch before surgery data when filters or variable change
  useEffect(() => {
    if (!question) return;

    const fetchData = async () => {
      setIsLoading(true);
      currentLang === "en" ? showAlert("Fetching data...", "info") : currentLang === "zh" ?
      showAlert("正在获取数据...", "info") : showAlert("Fetching data...", "info");

      try {
        const options = Object.entries(question.list);

        const scrollY = window.scrollY; // Save scroll position
        const response = await api.post(
          "/patients/before",
          {
            questionid: question.id,
            filters: filters,
            options: options.map(([key]) => +key), // Convert keys from answer options to numbers
            patient: patient,
          }
        );

        currentLang === "en" ? showAlert("Successfully fetched patient data", "success") : currentLang === "zh" ?
        showAlert("成功获取患者数据", "success") : showAlert("Successfully fetched patient data", "success");

        setBeforeData({
          totalRows: +response.data.totalRows,
          data: response.data.data,
        });

        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = "auto"; // Prevent conflict
          window.scrollTo({ top: scrollY, behavior: "instant" });
          document.documentElement.style.scrollBehavior = "smooth"; // Restore smooth scrolling
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        currentLang === "en" ? showAlert("Failed to load data. Please try again.", "error") : currentLang === "zh" ?
        showAlert("加载数据失败。请再试一次。", "error") : showAlert("Failed to load data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [question, filters, currentLang]);

  // Process data for chart and descriptions
  useEffect(() => {
    if (!question || !beforeData) return;

    const processGraphData = (): GraphData => {
      if (!beforeData || !beforeData.data || !question?.list) {
        showAlert("Error retrieving data. Please try again.", "error");
        return [];
      }

      const gradient = generateGradientColors(beforeData.data.length, startColor, endColor);
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
        ...beforeData.data.map((item): [string, number, string, string] => [
          `${currentLang === "en" ? question.list[item.option] : currentLang === "zh" ? question.chList[item.option] : question.list[item.option]} \n (${item.count})`,
          +item.count,
          gradientColors[item.option % gradientColors.length],
          `${String(item.percentage)}%`,
        ]),
      ];
    };

    const processDescriptionList = (): Description[] => {
      if (!question?.list || !beforeData?.data) {
        return [];
      }

      return beforeData.data.map((item, index) => ({
        description: currentLang === "en" ? `${question.list[item.option]}` : currentLang === "zh" ? `${question.chList[item.option]}` : `${question.list[item.option]}`,
        color: gradientColors[index % gradientColors.length],
      }));
    };

    setGraphData(processGraphData());
    setDescriptionList(processDescriptionList());
  }, [beforeData, question, currentLang]);

  if (!form || !patient) {
    return <div>No patient form found.</div>;
  }

const renderHumanIcons = () => {
  if (!beforeData || !beforeData.data || !question) return null;

  // Get the patient's selected answer value for this question
  const patientAnswerValue = form.responses.find(
    (r) => r.questionid === question.id
  )?.answervalue;

  /*
  beforeData.data.forEach((item, index) => {
    console.log(`Item ${index} - option:`, item.option, typeof item.option, 'matches:', item.option == patientAnswerValue);
  });
  */

  return beforeData.data.map((item: any, index: number) => {
    // Check if this item's option matches the patient's answer
    const isPatientHere = item.option == patientAnswerValue;

    return (
      <div key={index} className="flex items-start mb-4 w-full">
        {/* Fixed Left Space for "Currently Here" Box */}
        <div className="w-1/5 min-w-[150px] flex justify-start items-center">
          {isPatientHere ? (
            <div className="flex items-center">
              <div className="bg-white rounded-md px-3 py-2 shadow-md">
                {getName(currentLang)} {currentLang === "en" ? "is currently here" : currentLang === "zh" ? "当前在这里" : "is currently here"}
              </div>
              <div className="text-4xl ml-2">👉</div>
            </div>
          ) : (
            <div className="w-1/5 min-w-[120px]"></div>
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
            <div className="font-semibold">
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
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });
};


  return (
    <div className="w-full rounded-lg">
      {alert.message && <Alert />}

      {/* Information Section */}
      <article className="prose mb-5 max-w-none">
        {currentLang === "en" && (
          <h3>
            The {form.priorities?.length || 0} areas{" "}
            <strong style={{ color: "#1976D2" }}>
              {patient?.sex ? "Ms." : "Mr."} {patient?.fullname}
            </strong>{" "}
            hopes to see improvement in are:
          </h3>
          )}
          {currentLang === "zh" && (
          <h3>
            {form.priorities?.length || 0} 个{" "}
            <strong style={{ color: "#1976D2" }}>
              {patient?.fullname} {patient?.sex ? "女士" : "先生"}
            </strong>{" "}
            希望看到改善的主要方面是：
              </h3>
          )}<ul className="text-xl mb-3">
          {getRankDescription(currentLang)}

          {/* Variable Selection */}
          <SelectVariable
            value={question?.code || ""}
            onChange={(e) => {
              const selectedCode = e.target.value;
              const foundQuestion = Questions.find(q => q.code === selectedCode);
              if (foundQuestion) setQuestion(foundQuestion);
            }}
            currentLang={currentLang}
          />
        </ul>

          <div className="text-2xl mb-3">
            {currentLang === "en" ? "Self-reported Functions of Similar Patients before Surgery" : 
              currentLang === "zh" ? "相似患者手术前报告的功能" 
              : "Self-reported Functions of Similar Patients 6 Months before Surgery"}
          </div>
      </article>

      <FilterButtonsComponent
        key={question?.id}
        onFilterApply={handleFilterChange}
        activeTab={activeTab}
        currentLang={currentLang}
      />

      <PatientDetail currentLang={currentLang}/>

      {/* Loading/Error State */}
      {isLoading && <div>Loading data...</div>}

      {/* Description Section */}
      {question && !isLoading && (
        <div className="bg-secondary p-4 shadow-md">
          {/* Responsive Container for Text and Chart */}
          <div className="flex flex-wrap lg:flex-nowrap gap-4 ">
            <div className="w-full">
              <article className="prose max-w-none">
                <h3>{currentLang === "en" ? question.question : currentLang === "zh" ? question.chQuestion : question.question}</h3>
                <p>
                  {currentLang === "en" && (
                    <>Below are responses of {beforeData?.totalRows} patients similar to {getName(currentLang)}.{" "}
                    Those patients are similar to {getName(currentLang)} in {getFilterDescription(filters, patient, currentLang)}.</>
                  )}
                  {currentLang === "zh" && (
                    <>以下是{beforeData?.totalRows}名与{getName(currentLang)}相似的患者在手术前的回答。
                    这些患者与{getName(currentLang)}在{getFilterDescription(filters, patient, currentLang)}方面相似。
                    </>
                  )}
                </p>
              </article>

              <div className="w-full flex flex-row items-start mt-5">
                <div>{renderHumanIcons()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeSurgery;
