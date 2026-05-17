import { useEffect, useState } from "react";
import PDFReport from "./PDFReport";
import FilterButtonsComponent from "../../AnalysisPage/AfterSurgery/Filter";
import {
  BarChartData,
  FilterType,
  QuestionData,
  Questions,
  QuestionType,
} from "../../../models/patient/patientDetails";
import { getRankDescription } from "../../../utils/helper";
import { useAlert } from "../../../hooks/AlertContext";
import api from "../../../api/api";
import { useForm } from "../../../hooks/FormContext";
import { RadarDataPoint } from "../../../models/patient/patientReport";
import RadarChartCustom from "../RadarChart";
import Alert from "../../UI/Alert";

interface ReportPageProps {
  activeTab: "summary" | "before" | "after";
  currentLang: string;
}

const ReportPage: React.FC<ReportPageProps> = ({ activeTab, currentLang }) => {
  const { form, patient } = useForm();
  const [filters, setFilters] = useState<FilterType>({
    age: 0,
    bmi: 0,
  });
  const { alert, showAlert } = useAlert();
  const [questionData, setQuestionData] = useState<Record<number, QuestionData>>({});
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [radarImage, setRadarImage] = useState<string | null>(null);

  if (!form) {
    return (
      <>{currentLang === "en" ? "Something went wrong with retrieving patient data. Please try again." : 
        currentLang === "zh" ? "获取患者数据时出错。请再试一次。" : "Something went wrong with retrieving patient data. Please try again."}</>
    );
  }

  if (!form.priorities || form.priorities.length === 0) {
    return <>{currentLang === "en" ? "No priorities selected. Please go back to the previous page." : 
      currentLang === "zh" ? "未选择优先事项。请返回上一页。" : "No priorities selected. Please go back to the previous page."}</>;
  }

  const variables: number[] = form.priorities;

  const getPriorityScore = (question: number): number => {
    return question;
  };

  const questionsWithOptions = (form.priorities || [])
    .map((qid) => {
      const question = Questions.find((q) => q.id === qid);
      const response = form.responses.find((r) => r.questionid === qid);
      return question
        ? {
            ...question,
            value: response?.answervalue ?? null,
          }
        : null;
    })
    .filter(Boolean) as (QuestionType & { value: any })[];

  // Process bar chart data when questionData changes and we have all questions
  useEffect(() => {
    if (Object.keys(questionData).length === variables.length && variables.length > 0) {
      processBarChartData();
    }
  }, [questionData, variables.length]);

  const processBarChartData = () => {
    const sortedKeys = [...variables]; // Keep all IDs in order

    const updatedBarChartData: BarChartData[] = sortedKeys.map((key) => {
      const data = questionData[key];
      
      // ✅ Handle both cases: no data yet AND empty data
      if (!data) {
        return {
          title: `No similar patients found for question ${key}`,
          options: [{ label: "No data available", percentageText: "0 of 0", percent: 0 }],
          questionid: key,
          variableQuestion: currentLang === "en" ? Questions.find((q) => q.id === key)?.description : Questions.find((q) => q.id === key)?.chineseDescription,
          initial: form?.responses.find((r) => r.questionid === key)?.answervalue ?? -1,
        };
    }

      // ✅ Explicitly check for empty data
      if (data.totalRows === 0 || !data.data || data.data.length === 0) {
        return {
          title: `No similar patients found for question ${key}`,
          options: [{ label: "No data available", percentageText: "0 of 0", percent: 0 }],
          questionid: key,
          variableQuestion: currentLang === "en" ? Questions.find((q) => q.id === key)?.description : Questions.find((q) => q.id === key)?.chineseDescription,
          initial: form?.responses.find((r) => r.questionid === key)?.answervalue ?? -1,
        };
      }

      const title =
        currentLang === "en"
          ? `Responses of ${data.totalRows} patient(s)`
          : currentLang === "zh"
          ? `${data.totalRows} 名患者的回答`
          : `Responses of ${data.totalRows} patient(s)`;

      // Clone data array for manipulation
      let chartData = data.data.map(item => ({ ...item }));

      // Calculate percentage labels
      const labelsAndPercentages = chartData.map((v) => {
        const total = Number(data.totalRows);
        const count = Number(v.count);
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
        
        return {
          label: currentLang === "en" ? `${Questions.find((q) => q.id === data.questionid)?.list?.[Number(v.option)] || v.option}` 
          : currentLang === "zh" ? `${Questions.find((q) => q.id === data.questionid)?.chList?.[Number(v.option)] || v.option}` : `${Questions.find((q) => q.id === data.questionid)?.list?.[Number(v.option)] || v.option}`,
          percentageText: currentLang === "en" ? `${count} of ${total}` : currentLang === "zh" ? `${count} / ${total}` : `${count} of ${total}`,
          percent: Number(percentage),
        };
      });

      return {
        title,
        options: labelsAndPercentages,
        questionid: data.questionid,
        variableQuestion: currentLang === "en" ? Questions.find((q) => q.id === data.questionid)?.description 
        : currentLang === "zh" ? Questions.find((q) => q.id === data.questionid)?.chineseDescription : Questions.find((q) => q.id === data.questionid)?.description,
        initial: form?.responses.find((r) => r.questionid === key)?.answervalue ?? -1,
      };
    });

    setBarChartData(updatedBarChartData);
  };

  useEffect(() => {
    if (variables.length === 0) {
      console.log("No variables to process");
      return;
    }
    
    setIsLoading(true);
    setRadarImage(null);
    
    // Reset state to prevent accumulation when navigating back
    setRadarData([]);
    setQuestionData({});
    setBarChartData([]);

    const fetchDataForVariable = async (item: QuestionType & { value: any }) => {
      try {
        const options = Object.keys(item.list).map(Number);

        
        showAlert(currentLang === "en" ? "Loading..." : currentLang === "zh" ? "加载中..." : "Loading...", "info");

        const response = await api.post(
          "/patients/after",
          {
            questionid: item.id,
            options: options,
            filters: filters,
            patient: patient,
            initial: form?.responses.find((r) => r.questionid === item.id)?.answervalue,
            median: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //console.log("filters used:", filters);
        
        showAlert(currentLang === "en" ? "Successfully loaded patient" : 
          currentLang === "zh" ? "成功加载患者" : "Successfully loaded patient", "success");

        if (response.data.message === "No baseline patients found for the given filters.") {
          response.data = {
            questionid: item.id,
            totalRows: 0,
            data: [],
            median: 0,
          };
        }

        // Update radar data
        setRadarData((prevData) => {
          const responseValue = form.responses.find(
            (r) => r.questionid === item.id
          )?.answervalue ?? -1;

          const importance = getPriorityScore(item.id);
          
          if (response.data.totalRows === 0 || !response.data.data || response.data.data.length === 0) {
            return prevData;
          }

          const newEntry = {
            questionid: response.data.questionid,
            initial: responseValue,
            median: response.data.median,
            n: response.data.totalRows ?? 0,
            importance,
          };

          const filteredData = prevData.filter(d => d.questionid !== response.data.questionid);
          return [...filteredData, newEntry];
        });

        // Update question data - just store the raw data
        setQuestionData((prevData) => ({
          ...prevData,
          [response.data.questionid]: {
            totalRows: response.data.totalRows,
            data: [...response.data.data],
            questionid: response.data.questionid,
          },
        }));

      } catch (error) {
        showAlert(currentLang === "en" ? "Failed to fetch data. Please try again." : 
          currentLang === "zh" ? "获取数据失败。请再试一次。" : "Failed to fetch data. Please try again.", "error");
      }
    };

    Promise.all(questionsWithOptions.map(fetchDataForVariable))
      .finally(() => setIsLoading(false));
  }, [filters, currentLang]);
  
  const handleFilterChange = (selectedFilters: FilterType) => {
    setFilters(selectedFilters);
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full gap-2">
      {alert.message && <Alert />}
      <div className="flex flex-col w-full justify-start mb-1">
        <article className="prose mb-1 max-w-none">
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
          )}
          <ul className="text-xl mb-3">
           {getRankDescription(currentLang)}

          </ul>
          <div className="text-2xl mb-3">
              {currentLang === "en" ? "Self-reported Functions of Similar Patients 6 Months after Surgery" : 
              currentLang === "zh" ? "相似患者手术后6个月报告的功能" 
              : "Self-reported Functions of Similar Patients 6 Months after Surgery"}
          </div>
        </article>
        <FilterButtonsComponent activeTab={activeTab} onFilterApply={handleFilterChange} currentLang={currentLang}/>
      </div>

      {!radarImage && !isLoading && (
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <RadarChartCustom
            radarData={radarData}
            onImageGenerated={setRadarImage}
          />
        </div>
      )}
      {radarImage && (
        <PDFReport          
          filters={filters}
          barChartData={barChartData}
          currentLang={currentLang}

        />
      )}
    </div>
  );
};

export default ReportPage;