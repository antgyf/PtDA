export const MIN_SELECTED_PRIORITIES = 1;
export const MAX_SELECTED_PRIORITIES = 3;

const MAX_QUESTION_ID = 17;

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

  if (
    priorities.length < MIN_SELECTED_PRIORITIES ||
    priorities.length > MAX_SELECTED_PRIORITIES
  ) {
    return "Select between 1 and 3 priorities.";
  }

  return null;
};
