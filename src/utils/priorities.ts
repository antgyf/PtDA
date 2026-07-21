export const MANDATORY_PRIORITY_IDS = [16, 17] as const;
export const MIN_ADDITIONAL_PRIORITIES = 1;
export const MAX_ADDITIONAL_PRIORITIES = 3;

export const isMandatoryPriority = (questionId: number): boolean =>
  MANDATORY_PRIORITY_IDS.some((id) => id === questionId);

export const getAdditionalPriorities = (priorities: number[] = []): number[] =>
  [...new Set(priorities)].filter((id) => !isMandatoryPriority(id));

export const normalizeReportPriorities = (priorities: number[] = []): number[] => [
  ...MANDATORY_PRIORITY_IDS,
  ...getAdditionalPriorities(priorities).slice(0, MAX_ADDITIONAL_PRIORITIES),
];

export const hasValidAdditionalPriorityCount = (
  priorities: number[] = []
): boolean => {
  const additionalCount = getAdditionalPriorities(priorities).length;
  return (
    additionalCount >= MIN_ADDITIONAL_PRIORITIES &&
    additionalCount <= MAX_ADDITIONAL_PRIORITIES
  );
};
