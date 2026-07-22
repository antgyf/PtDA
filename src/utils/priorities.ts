export const REPORT_REQUIRED_PRIORITY_IDS = [16, 17] as const;
export const MIN_SELECTED_PRIORITIES = 1;
export const MAX_SELECTED_PRIORITIES = 3;

export const isReportRequiredPriority = (questionId: number): boolean =>
  REPORT_REQUIRED_PRIORITY_IDS.some((id) => id === questionId);

export const getUniqueSelectedPriorities = (
  priorities: number[] = []
): number[] => [...new Set(priorities)];

export const normalizeReportPriorities = (priorities: number[] = []): number[] => {
  const selectedPriorities = getUniqueSelectedPriorities(priorities).slice(
    0,
    MAX_SELECTED_PRIORITIES
  );

  return [
    ...selectedPriorities,
    ...REPORT_REQUIRED_PRIORITY_IDS.filter(
      (id) => !selectedPriorities.includes(id)
    ),
  ];
};

export const hasValidPriorityCount = (priorities: number[] = []): boolean => {
  const selectedCount = getUniqueSelectedPriorities(priorities).length;
  return (
    selectedCount >= MIN_SELECTED_PRIORITIES &&
    selectedCount <= MAX_SELECTED_PRIORITIES
  );
};
