export const MANDATORY_PRIORITY_IDS = [16, 17] as const;
export const MIN_ADDITIONAL_PRIORITIES = 1;
export const MAX_ADDITIONAL_PRIORITIES = 3;

const MAX_QUESTION_ID = 17;

export const isMandatoryPriority = (questionId: number): boolean =>
  MANDATORY_PRIORITY_IDS.some((id) => id === questionId);

export const normalizeStoredPriorities = (priorities: number[]): number[] => [
  ...MANDATORY_PRIORITY_IDS,
  ...[...new Set(priorities)]
    .filter((id) => !isMandatoryPriority(id))
    .slice(0, MAX_ADDITIONAL_PRIORITIES),
];

export const getPriorityValidationError = (
  priorities: unknown
): string | null => {
  if (!Array.isArray(priorities)) {
    return "Priorities must be provided as an array.";
  }

  if (
    priorities.some(
      (id: unknown) =>
        !Number.isInteger(id) ||
        Number(id) < 1 ||
        Number(id) > MAX_QUESTION_ID
    )
  ) {
    return "Priorities contain an invalid question ID.";
  }

  if (new Set(priorities).size !== priorities.length) {
    return "Duplicate priorities are not allowed.";
  }

  if (MANDATORY_PRIORITY_IDS.some((id) => !priorities.includes(id))) {
    return "Food Enjoyment and Gastrointestinal Problems are required priorities.";
  }

  const additionalCount = priorities.filter(
    (id: number) => !isMandatoryPriority(id)
  ).length;
  if (
    additionalCount < MIN_ADDITIONAL_PRIORITIES ||
    additionalCount > MAX_ADDITIONAL_PRIORITIES
  ) {
    return "Select between 1 and 3 additional priorities.";
  }

  return null;
};
