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
  0: "Below 50 years",
  1: "50 years and above",
};

export const Ethnicity: Record<string, string> = {
  0: "Chinese",
  1: "Malay",
  2: "Indian/Others",
};

export const EthnicityCh: Record<string, string> = {
  0: "华人",
  1: "马来人",
  2: "印度人/其他人",
};

export const EthnicityFilter: Record<string, string> = {
  0: "Chinese",
  1: "Non-Chinese",
};

export const EthnicityFilterCh: Record<string, string> = {
  0: "华人",
  1: "非华人",
};

export const BMIFilter: Record<string, string> = {
  0: "32.5-37.4",
  1: "37.5+",
};

export const BMICategory: Record<string, string> = {
  0: "Low CVD Risk (<23.0)",
  1: "Moderate CVD Risk (23.0 - 27.4)",
  2: "High CVD Risk (27.5 - 32.4)",
  3: "Very high CVD Risk (32.5 - 37.4)",
  4: "Very very high CVD Risk (37.5+)"
};

export type FilterType = {
  age?: 0 | 1;
  bmi?: 0 | 1;
  sex?: 0 | 1;
  ethnicity?: 0 | 1;

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
  {
    id: 1,
    code: "EQ5D-MOB",
    question: "Mobility",
    list: Mobility,
    description: "Mobility",
    chQuestion: "行动能力",
    chineseDescription: "行动能力",
    chList: MobilityCh,
  },
  {
    id: 2,
    code: "EQ5D-SC",
    question: "Self-Care",
    list: SelfCare,
    description: "Self-Care",
    chQuestion: "自我照顾",
    chineseDescription: "自我照顾",
    chList: SelfCareCh,
  },
  {
    id: 3,
    code: "EQ5D-UA",
    question: "Usual Activities",
    list: UsualActivities,
    description: "Usual Activities",
    chQuestion: "日常活动（如工作、学习、家务、家庭或休闲活动）",
    chineseDescription: "日常活动（如工作、学习、家务、家庭或休闲活动）",
    chList: UsualActivitiesCh,
  },
  {
    id: 4,
    code: "EQ5D-PD",
    question: "Pain/Discomfort",
    list: PainDiscomfort,
    description: "Pain/Discomfort",
    chQuestion: "疼痛或不舒服",
    chineseDescription: "疼痛或不舒服",
    chList: PainDiscomfortCh,
  },
  {
    id: 5,
    code: "EQ5D-AD",
    question: "Anxiety/Depression",
    list: AnxietyDepression,
    description: "Anxiety/Depression",
    chQuestion: "焦虑或沮丧",
    chineseDescription: "焦虑或沮丧",
    chList: AnxietyDepressionCh,
  },
  {
    id: 6,
    code: "BO-BREATHING",
    question: "Breathing Problems (e.g. shortness of breath, wheezing, coughing, sputum)",
    list: Breathing,
    description: "Breathing Problems (e.g. shortness of breath, wheezing, coughing, sputum)",
    chQuestion: "呼吸问题（例如呼吸急促、喘息、咳嗽、有痰）",
    chineseDescription: "呼吸问题（例如呼吸急促、喘息、咳嗽、有痰）",
    chList: BreathingCh,
  },
  {
    id: 7,
    code: "BO-SLEEP",
    question: "Sleep",
    list: Sleep,
    description: "Sleep",
    chQuestion: "睡眠",
    chineseDescription: "睡眠",
    chList: SleepCh,
  },
  {
    id: 8,
    code: "BO-TIREDNESS",
    question: "Tiredness",
    list: Tiredness,
    description: "Tiredness",
    chQuestion: "疲劳",
    chineseDescription: "疲劳",
    chList: TirednessCh,
  },
  {
    id: 9,
    code: "BO-APPEARANCE",
    question: "Physical Appearance (e.g. overall appearance, body shape, skin, etc...)",
    list: PhysicalAppearance,
    description: "Physical Appearance (e.g. overall appearance, body shape, skin, etc...)",
    chQuestion: "外貌（例如总体外貌、身材、皮肤等…）",
    chineseDescription: "外貌（例如总体外貌、身材、皮肤等…）",
    chList: PhysicalAppearanceCh,
  },
  {
    id: 10,
    code: "BO-ROMANTIC-INTIMATE",
    question: "Building or keeping intimate relationship (Including sexual relationship)",
    list: IntimateRelationship,
    description: "Building or keeping intimate relationship (Including sexual relationship)",
    chQuestion: "开始或维持亲密关系（包括性关系）",
    chineseDescription: "开始或维持亲密关系（包括性关系）",
    chList: IntimateRelationshipCh,
  },
  {
    id: 11,
    code: "BO-DISCRIMINATE-HUMIL",
    question: "Discrimination/Humiliation",
    list: DiscriminationHumiliation,
    description: "Discrimination/Humiliation",
    chQuestion: "歧视或侮辱",
    chineseDescription: "歧视或侮辱",
    chList: DiscriminationHumiliationCh,
  },
  {
    id: 12,
    code: "BO-SOCIAL-ACTIVITIES",
    question: "Social Activities (e.g. meeting, eating, or doing work with others)",
    list: SocialActivities,
    description: "Social Activities (e.g. meeting, eating, or doing work with others)",
    chQuestion: "社交活动（例如与他人见面、一起吃饭或做事情）",
    chineseDescription: "社交活动（例如与他人见面、一起吃饭或做事情）",
    chList: SocialActivitiesCh,
  },
  {
    id: 13,
    code: "BO-CONFIDENCE",
    question: "Self-Confidence",
    list: SelfConfidence,
    description: "Self-Confidence",
    chQuestion: "自信",
    chineseDescription: "自信",
    chList: SelfConfidenceCh,
  },
  {
    id: 14,
    code: "BO-BURDEN-OTHERS",
    question: "Burden to Others",
    list: BurdenToOthers,
    description: "Burden to Others",
    chQuestion: "给别人造成负担",
    chineseDescription: "给别人造成负担",
    chList: BurdenToOthersCh,
  },
  {
    id: 15,
    code: "BO-DIET-CONTROL",
    question: "Diet Control (e.g. control food portion and type of food)",
    list: DietControl,
    description: "Diet Control (e.g. control food portion and type of food)",
    chQuestion: "饮食控制（例如控制食物的分量及选择食物）",
    chineseDescription: "饮食控制（例如控制食物的分量及选择食物）",
    chList: DietControlCh,
  },
  {
    id: 16,
    code: "BO-FOOD-ENJOYMENT",
    question: "Food Enjoyment",
    list: FoodEnjoyment,
    description: "Food Enjoyment",
    chQuestion: "享受食物",
    chineseDescription: "享受食物",
    chList: FoodEnjoymentCh,
  },
  {
    id: 17,
    code: "BO-GI-PROBLEMS",
    question: "Gastrointestinal Problems (e.g. nausea, vomiting, heartburn, bloating, gases, diarrhea, constipation)",
    list: GastrointestinalProblems,
    description: "Gastrointestinal Problems (e.g. nausea, vomiting, heartburn, bloating, gases, diarrhea, constipation)",
    chQuestion: "肠胃问题（例如恶心、呕吐、胃灼热、胀气、腹泻、便秘）",
    chineseDescription: "肠胃问题（例如恶心、呕吐、胃灼热、胀气、腹泻、便秘）",
    chList: GastrointestinalProblemsCh,
  },
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

export function getOptionDescription(
  questionNumber: number,
  selectedOption: number,
): string {
  const question = Questions.find((q) => q.id === questionNumber);

  if (!question) {
    return `currently has an unknown response.`;
  }

  const selectedText = question.list[selectedOption];

  if (!selectedText) {
    return `currently has an invalid response for ${question.description}.`;
  }

  const issueMap: Record<number, string> = {
    1: "mobility",
    2: "self-care",
    3: "usual activities",
    4: "pain/discomfort",
    5: "anxiety/depression",
    6: "breathing",
    7: "sleep",
    8: "tiredness",
    9: "physical appearance",
    10: "building or keeping intimate relationships",
    11: "discrimination/humiliation",
    12: "social activities",
    13: "self-confidence",
    14: "feeling like a burden to others",
    15: "diet control",
    16: "food enjoyment",
    17: "gastrointestinal problems",
  };

  const issue = issueMap[questionNumber] ?? question.description.toLowerCase();

  const text = selectedText.toLowerCase();

  if (
    text.includes("no problems") ||
    text.includes("no pain") ||
    text.includes("not anxious") ||
    text.includes("not tired") ||
    text.includes("confident about myself") ||
    text.includes("do not burden")
  ) {
    return `currently has no problems with ${issue}.`;
  }

  if (text.includes("slight") || text.includes("slightly")) {
    return `currently has slight problems with ${issue}.`;
  }

  if (text.includes("moderate") || text.includes("moderately")) {
    return `currently has moderate problems with ${issue}.`;
  }

  if (text.includes("severe") || text.includes("severely") || text.includes("very unconfident")) {
    return `currently has severe problems with ${issue}.`;
  }

  if (text.includes("extreme") || text.includes("extremely") || text.includes("unable")) {
    return `currently has extreme problems with ${issue}.`;
  }

  return `currently has an unknown level of problems with ${issue}.`;
}

export function getOptionDescriptionCh(
  questionNumber: number,
  selectedOption: number,
): string {
  const question = Questions.find((q) => q.id === questionNumber);

  if (!question) {
    return `目前有未知的回答。`;
  }

  const selectedText = question.chList[selectedOption];

  if (!selectedText) {
    return `目前在${question.chineseDescription}方面有无效的回答。`;
  }

  // Converts first-person questionnaire answer into third-person style sentence
  // Example: "我进行日常活动有中度的困难" → "目前进行日常活动有中度的困难。"
  const formattedText = selectedText
    .replace(/^我的/, "")
    .replace(/^我自己/, "自己")
    .replace(/^我/, "");

  return `目前${formattedText}。`;
}

export const wrapChineseText = (text: string): string => {
  return text.replace(/([\u4e00-\u9fff])/g, "$1\u200B");
};