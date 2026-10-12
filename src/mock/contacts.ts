/**
 * DEMO / CONFIGURED CONTACTS ONLY.
 * Replace phoneNumber values with real, authorized response-team
 * numbers for your district before any real deployment. These are
 * placeholder numbers for prototype/demo purposes.
 */
import { EmergencyContact } from "@/types";

export const MOCK_CONTACTS: EmergencyContact[] = [
  {
    id: "district-response",
    name: "District response",
    subtitle: "Disaster management cell",
    icon: "🏛️",
    phoneNumber: "1070", // demo placeholder — Uttarakhand SDMA-style helpline format
  },
  {
    id: "emergency-services",
    name: "Emergency services",
    subtitle: "Police · Fire · Ambulance",
    icon: "🚑",
    phoneNumber: "112", // India pan-emergency number
  },
  {
    id: "local-response-team",
    name: "Local response team",
    subtitle: "Field support unit",
    icon: "📡",
    phoneNumber: "1077", // demo placeholder — district control room format
  },
];
