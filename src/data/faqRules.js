/**
 * FAQ Rules Database for Blood Donation Queries
 * Rule-based responses for common blood donation questions
 */

export const faqRules = [
  // ============ ELIGIBILITY QUESTIONS ============
  {
    id: "eligibility_age",
    keywords: ["age", "old", "minimum age", "can i donate", "too young", "too old"],
    minKeywords: 1,
    response:
      "To donate blood, you must be between 18-65 years old and weigh at least 50 kg (110 lbs). Some countries allow 17-year-olds with parental consent. Do you meet these requirements?",
    category: "eligibility",
  },
  {
    id: "eligibility_weight",
    keywords: ["weight", "kg", "lbs", "heavy", "light", "minimum weight"],
    minKeywords: 1,
    response:
      "You must weigh at least 50 kg (110 lbs) to donate blood safely. This ensures you have enough blood volume for the donation. What's your current weight?",
    category: "eligibility",
  },
  {
    id: "eligibility_health",
    keywords: ["healthy", "health condition", "disease", "sick", "medical condition", "illness"],
    minKeywords: 1,
    response:
      "You must be in good health to donate. Certain chronic conditions may disqualify you. Please consult with a blood bank staff member about your specific health condition. They'll guide you better.",
    category: "eligibility",
  },

  // ============ DONATION INTERVAL ============
  {
    id: "donation_interval",
    keywords: ["how often", "interval", "days between", "frequency", "again", "next donation"],
    minKeywords: 1,
    response:
      "For whole blood donation: Wait 90 days (3 months) between donations. Platelet donations can be done every 2 weeks, and plasma every 2 weeks as well. Have you donated before?",
    category: "interval",
  },
  {
    id: "whole_blood_interval",
    keywords: ["whole blood", "90 days"],
    minKeywords: 1,
    response:
      "Whole blood donation interval is 90 days (3 months). Your body needs this time to replenish blood cells. 🩸",
    category: "interval",
  },

  // ============ TEMPORARY DEFERRAL ============
  {
    id: "fever_cold",
    keywords: ["fever", "cold", "flu", "cough", "sick", "feeling unwell"],
    minKeywords: 1,
    response:
      "⚠️ Do NOT donate if you have fever, cold, or flu symptoms. Wait until you're completely recovered (usually 2 weeks after symptoms resolve). This protects both you and blood recipients.",
    category: "deferral",
  },
  {
    id: "vaccination",
    keywords: ["vaccine", "vaccination", "vaccinated", "covid", "flu shot", "immunization"],
    minKeywords: 1,
    response:
      "⏸️ Deferral periods after vaccines vary:\n• COVID-19: No wait needed\n• Flu shot: No wait needed\n• Live vaccines (MMR, chickenpox): Wait 28 days\n• Other vaccines: Usually no wait\nConsult your doctor or blood bank for specifics.",
    category: "deferral",
  },
  {
    id: "pregnancy",
    keywords: ["pregnant", "pregnancy", "breastfeeding", "nursing"],
    minKeywords: 1,
    response:
      "👶 Pregnancy & Breastfeeding:\n• During pregnancy: Wait until pregnancy ends\n• While breastfeeding: Can donate after 6 months postpartum\n• Other deferral considerations apply\nConsult your OB/GYN before donating.",
    category: "deferral",
  },
  {
    id: "tattoo_piercing",
    keywords: ["tattoo", "piercing", "body art", "ink"],
    minKeywords: 1,
    response:
      "🎨 Tattoo/Piercing Deferral:\n• Professional facility: Usually can donate after 12 months\n• Non-professional/questionable: 12-month deferral\n• Your blood bank may request additional health screening\nAlways inform the staff about recent body modifications.",
    category: "deferral",
  },

  // ============ BLOOD GROUP COMPATIBILITY ============
  {
    id: "blood_group_universal",
    keywords: ["o negative", "o-", "universal donor", "rare blood type"],
    minKeywords: 1,
    response:
      "🩸 O- (O Negative) is the universal donor! Your blood can help any patient in emergencies. This makes you extremely valuable. Keep donating regularly!",
    category: "blood_group",
  },
  {
    id: "blood_group_ab_positive",
    keywords: ["ab positive", "ab+", "universal recipient"],
    minKeywords: 1,
    response:
      "🩸 AB+ (AB Positive) is the universal recipient! You can receive blood from anyone. Regular donation helps save lives.",
    category: "blood_group",
  },
  {
    id: "blood_group_compatibility",
    keywords: ["blood group", "blood type", "compatible", "can receive", "can donate to"],
    minKeywords: 1,
    response:
      "💉 Blood Compatibility:\n• O-: Donate to all, receive from O-\n• O+: Donate to +, receive from O\n• A-: Donate to A-, AB-, receive from A-, O-\n• A+: Donate to A+, AB+, receive from A, O\n• B-: Donate to B-, AB-, receive from B-, O-\n• B+: Donate to B+, AB+, receive from B, O\n• AB-: Donate to AB-, receive from -\n• AB+: Donate to AB+, receive from all\nWhat's your blood group?",
    category: "blood_group",
  },

  // ============ SIDE EFFECTS & SAFETY ============
  {
    id: "side_effects",
    keywords: ["side effects", "dizzy", "faint", "nausea", "weak", "tired", "pain"],
    minKeywords: 1,
    response:
      "⚠️ Common temporary side effects after donation:\n• Dizziness or lightheadedness\n• Fatigue (usually 24-48 hours)\n• Mild bruising at needle site\n• Nausea\n\nMitigation:\n• Rest for 10-15 minutes\n• Drink fluids & eat snacks\n• Avoid heavy exercise for 24 hours\nIf symptoms persist, contact medical staff immediately.",
    category: "safety",
  },
  {
    id: "donation_safety",
    keywords: ["safe", "safety", "sterile", "infection", "disease transmission"],
    minKeywords: 1,
    response:
      "✅ Blood donation is very safe:\n• Sterile needle for each donation\n• Blood is tested for infectious diseases\n• Modern equipment prevents contamination\n• Medical staff monitor you throughout\nDonation saves lives with minimal risk!",
    category: "safety",
  },

  // ============ BENEFITS ============
  {
    id: "benefits_donation",
    keywords: ["benefit", "why donate", "help", "save lives", "important"],
    minKeywords: 1,
    response:
      "💖 Why donate blood?\n• Save 3 lives with one donation\n• Help accident victims, surgery patients, cancer patients\n• Blood can't be manufactured - it's precious\n• Free health screening\n• Get a sense of purpose\nWill you join as a donor?",
    category: "benefits",
  },

  // ============ BEFORE DONATION ============
  {
    id: "before_donation",
    keywords: ["before", "prepare", "preparation", "prior", "beforehand", "get ready"],
    minKeywords: 1,
    response:
      "📋 Prepare for donation:\n• Sleep well (7-8 hours)\n• Eat a healthy meal 2-3 hours before\n• Stay hydrated - drink plenty of water\n• Avoid alcohol 24 hours prior\n• Wear loose, comfortable clothing\n• Bring ID and donor card if you have one\n• Avoid strenuous exercise day of donation",
    category: "preparation",
  },

  // ============ AFTER DONATION ============
  {
    id: "after_donation",
    keywords: ["after", "post", "following", "recovery", "rest", "afterwards"],
    minKeywords: 1,
    response:
      "🏥 After donation care:\n• Rest for 10-15 minutes minimum\n• Eat snacks & drink fluids\n• Avoid heavy exercise for 24 hours\n• Don't lift heavy items\n• Keep bandage on for few hours\n• Drink extra fluids for next 48 hours\n• Take iron supplements if recommended\n• Avoid alcohol for 24 hours",
    category: "recovery",
  },
];

/**
 * Urgency Keywords Detection
 * These indicate emergency situations requiring immediate attention
 */
export const urgencyKeywords = [
  "urgent",
  "emergency",
  "accident",
  "critical",
  "immediate",
  "icu",
  "emergency room",
  "er",
  "ambulance",
  "blood loss",
  "severe bleeding",
  "critical condition",
  "life threatening",
  "dying",
  "hospital",
];

/**
 * Medical Disclaimer
 */
export const medicalDisclaimer =
  "\n\n⚕️ **Medical Disclaimer**: This information is for educational guidance only and does not replace professional medical advice. Always consult with healthcare providers for personalized medical guidance.";
