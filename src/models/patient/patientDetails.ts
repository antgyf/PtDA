export interface AddPatientForm {
  fullname: string;
  sex: string;
  ethnicity: string;
  age: string;
  height?: string;
  weight?: string;
  bmi: string;
  bmicategory: string;
  agegroup: string;
}

export const Sex: Record<string, string> = {
  0: "Male",
  1: "Female",
};

export const SexCh: Record<string, string> = {
  0: "男",
  1: "女",
};

export const Age = {
  0: "Between 21 and 50 years",
  1: "51 years and above",
};

export const Ethnicity: Record<string, string> = {
  0: "Chinese",
  1: "Malay",
  2: "Indian",
};

export const EthnicityCh: Record<string, string> = {
  0: "华人",
  1: "马来人",
  2: "印度人",
};

export const BMI = {
  0: "Normal/Underweight (< 25)",
  1: "Overweight/Obese (>= 25)",
};

export const BMICategory: Record<string, string> = {
  0: "Normal/Underweight (< 25)",
  1: "Overweight/Obese (>= 25)",
};

export type FilterType = {
  age?: { range: number };
  bmi?: { range: number };
  categories: string[];
};

export const Mobility = {
  0: "I have no problems in walking about",
  1: "I have slight problems in walking about",
  2: "I have moderate problems in walking about",
  3: "I have severe problems in walking about",
  4: "I am unable to walk",
};

export const SelfCare = {
  0: "I have no problems in washing or dressing myself",
  1: "I have slight problems in washing or dressing myself",
  2: "I have moderate problems in washing or dressing myself",
  3: "I have severe problems in washing or dressing myself",
  4: "I am unable to wash or dress myself",
};

export const UsualActivities = {
  0: "I have no problems in doing my usual activities",
  1: "I have slight problems in doing my usual activities",
  2: "I have moderate problems in doing my usual activities",
  3: "I have severe problems in doing my usual activities",
  4: "I am unable to do my usual activities",
};

export const PainDiscomfort = {
  0: "I have no pain or discomfort",
  1: "I have slight pain or discomfort",
  2: "I have moderate pain or discomfort",
  3: "I have severe pain or discomfort",
  4: "I have extreme pain or discomfort",
};

export const AnxietyDepression = {
  0: "I am not anxious or depressed",
  1: "I am slightly anxious or depressed",
  2: "I am moderately anxious or depressed",
  3: "I am severely anxious or depressed",
  4: "I am extremely anxious or depressed",
};

export const MobilityCh = {
  0: "我四处走动没有困难",
  1: "我四处走动有一点困难",
  2: "我四处走动有中度的困难",
  3: "我四处走动有严重的困难",
  4: "我无法四处走动"
};

export const SelfCareCh = {
  0: "我自己洗澡或穿衣没有困难",
  1: "我自己洗澡或穿衣有一点困难",
  2: "我自己洗澡或穿衣有中度的困难",
  3: "我自己洗澡或穿衣有严重的困难",
  4: "我无法自己洗澡或穿衣"
};

export const UsualActivitiesCh = {
  0: "我进行日常活动没有困难",
  1: "我进行日常活动有一点困难",
  2: "我进行日常活动有中度的困难",
  3: "我进行日常活动有严重的困难",
  4: "我无法进行日常活动"
};

export const PainDiscomfortCh = {
  0: "我没有疼痛或不舒服",
  1: "我有一点疼痛或不舒服",
  2: "我有中度的疼痛或不舒服",
  3: "我有严重的疼痛或不舒服",
  4: "我有非常严重的疼痛或不舒服"
};

export const AnxietyDepressionCh = {
  0: "我没有焦虑或沮丧",
  1: "我有一点焦虑或沮丧",
  2: "我有中度的焦虑或沮丧",
  3: "我有严重的焦虑或沮丧",
  4: "我有非常严重的焦虑或沮丧"
};

export const Breathing = {
  0: "I have no breathing problems",
  1: "I have slight breathing problems",
  2: "I have moderate breathing problems",
  3: "I have severe breathing problems",
  4: "I have extreme breathing problems"
};

export const Sleep = {
  0: "I have no problems sleeping",
  1: "I have slight problems sleeping",
  2: "I have moderate problems sleeping",
  3: "I have severe problems sleeping",
  4: "I have extreme problems sleeping"
};

export const Tiredness = {
  0: "I am not tired",
  1: "I am slightly tired",
  2: "I am moderately tired",
  3: "I am severely tired",
  4: "I am extremely tired"
};

export const PhysicalAppearance = {
  0: "I have no problems accepting my physical appearance",
  1: "I have slight problems accepting my physical appearance",
  2: "I have moderate problems accepting my physical appearance",
  3: "I have severe problems accepting my physical appearance",
  4: "I have extreme problems accepting my physical appearance"
};

export const IntimateRelationship = {
  0: "I have no problems building or keeping an intimate relationship",
  1: "I have slight problems building or keeping an intimate relationship",
  2: "I have moderate problems building or keeping an intimate relationship",
  3: "I have severe problems building or keeping an intimate relationship",
  4: "I have extreme problems building or keeping an intimate relationship"
};

export const DiscriminationHumiliation = {
  0: "I am not discriminated or humiliated",
  1: "I am slightly discriminated or humiliated",
  2: "I am moderately discriminated or humiliated",
  3: "I am severely discriminated or humiliated",
  4: "I am extremely discriminated or humiliated"
};

export const SocialActivities = {
  0: "I have no problems participating in social activities",
  1: "I have slight problems participating in social activities",
  2: "I have moderate problems participating in social activities",
  3: "I have severe problems participating in social activities",
  4: "I have extreme problems participating in social activities"
};

export const SelfConfidence = {
  0: "I am confident about myself",
  1: "I am slightly unconfident about myself",
  2: "I am moderately unconfident about myself",
  3: "I am very unconfident about myself",
  4: "I am extremely unconfident about myself"
};

export const BurdenToOthers = {
  0: "I do not burden others",
  1: "I slightly burden others",
  2: "I moderately burden others",
  3: "I severely burden others",
  4: "I extremely burden others"
};

export const DietControl = {
  0: "I have no problems with diet control",
  1: "I have slight problems with diet control",
  2: "I have moderate problems with diet control",
  3: "I have severe problems with diet control",
  4: "I have extreme problems with diet control"
};

export const FoodEnjoyment = {
  0: "I have no problems enjoying food",
  1: "I have slight problems enjoying food",
  2: "I have moderate problems enjoying food",
  3: "I have severe problems enjoying food",
  4: "I have extreme problems enjoying food"
};

export const GastrointestinalProblems = {
  0: "I have no gastrointestinal problems",
  1: "I have slight gastrointestinal problems",
  2: "I have moderate gastrointestinal problems",
  3: "I have severe gastrointestinal problems",
  4: "I have extreme gastrointestinal problems"
};

export const BreathingCh = {
  0: "我呼吸没有问题",
  1: "我呼吸稍微有点问题",
  2: "我呼吸有些问题",
  3: "我呼吸有严重的问题",
  4: "我呼吸有非常严重的问题"
};

export const SleepCh = {
  0: "我的睡眠没有问题",
  1: "我的睡眠稍微有点问题",
  2: "我的睡眠有些问题",
  3: "我的睡眠有严重的问题",
  4: "我的睡眠有非常严重的问题"
};

export const TirednessCh = {
  0: "我不疲劳",
  1: "我稍微有点疲劳",
  2: "我有些疲劳",
  3: "我非常疲劳",
  4: "我极度疲劳"
};

export const PhysicalAppearanceCh = {
  0: "我能接受我的外貌",
  1: "我稍微有点难以接受我的外貌",
  2: "我有些难以接受我的外貌",
  3: "我很难接受我的外貌",
  4: "我极难接受我的外貌"
};

export const IntimateRelationshipCh = {
  0: "我在开始或维持亲密关系方面没有问题",
  1: "我在开始或维持亲密关系方面稍微有点问题",
  2: "我在开始或维持亲密关系方面有些问题",
  3: "我在开始或维持亲密关系方面有严重的问题",
  4: "我在开始或维持亲密关系方面有非常严重的问题"
};

export const DiscriminationHumiliationCh = {
  0: "我没有受到歧视或侮辱",
  1: "我稍微有点受到歧视或侮辱",
  2: "我有些受到歧视或侮辱",
  3: "我严重受到歧视或侮辱",
  4: "我极度受到歧视或侮辱"
};

export const SocialActivitiesCh = {
  0: "我参加社交活动没有困难",
  1: "我参加社交活动稍微有点困难",
  2: "我参加社交活动有些困难",
  3: "我参加社交活动有严重的困难",
  4: "我参加社交活动有非常严重的困难"
};

export const SelfConfidenceCh = {
  0: "我有自信",
  1: "我稍微有点不自信",
  2: "我有些不自信",
  3: "我非常不自信",
  4: "我极度不自信"
};

export const BurdenToOthersCh = {
  0: "我没有给别人带来负担",
  1: "我给别人带来轻微的负担",
  2: "我给别人带来一些负担",
  3: "我给别人带来严重的负担",
  4: "我给别人带来非常严重的负担"
};

export const DietControlCh = {
  0: "我能控制饮食",
  1: "我稍微有点难以控制饮食",
  2: "我有些难以控制饮食",
  3: "我很难控制饮食",
  4: "我极难控制饮食"
};

export const FoodEnjoymentCh = {
  0: "我能享受食物",
  1: "我稍微有点难以享受食物",
  2: "我有些难以享受食物",
  3: "我很难享受食物",
  4: "我极难享受食物"
};

export const GastrointestinalProblemsCh = {
  0: "我的肠胃没有问题",
  1: "我的肠胃稍微有点问题",
  2: "我的肠胃有些问题",
  3: "我的肠胃有严重的问题",
  4: "我的肠胃有非常严重的问题"
};

export const OtherOptions = {
  0: "None",
  1: "Slight",
  2: "Moderate",
  3: "Severe",
  4: "Extreme",
};

export const TopFiveAreas = {
  0: "Mobility",
  1: "Self-care",
  2: "Usual Activities",
  3: "Pain/Discomfort",
  4: "Anxiety/Depression",
};

export const AllOptions = [
  "EQ5D-MOB",   // Mobility
  "EQ5D-SC",    // Self-care
  "EQ5D-UA",    // Usual activities
  "EQ5D-PD",    // Pain/discomfort
  "EQ5D-AD",    // Anxiety/depression
  "BO-BREATHING",
  "BO-SLEEP",
  "BO-TIREDNESS",
  "BO-APPEARANCE",
  "BO-ROMANTIC-INTIMATE",
  "BO-DISCRIMINATE-HUMIL",
  "BO-SOCIAL-ACTIVITIES",
  "BO-CONFIDENCE",
  "BO-BURDEN-OTHERS",
  "BO-DIET-CONTROL",
  "BO-FOOD-ENJOYMENT",
  "BO-GI-PROBLEMS"
] as const; // Use `as const` to make the array readonly and infer literal types

export type AllOptionsType = (typeof AllOptions)[number]; // Create a union type from the array

// Human-readable names (labels for UI)
export const AllOptionNames = [
  "EQ-5D: Mobility",
  "EQ-5D: Self-care",
  "EQ-5D: Usual activities",
  "EQ-5D: Pain/discomfort",
  "EQ-5D: Anxiety/depression",
  "Breathing problems (e.g. shortness of breath, wheezing, coughing, sputum)",
  "Sleep",
  "Tiredness",
  "Physical Appearance (e.g. overall appearance, body shape, skin, etc...)",
  "Building or keeping intimate relationships (including sexual relationship)",
  "Discrimination / Humiliation",
  "Social Activities (e.g. meeting, eating, or doing work with others)",
  "Self-confidence",
  "Burden to Others",
  "Diet Control (e.g. control food portion and type of food)",
  "Food Enjoyment",
  "Gastrointestinal Problems (e.g. nausea, vomiting, heartburn, bloating, gases, diarrhoea, constipation)",
] as const;

export type AllOptionNamesType = (typeof AllOptionNames)[number];

// Question type
export type QuestionType = {
  id: number;
  code: AllOptionsType;    // match DB code
  question: string;        // display text
  list: Record<number, string>; // Likert or option scale
  description: string;  // optional description
  chQuestion: string;
  chineseDescription: string;
  chList: Record<number, string>; // Likert or option scale in Chinese
};

// Actual questions list aligned with DB
export const Questions: QuestionType[] = [
  { id: 1, code: "EQ5D-MOB", question: "Did you have problems in walking about today?", list: Mobility, description: "Problems in walking", chQuestion: "我四处走动没有困难", chineseDescription: "行走问题", chList: MobilityCh },
  { id: 2, code: "EQ5D-SC", question: "Did you have problems in washing or dressing yourself today?", list: SelfCare, description: "Problems washing or dressing yourself", chQuestion: "我自己洗澡或穿衣没有困难", chineseDescription: "洗澡或穿衣的问题", chList: SelfCareCh },
  { id: 3, code: "EQ5D-UA", question: "Did you have problems in doing your usual activities today? (e.g. work, study, housework, family or leisure activities)", list: UsualActivities, description: "Problems doing your usual activities (e.g. work, study, housework, family or leisure activities)", chQuestion: "我进行日常活动没有困难", chineseDescription: "日常活动的问题", chList: UsualActivitiesCh },
  { id: 4, code: "EQ5D-PD", question: "Did you have any pain/discomfort today?", list: PainDiscomfort, description: "Pain/discomfort level", chQuestion: "我没有疼痛或不舒服", chineseDescription: "疼痛/不适程度", chList: PainDiscomfortCh },
  { id: 5, code: "EQ5D-AD", question: "Do you feel anxious/depressed today?", list: AnxietyDepression, description: "Anxiety/depression level", chQuestion: "我没有焦虑或沮丧", chineseDescription: "焦虑/抑郁程度", chList: AnxietyDepressionCh }, 
  { id: 6, code: "BO-BREATHING", question: "Did you experience any breathing problems today? (e.g. shortness of breath, wheezing, coughing, sputum)", list: Breathing, description: "Breathing problems", chQuestion: "今天您有呼吸问题吗？（例如呼吸急促、喘息、咳嗽、痰多等）", chineseDescription: "呼吸问题", chList: BreathingCh },
  { id: 7, code: "BO-SLEEP", question: "Did you have problems sleeping today?", list: Sleep, description: "Sleeping problems", chQuestion: "今天您有睡眠问题吗？", chineseDescription: "睡眠问题", chList: SleepCh },
  { id: 8, code: "BO-TIREDNESS", question: "Did you feel tired today?", list: Tiredness, description: "Tiredness level", chQuestion: "今天您感到疲劳吗？", chineseDescription: "疲劳程度", chList: TirednessCh },
  { id: 9, code: "BO-APPEARANCE", question: "Did you have any problems accepting your physical appearance today?", list: PhysicalAppearance, description: "Acceptance of physical appearance", chQuestion: "今天您能接受自己的外貌吗？", chineseDescription: "外貌接受度", chList: PhysicalAppearanceCh },
  { id: 10, code: "BO-ROMANTIC-INTIMATE", question: "Did you have any problems building or keeping an intimate relationship today?", list: IntimateRelationship, description: "Intimate relationship issues", chQuestion: "今天您在建立或维持亲密关系方面有问题吗？", chineseDescription: "亲密关系问题", chList: IntimateRelationshipCh },
  { id: 11, code: "BO-DISCRIMINATE-HUMIL", question: "Did you experience discrimination or humiliation today?", list: DiscriminationHumiliation, description: "Discrimination or humiliation", chQuestion: "今天您有受到歧视或侮辱吗？", chineseDescription: "歧视或侮辱", chList:  DiscriminationHumiliationCh },
  { id: 12, code: "BO-SOCIAL-ACTIVITIES", question: "Did you have any problems participating in social activities today?", list: SocialActivities, description: "Social activity participation", chQuestion: "今天您参加社交活动有问题吗？", chineseDescription: "社交活动问题", chList: SocialActivitiesCh },
  { id: 13, code: "BO-CONFIDENCE", question: "Did you feel confident about yourself today?", list: SelfConfidence, description: "Self-confidence level", chQuestion: "今天您对自己有信心吗？", chineseDescription: "自信程度", chList: SelfConfidenceCh },
  { id: 14, code: "BO-BURDEN-OTHERS", question: "Did you feel you were a burden to others today?", list: BurdenToOthers, description: "Burden to others", chQuestion: "今天您觉得自己对别人是负担吗？", chineseDescription: "给他人带来的负担", chList: BurdenToOthersCh },
  { id: 15, code: "BO-DIET-CONTROL", question: "Did you have any problems with controlling your diet today?", list: DietControl, description: "Diet control issues", chQuestion: "今天您在控制饮食方面有问题吗？", chineseDescription: "饮食控制问题", chList: DietControlCh },
  { id: 16, code: "BO-FOOD-ENJOYMENT", question: "Did you enjoy food today?", list: FoodEnjoyment, description: "Food enjoyment", chQuestion: "今天您享受食物吗？", chineseDescription: "食物享受", chList: FoodEnjoymentCh },
  { id: 17, code: "BO-GI-PROBLEMS", question: "Did you experience any gastrointestinal problems today? (e.g. nausea, vomiting, heartburn, bloating, gases, diarrhea, constipation)", list: GastrointestinalProblems, description: "Gastrointestinal problems", chQuestion: "今天您有肠胃问题吗？（例如恶心、呕吐、胃灼热、胀气、腹泻、便秘等）", chineseDescription: "肠胃问题", chList: GastrointestinalProblemsCh }
];

export type BarChartData = {
  title: string;
  questionid: number;
  variableQuestion: string | undefined;
  initial: number;
  options: {
    label: string;
    percentageText: string;
    percent: number;
  }[];
};

export type QuestionData = {
  totalRows: number;
  questionid: number;
  data: {
    option: `${keyof typeof OtherOptions}`;
    count: string;
    percentage: number;
  }[];
};
