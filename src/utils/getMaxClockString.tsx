export const getMaxClockString = (options: {
  showSeconds: boolean;
  is24Hour: boolean;
}) => {
  const { showSeconds, is24Hour } = options;

  if (!is24Hour) {
    return showSeconds ? "12:59:59PM" : "12:59PM";
  }

  return showSeconds ? "23:59:59" : "23:59";
};
