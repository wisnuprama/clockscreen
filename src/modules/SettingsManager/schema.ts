export const SettingsSchema = {
  showSeconds: {
    type: "boolean",
    default: false,
    hidden: false,
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
    hidden: false,
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
    default: true,
    hidden: false,
    description: "Display today's date below the time",
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        throw new Error("showTodayDate must be a boolean");
      }
    },
  },
  showIntroduction: {
    type: "boolean",
    default: true,
    hidden: false,
    label: "Show Introduction",
    description: "Display the introduction alert on first launch",
    validate: (value: boolean) => {
      if (typeof value !== "boolean") {
        throw new Error("showIntroduction must be a boolean");
      }
    },
  },
};
