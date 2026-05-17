import React from "react";
import {
  Document,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Table from "./Table/Table";
import {
  BarChartData,
  FilterType,
} from "../../../models/patient/patientDetails";
import { useForm } from "../../../hooks/FormContext";
import BarChart from "./QuestionWithDynamicOptions/BarChart";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSansSC",
  fonts: [
    {
      src: "/fonts/NotoSansSC-Regular.ttf",
    },
    {
      src: "/fonts/NotoSansSC-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const getFontFamily = (lan: string) => {
  switch (lan) {
    case "zh":
      return "NotoSansSC";
    default:
      return "Inter";
  }
};

const createStyles = (lang: string) =>
  StyleSheet.create({
    page: {
      padding: 10,
      fontSize: 10,
      fontFamily: getFontFamily(lang),
      flexDirection: "column",
    },
    instruction: {
      fontSize: 11,
      marginBottom: 1,
      fontFamily: getFontFamily(lang),
    },
    title: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: getFontFamily(lang),
      marginBottom: 1,
    },
    bold: {
      fontSize: 10,
      fontWeight: "bold",
      marginBottom: 2,
      fontFamily: getFontFamily(lang),
    },
    boldText: {
      color: "#1976D2",
      fontFamily: getFontFamily(lang),
      fontSize: 10,
      fontWeight: "bold",
    },
    colContainer: {
      flexDirection: "column",
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    nameBoxContainer: {
      width: 150, // fixed left-side space
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    nameBox: {
      width: 130, // fixed box width
      minHeight: 55, // fixed-ish height but still allows wrapping
      borderWidth: 2,
      borderColor: "black",
      padding: 5,
      fontSize: 10,
      fontFamily: getFontFamily(lang),
      justifyContent: "center",
    },
    chartContainer: {
      width: "80%",
      flex: 1,
    },
    pointer: {
      fontSize: 14,
      marginLeft: 5,
    },
    noDataContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
    },
    noDataText: {
      fontSize: 14,
      color: "#666",
      fontFamily: getFontFamily(lang),
    },
  });

interface PDFReportProps {
  filters: FilterType;
  barChartData: BarChartData[];
  currentLang: string;
}

const PDFReport: React.FC<PDFReportProps> = ({
  filters,
  barChartData,
  currentLang,
}) => {
  const { patient } = useForm();

  const styles = createStyles(currentLang);
  const numPriorities = barChartData.length;

  const getName = () => {
    if (!patient) return null;

    return (
      <Text style={styles.bold}>
        {currentLang === "en"
          ? `${patient.sex ? "Ms." : "Mr."} ${patient.fullname}`
          : `${patient.fullname}${patient.sex ? "女士" : "先生"}`}
      </Text>
    );
  };


  const getFilterDescription = (filters: FilterType) => {
    const descriptionParts: React.ReactNode[] = [];

    // Age: 0 = <50, 1 = 50+
    if (filters.age !== undefined) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Age</Text>{" "}
            ({filters.age === 0 ? "below 50 years" : "50 years and above"})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>年龄</Text>
            （{filters.age === 0 ? "50岁以下" : "50岁及以上"}）
          </>
        );
      }
    }

    // BMI: 0 = 32.5–37.4, 1 = 37.5+
    if (filters.bmi !== undefined) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>BMI</Text>{" "}
            ({filters.bmi === 0 ? "32.5 to 37.4" : "37.5 and above"})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>体重指数(BMI)</Text>
            （{filters.bmi === 0 ? "32.5至37.4" : "37.5及以上"}）
          </>
        );
      }
    }

    // Gender: 0 = Male, 1 = Female
    if (filters.sex !== undefined) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Gender</Text>{" "}
            ({filters.sex === 0 ? "Male" : "Female"})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>性别</Text>
            （{filters.sex === 0 ? "男" : "女"}）
          </>
        );
      }
    }

    // Ethnicity: 0 = Chinese, 1 = Non-Chinese
    if (filters.ethnicity !== undefined) {
      if (currentLang === "en") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>Ethnicity</Text>{" "}
            ({filters.ethnicity === 0 ? "Chinese" : "Non-Chinese"})
          </>
        );
      } else if (currentLang === "zh") {
        descriptionParts.push(
          <>
            <Text style={styles.boldText}>种族</Text>
            （{filters.ethnicity === 0 ? "华人" : "非华人"}）
          </>
        );
      }
    }

    if (descriptionParts.length === 0) {
      return (
        <Text>
          {currentLang === "zh"
            ? "未选择筛选条件"
            : "no selected filter characteristics"}
        </Text>
      );
    }

    return (
      <Text>
        {descriptionParts.map((part, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ", "}
            {part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  const pdfFileName = `${patient?.patientid}. ${patient?.fullname} Summary Report.pdf`;

  const renderPDFDocument = () => (
    <Document title={pdfFileName}>
      {/* Page 1: Bar Charts */}
      <Page size="A4" style={styles.page}>
        {currentLang === "en" && patient && (
        <>
          <Table data={patient} currentLang={currentLang} />
          <Text style={styles.instruction}>
            Below are what past patients reported <Text style={styles.bold}>6 months after surgery </Text>
             in the {numPriorities} areas {getName()} hopes to see improvement most. 
            Those patients are similar to {getName()} in {getFilterDescription(filters)},
            and they experienced the same level of problems
            as {getName()} in the {numPriorities} areas before surgery.
          </Text>
        </>
      )}

      {currentLang === "zh" && patient && (
        <>
          <Table data={patient} currentLang={currentLang}/>
          <Text style={styles.instruction}>
            下面是过去的患者在<Text style={styles.bold}>手术后6个月</Text>报告的、在{numPriorities}个不同方面的情况。
            这{numPriorities}个方面是{getName()}最希望看到改善的方面。
            这些患者与{getName()}在{getFilterDescription(filters)}方面相似。
            并且他们手术前在这{numPriorities}方面经历了与{getName()}相同程度的问题。
          </Text>
        </>
      )}


      {barChartData.map((data) => (
        <View key={data.variableQuestion} wrap={false} style={styles.colContainer}>
          <Text style={[styles.title, { textAlign: "center" }]}>
            {data.variableQuestion}
          </Text>
          <View style={styles.row}>
            {/* Only show patient position if there's data */}
            {data.options.length > 0 && data.options[0].label !== "No data available" ? (
              <View
                style={[
                  styles.nameBoxContainer,
                  { marginTop: Number(data.initial) * 16 + 4 },
                ]}
              >
                <Text style={styles.nameBox}>
                  {currentLang === "en" ? (
                    <>
                      <Text style={{ fontWeight: "bold" }}>
                        {patient?.sex ? "Ms. " : "Mr. "}
                        {patient?.fullname}
                      </Text>
                      's{" "}
                    </>
                  ) : currentLang === "zh" ? (
                    <>
                      <Text style={{ fontWeight: "bold" }}>
                        {patient?.fullname}
                        {patient?.sex ? "女士" : "先生"}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ fontWeight: "bold" }}>
                        {patient?.sex ? "Ms. " : "Mr. "}
                        {patient?.fullname}
                      </Text>
                      's{" "}
                    </>
                  )}

                  {currentLang === "en" ? "current level is " : "目前在这里"}{"\n"}

                  <Text style={{ fontWeight: "bold" }}>
                    {data.options[Number(data.initial)]?.label || ""}
                  </Text>
                </Text>
              </View>
            ) : (
              // Empty spacer to maintain layout when no data
              <View style={styles.nameBoxContainer} />
            )}
            
            <View style={styles.chartContainer}>
              {data.options.length > 0 && data.options[0].label !== "No data available" ? (
                <BarChart data={data} lang={currentLang} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}> {currentLang === "en" ? "No similar patients were found" : "未找到相似的患者"}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
      </Page>
          </Document>
        )
  
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PDFDownloadLink
        document={renderPDFDocument()}
        fileName={pdfFileName}
        className="btn btn-primary text-xl max-w-7xl mb-2"
      >
        Download PDF
      </PDFDownloadLink>
      <PDFViewer
        width="100%"
        height="850px"
        style={{ border: "2px solid black", backgroundColor: "white" }}
      >
        {renderPDFDocument()}
      </PDFViewer>
    </div>
  );
};

export default PDFReport;