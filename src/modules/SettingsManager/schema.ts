export const SettingsSchema = {
  showSeconds: {
    type: "boolean",
    default: true,
    label: "Show Seconds",
    description: "Display seconds on the clock",
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        throw new Error("showTodayDate must be a boolean");
      }
    },
  },
  is24Hour: {
    label: "24 Hour Format",
    type: "boolean",
    default: false,
    description: "Use 24-hour time format instead of 12-hour",
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        throw new Error("showTodayDate must be a boolean");
      }
    },
  },
  showTodayDate: {
    label: "Show Today's Date",
    type: "boolean",
    default: false,
    description: "Display today's date below the time",
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        throw new Error("showTodayDate must be a boolean");
      }
    },
  },
};
