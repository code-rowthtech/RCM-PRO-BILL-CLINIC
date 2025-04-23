export const verificationStatus = [
    {
      code: "error",
      display: "error",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The resource was created in error, and should not be treated as valid (note: in many cases, for various data integrity related reasons, the information cannot be removed from the record)",
    },
    {
      code: "proposed",
      display: "proposed",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The resource describes an action or plan that is proposed, and not yet approved by the participants",
    },
    {
      code: "planned",
      display: "planned",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The resource describes a course of action that is planned and agreed/approved, but at the time of recording was still future",
    },
    {
      code: "draft",
      display: "draft",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The information in the resource is still being prepared and edited",
    },
    {
      code: "requested",
      display: "requested",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "A fulfiller has been asked to perform this action, but it has not yet occurred",
    },
    {
      code: "received",
      display: "received",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The fulfiller has received the request, but not yet agreed to carry out the action",
    },
    {
      code: "declined",
      display: "declined",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The fulfiller chose not to perform the action",
    },
    {
      code: "accepted",
      display: "accepted",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The fulfiller has decided to perform the action, and plans are in train to do this in the future",
    },
    {
      code: "arrived",
      display: "arrived",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The pre-conditions for the action are all fulfilled, and it is imminent",
    },
    {
      code: "active",
      display: "active",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The resource describes information that is currently valid or a process that is presently occuring",
    },
    {
      code: "suspended",
      display: "suspended",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The process described/requested in this resource has been halted for some reason",
    },
    {
      code: "replaced",
      display: "replaced",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The information in this resource has been replaced by information in another resource",
    },
    {
      code: "ended",
      display: "ended",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The process described/requested has reached a state where no further action is planned",
    },
    {
      code: "complete",
      display: "complete",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The process described/requested in the resource has been completed, and no further action is planned",
    },
    {
      code: "failed",
      display: "failed",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The process described/requested in the resource could not be completed, and no further action is planned",
    },
    {
      code: "abandoned",
      display: "abandoned",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The process described/requested in the resource did not complete - usually due to some workflow error, and no further action is planned",
    },
    {
      code: "inactive",
      display: "inactive",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "The resource describes information that is no longer valid or a process that is stopped occurring",
    },
    {
      code: "unknown",
      display: "unknown",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Authoring system does not know the status",
    },
    {
      code: "unconfirmed",
      display: "unconfirmed",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The information in this resource is not yet approved",
    },
    {
      code: "confirmed",
      display: "confirmed",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The information in this resource is approved",
    },
    {
      code: "resolved",
      display: "resolved",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The issue identified by this resource is no longer of concern",
    },
    {
      code: "refuted",
      display: "refuted",
      system: "http://hl7.org/fhir/resource-status",
      definition:
        "This information has been ruled out by testing and evaluation",
    },
    {
      code: "differential",
      display: "differential",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Potentially true?",
    },
    {
      code: "partial",
      display: "partial",
      system: "http://hl7.org/fhir/resource-status",
      definition: "This information is still being assembled",
    },
    {
      code: "busy-unavailable",
      display: "busy-unavailable",
      system: "http://hl7.org/fhir/resource-status",
      definition: "not available at this time/location",
    },
    {
      code: "free",
      display: "free",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Free for scheduling",
    },
    {
      code: "on-target",
      display: "on-target",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Ready to act",
    },
    {
      code: "ahead-of-target",
      display: "ahead-of-target",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Ahead of the planned timelines",
    },
    {
      code: "behind-target",
      display: "behind-target",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Behind the planned timelines",
    },
    {
      code: "not-ready",
      display: "not-ready",
      system: "http://hl7.org/fhir/resource-status",
      definition: "Not ready to act",
    },
    {
      code: "transduc-discon",
      display: "transduc-discon",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The device transducer is disconnected",
    },
    {
      code: "hw-discon",
      display: "hw-discon",
      system: "http://hl7.org/fhir/resource-status",
      definition: "The hardware is disconnected",
    }
  ];
  