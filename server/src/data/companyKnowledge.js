const companyProfile = {
  name: "Prospera",

  description:
    "Prospera is a real-estate platform that helps users discover properties and get assistance with their property search.",

  services: [
    "Property discovery",
    "Property search assistance",
    "Real-estate information",
  ],

  cities: [
    // IMPORTANT:
    // Add only cities where Prospera actually operates.
    // Example:
    // "Lucknow",
    // "Delhi",
    // "Noida",
  ],

  contact: {
    phone: "",
    email: "",
    whatsapp: "",
    website: "",
  },

  office: {
    address: "",
    city: "",
    hours: "",
  },

  policies: {
    booking: "",
    cancellation: "",
    refund: "",
    propertyVisit: "",
  },
};

/*
 * ============================================================
 * FAQ
 * ============================================================
 *
 * YAHAN tum Prospera ke actual FAQs add karoge.
 *
 * Example:
 *
 * {
 *   id: "FAQ_001",
 *   category: "property_visit",
 *   question: "Can I schedule a property visit?",
 *   answer: "Yes, property visits can be scheduled through ...",
 *   keywords: [
 *     "visit",
 *     "property visit",
 *     "site visit",
 *     "schedule visit"
 *   ]
 * }
 *
 * IMPORTANT:
 * Fake company information mat bharna.
 * Jo actual Prospera policy hai wahi yahan likhna.
 */

const faqs = [
  {
    id: "FAQ_001",
    category: "company",
    question: "What is Prospera?",
    answer:
      "Prospera is a real-estate platform that helps users discover properties and get assistance with their property search.",
    keywords: [
      "prospera",
      "company",
      "about",
      "what is prospera",
      "real estate",
    ],
  },

  {
    id: "FAQ_002",
    category: "services",
    question: "What does Prospera help with?",
    answer:
      "Prospera helps users discover properties, search according to their preferences, and get real-estate related assistance.",
    keywords: [
      "services",
      "help",
      "what do you do",
      "property search",
      "real estate services",
    ],
  },

  /*
   * ==========================================================
   * COPY THIS FORMAT FOR YOUR REAL FAQs
   * ==========================================================
   */

  // {
  //   id: "FAQ_003",
  //   category: "property_visit",
  //   question: "Can I schedule a property visit?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "property visit",
  //     "site visit",
  //     "visit",
  //     "schedule visit"
  //   ],
  // },

  // {
  //   id: "FAQ_004",
  //   category: "booking",
  //   question: "How does property booking work?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "booking",
  //     "book property",
  //     "reserve",
  //   ],
  // },

  // {
  //   id: "FAQ_005",
  //   category: "fees",
  //   question: "Does Prospera charge any fees?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "fees",
  //     "charges",
  //     "commission",
  //     "cost",
  //   ],
  // },

  // {
  //   id: "FAQ_006",
  //   category: "contact",
  //   question: "How can I contact Prospera?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "contact",
  //     "phone",
  //     "email",
  //     "whatsapp",
  //   ],
  // },

  // {
  //   id: "FAQ_007",
  //   category: "property_visit",
  //   question: "How can I arrange a site visit?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "site visit",
  //     "property visit",
  //     "arrange visit",
  //   ],
  // },

  // {
  //   id: "FAQ_008",
  //   category: "rent",
  //   question: "Does Prospera help with rental properties?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "rent",
  //     "rental",
  //     "rent property",
  //   ],
  // },

  // {
  //   id: "FAQ_009",
  //   category: "sale",
  //   question: "Does Prospera have properties for sale?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "sale",
  //     "buy",
  //     "buy property",
  //     "properties for sale",
  //   ],
  // },

  // {
  //   id: "FAQ_010",
  //   category: "cities",
  //   question: "Which cities does Prospera operate in?",
  //   answer:
  //     "YOUR ACTUAL ANSWER HERE",
  //   keywords: [
  //     "cities",
  //     "locations",
  //     "where",
  //     "operate",
  //   ],
  // },
];

/*
 * ============================================================
 * TEXT NORMALIZATION
 * ============================================================
 */

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * ============================================================
 * TOKENIZATION
 * ============================================================
 */

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean);
}

/*
 * ============================================================
 * SCORE FAQ
 * ============================================================
 */

function scoreFaq(faq, query) {
  const normalizedQuery =
    normalizeText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const queryTokens =
    tokenize(normalizedQuery);

  const searchableText = normalizeText(
    [
      faq.question,
      faq.category,
      ...(faq.keywords || []),
    ].join(" ")
  );

  const searchableTokens =
    tokenize(searchableText);

  let score = 0;

  /*
   * Exact phrase match gets the highest weight.
   */
  if (
    searchableText.includes(
      normalizedQuery
    )
  ) {
    score += 20;
  }

  /*
   * Individual keyword/token matches.
   */
  for (const token of queryTokens) {
    if (searchableTokens.includes(token)) {
      score += 3;
    }
  }

  /*
   * Question words match.
   */
  const questionText =
    normalizeText(faq.question);

  if (
    questionText.includes(
      normalizedQuery
    )
  ) {
    score += 10;
  }

  return score;
}

/*
 * ============================================================
 * SEARCH COMPANY KNOWLEDGE
 * ============================================================
 */

export function searchCompanyKnowledge(
  query
) {
  const normalizedQuery =
    normalizeText(query);

  if (!normalizedQuery) {
    return {
      found: false,
      results: [],
      message:
        "No company information query was provided.",
    };
  }

  const results = faqs
    .map((faq) => ({
      ...faq,
      score: scoreFaq(
        faq,
        normalizedQuery
      ),
    }))
    .filter(
      (faq) => faq.score > 0
    )
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, 5)
    .map(
      ({
        score,
        ...faq
      }) => faq
    );

  /*
   * Company profile information can be useful
   * when the question is broadly about Prospera.
   */
  const companyText = normalizeText(
    [
      companyProfile.name,
      companyProfile.description,
      ...companyProfile.services,
      ...companyProfile.cities,
    ].join(" ")
  );

  const companyTokens =
    tokenize(companyText);

  const queryTokens =
    tokenize(normalizedQuery);

  const companyMatches =
    queryTokens.filter(
      (token) =>
        companyTokens.includes(token)
    );

  const includeCompanyProfile =
    normalizedQuery.includes(
      "prospera"
    ) ||
    normalizedQuery.includes(
      "company"
    ) ||
    normalizedQuery.includes(
      "about"
    );

  return {
    found:
      results.length > 0 ||
      includeCompanyProfile,

    company:
      includeCompanyProfile
        ? companyProfile
        : undefined,

    results,

    query: query,

    matchedTerms:
      companyMatches,
  };
}

/*
 * ============================================================
 * GET COMPLETE COMPANY PROFILE
 * ============================================================
 */

export function getCompanyProfile() {
  return companyProfile;
}

/*
 * ============================================================
 * GET ALL FAQS
 * ============================================================
 *
 * Mainly useful for internal development/testing.
 * The AI should normally use searchCompanyKnowledge()
 * instead of receiving every FAQ.
 */

export function getAllFaqs() {
  return faqs;
}