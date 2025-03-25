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