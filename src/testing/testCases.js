/**
 * Chat Assistant - Test Cases & Examples
 * Use these to test different scenarios
 */

export const testCases = {
  // ============ ELIGIBILITY TESTS ============
  eligibility: [
    {
      question: "Can I donate blood at age 17?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches eligibility_age rule"
    },
    {
      question: "What's the minimum weight to donate?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches eligibility_weight rule"
    },
    {
      question: "I have diabetes, can I still donate?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches eligibility_health rule"
    }
  ],

  // ============ INTERVAL TESTS ============
  interval: [
    {
      question: "How often can I donate blood?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches donation_interval rule"
    },
    {
      question: "How many days between whole blood donations?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches whole_blood_interval rule"
    },
    {
      question: "When can I donate again?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches donation_interval rule"
    }
  ],

  // ============ DEFERRAL TESTS ============
  deferral: [
    {
      question: "I have a fever, can I still donate?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches fever_cold rule - includes warning"
    },
    {
      question: "How long to wait after COVID vaccine?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches vaccination rule"
    },
    {
      question: "Can I donate if I'm pregnant?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches pregnancy rule"
    },
    {
      question: "I got a tattoo last week, can I donate?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches tattoo_piercing rule"
    }
  ],

  // ============ BLOOD GROUP TESTS ============
  bloodGroup: [
    {
      question: "I'm O negative, am I a universal donor?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches blood_group_universal rule"
    },
    {
      question: "What blood type is AB positive?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches blood_group_ab_positive rule"
    },
    {
      question: "Which blood groups can donate to me?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches blood_group_compatibility rule"
    }
  ],

  // ============ SAFETY TESTS ============
  safety: [
    {
      question: "Is blood donation safe?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches donation_safety rule"
    },
    {
      question: "What are the side effects of donating?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches side_effects rule"
    }
  ],

  // ============ PREPARATION TESTS ============
  preparation: [
    {
      question: "How should I prepare before donating blood?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches before_donation rule"
    },
    {
      question: "What should I eat before donation?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches before_donation rule"
    }
  ],

  // ============ RECOVERY TESTS ============
  recovery: [
    {
      question: "What should I do after donating blood?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches after_donation rule"
    },
    {
      question: "How long to rest after donation?",
      expectedSource: "faq",
      badge: "📋 FAQ",
      explanation: "Matches after_donation rule"
    }
  ],

  // ============ AI FALLBACK TESTS ============
  aiTest: [
    {
      question: "What's the best diet before and after donation?",
      expectedSource: "ai",
      badge: "🤖 AI",
      explanation: "Complex question not in FAQ, requires AI"
    },
    {
      question: "How does blood transfusion work?",
      expectedSource: "ai",
      badge: "🤖 AI",
      explanation: "Educational question beyond FAQ scope"
    },
    {
      question: "Can vegetarians donate blood?",
      expectedSource: "ai",
      badge: "🤖 AI",
      explanation: "Specific scenario question"
    }
  ],

  // ============ URGENCY TESTS ============
  urgency: [
    {
      question: "URGENT! Need blood immediately for surgery!",
      expectedSource: "faq | ai",
      badge: "🚨 Urgent",
      hasEmergencyNote: true,
      explanation: "Detects 'urgent' keyword, includes emergency suggestion"
    },
    {
      question: "There's been an accident! Need O negative blood now!",
      expectedSource: "faq | ai",
      badge: "🚨 Urgent",
      hasEmergencyNote: true,
      explanation: "Detects 'accident' keyword"
    },
    {
      question: "Patient in ICU needs emergency blood transfusion",
      expectedSource: "faq | ai",
      badge: "🚨 Urgent",
      hasEmergencyNote: true,
      explanation: "Detects 'ICU' and 'emergency' keywords"
    },
    {
      question: "Critical condition - need blood donors ASAP",
      expectedSource: "faq | ai",
      badge: "🚨 Urgent",
      hasEmergencyNote: true,
      explanation: "Detects 'critical' keyword"
    }
  ],

  // ============ EDGE CASES ============
  edgeCases: [
    {
      question: "unknown random question that has no keywords",
      expectedSource: "ai",
      badge: "🤖 AI",
      explanation: "No FAQ match, falls back to AI"
    },
    {
      question: "",
      expectedSource: "validation_error",
      error: "Please enter a valid message",
      explanation: "Empty message validation"
    },
    {
      question: "a".repeat(1001),
      expectedSource: "validation_error",
      error: "Please enter a valid message (1-1000 characters)",
      explanation: "Message too long validation"
    }
  ]
};

/**
 * MANUAL TESTING GUIDE
 * 
 * Open browser console (F12) while app is running
 * 
 * Test 1: Rule Matching
 * ─────────────────────────────────────────────────
 * import { matchFAQRule } from './utils/chatUtils';
 * const rule = matchFAQRule("Can I donate at age 16?");
 * console.log(rule); // Should log eligibility_age rule
 * 
 * 
 * Test 2: Urgency Detection
 * ─────────────────────────────────────────────────
 * import { detectUrgency } from './utils/chatUtils';
 * console.log(detectUrgency("emergency!")); // true
 * console.log(detectUrgency("when can I donate?")); // false
 * 
 * 
 * Test 3: Full Message Processing
 * ─────────────────────────────────────────────────
 * import { processMessage } from './utils/chatUtils';
 * const result = await processMessage("How often can I donate?");
 * console.log(result);
 * // {
 * //   response: "...",
 * //   isUrgent: false,
 * //   source: "faq",
 * //   timestamp: "2024-01-25T10:30:00Z"
 * // }
 * 
 * 
 * Test 4: AI API (with API key)
 * ─────────────────────────────────────────────────
 * import { callAIAPI } from './utils/chatUtils';
 * const response = await callAIAPI("Complex question?");
 * console.log(response);
 * 
 * 
 * Test 5: All Test Cases
 * ─────────────────────────────────────────────────
 * import { testCases } from './testing/testCases';
 * 
 * // Test FAQ matching
 * for (const test of testCases.eligibility) {
 *   const rule = matchFAQRule(test.question);
 *   console.log(`${test.question} → ${rule?.id || 'NO MATCH'}`);
 * }
 * 
 * // Test urgency detection
 * for (const test of testCases.urgency) {
 *   const urgent = detectUrgency(test.question);
 *   console.log(`${test.question} → Urgent: ${urgent}`);
 * }
 */

/**
 * AUTOMATED TEST RUNNER
 * 
 * Run this to validate all FAQ rules are working:
 */
export async function runTestSuite() {
  console.log("🧪 Running Chat Assistant Test Suite...\n");

  const { matchFAQRule } = await import('./utils/chatUtils');
  const { detectUrgency } = await import('./utils/chatUtils');

  let passed = 0;
  let failed = 0;

  // Test FAQ matching
  console.log("📋 Testing FAQ Rule Matching...");
  for (const category in testCases) {
    if (!['urgency', 'aiTest', 'edgeCases'].includes(category)) {
      const tests = testCases[category];
      for (const test of tests) {
        const rule = matchFAQRule(test.question);
        if (rule) {
          console.log(`✅ ${test.question.substring(0, 40)}...`);
          passed++;
        } else {
          console.log(`❌ ${test.question.substring(0, 40)}... (NO MATCH)`);
          failed++;
        }
      }
    }
  }

  // Test urgency detection
  console.log("\n🚨 Testing Urgency Detection...");
  for (const test of testCases.urgency) {
    const isUrgent = detectUrgency(test.question);
    if (isUrgent) {
      console.log(`✅ ${test.question.substring(0, 40)}... (URGENT)`);
      passed++;
    } else {
      console.log(`❌ ${test.question.substring(0, 40)}... (NOT DETECTED)`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

export default testCases;
