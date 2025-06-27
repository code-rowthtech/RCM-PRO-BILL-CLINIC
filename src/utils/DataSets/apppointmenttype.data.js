export const appointmentTypeOptions = [
  {
    show: "Routine",
    value: "ROUTINE",
    label: "Routine appointment - default if not valued",
    system: "http://terminology.hl7.org/CodeSystem/v2-0276",
  },
  {
    show: "Walk-in",
    value: "WALKIN",
    label: "A previously unscheduled walk-in visit",
    system: "http://terminology.hl7.org/CodeSystem/v2-0276",
  },
  {
    show: "Check-up",
    value: "CHECKUP",
    label: "A routine check-up, such as an annual physical",
    system: "http://terminology.hl7.org/CodeSystem/v2-0276",
  },
  {
    show: "Follow-up",
    value: "FOLLOWUP",
    label: "A follow-up visit from a previous appointment",
    system: "http://terminology.hl7.org/CodeSystem/v2-0276",
  },
  {
    show: "Emergency",
    value: "EMERGENCY",
    label: "Emergency appointment",
    system: "http://terminology.hl7.org/CodeSystem/v2-0276",
  },
];

export const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)", show: "ET" },
  { value: "America/Chicago", label: "Central Time (US & Canada)", show: "CT" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)", show: "MT" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", show: "PT" },
  { value: "America/Anchorage", label: "Alaska Time", show: "AT" },
  { value: "Pacific/Honolulu", label: "Hawaii Time", show: "HT" }
];