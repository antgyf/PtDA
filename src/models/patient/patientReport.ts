export interface Patient {
  patientid: number;
  fullname: string;
  age: number;
  sex: number;
  ethnicity: number;
  height: number;
  weight: number;
  bmi: number;
  bmicategory: number;
  agegroup: number;
  hasform: boolean;
}

export interface PatientForm {
  patientid: number;
  term: number;
  responses: {
    questionid: number;    // matches Questions[].id
    code: string;          // optional, matches Questions[].code
    answervalue: number;
  }[];
  priorities?: number[];   // optional array of selected questionids
}

export type GraphData = Array<
  | [
      string,
      string,
      { role: "style" },
      {
        role: "annotation";
        type: "string";
      }
    ] // Header row
  | [string, number, string, string]
>;

export type RadarDataPoint = {
  questionid: number;
  initial: number;
  median: number;
  n: number;
  importance: number;
};
