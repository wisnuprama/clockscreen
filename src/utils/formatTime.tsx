export const formatTime = (
  date: Date,
  options: { showSeconds: boolean; is24Hour: boolean; }
) => {
  const showSeconds = options?.showSeconds ?? true;
  const is24Hour = options?.is24Hour ?? true;

  if (!is24Hour) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");

    if (!showSeconds) {
      return `${strHours}:${minutes}${ampm}`;
    }

    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${strHours}:${minutes}:${seconds}${ampm}`;
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (!showSeconds) {
    return `${hours}:${minutes}`;
  }

  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
