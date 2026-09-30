import express from "express";

const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/everything";

/* =========================================================
   ALLOWED FEEDS
========================================================= */

const ALLOWED_LOCATIONS = [
    "all",
    "noida",
    "gurgaon",
    "lucknow",
    "delhi"
];

/* =========================================================
   SEARCH QUERIES
========================================================= */

const SEARCH_QUERIES = {
    all: [
        '"real estate" AND (India OR Indian) AND (housing OR property OR developer)',
        '"housing sales" AND India',
        '"property sales" AND India',
        '"housing project" AND India',
        '"real estate project" AND India',
        '"homebuyers" AND India AND (property OR housing)',
        '"RERA" AND India AND (project OR housing OR property)',
        '"land acquisition" AND India AND (housing OR residential)'
    ],

    noida: [
        '("Noida" OR "Greater Noida") AND ("housing project" OR "residential project")',
        '("Noida" OR "Greater Noida") AND ("property sales" OR "housing sales")',
        '("Noida" OR "Greater Noida") AND (developer OR "land parcel" OR "land acquisition")',
        '("Noida Extension" OR "Greater Noida") AND (housing OR property)',
        '("Noida" OR "Greater Noida") AND RERA AND (project OR housing)'
    ],

    gurgaon: [
        '("Gurgaon" OR "Gurugram") AND ("housing project" OR "residential project")',
        '("Gurgaon" OR "Gurugram") AND ("property sales" OR "housing sales")',
        '("Gurgaon" OR "Gurugram") AND (developer OR "land parcel" OR "land acquisition")',
        '("Gurgaon" OR "Gurugram") AND RERA AND (project OR housing)',
        '("Gurgaon" OR "Gurugram") AND (homebuyers OR "property prices")'
    ],

    lucknow: [
        '"Lucknow" AND ("housing project" OR "residential project")',
        '"Lucknow" AND ("property sales" OR "housing sales")',
        '"Lucknow" AND (developer OR "land parcel" OR "land acquisition")',
        '"Lucknow Development Authority" AND (housing OR property OR project)',
        '"Lucknow" AND RERA AND (project OR housing OR property)'
    ],

    delhi: [
        '("Delhi NCR" OR "New Delhi" OR Delhi) AND ("housing project" OR "residential project")',
        '("Delhi NCR" OR "New Delhi" OR Delhi) AND ("property sales" OR "housing sales")',
        '("Delhi NCR" OR "New Delhi" OR Delhi) AND (developer OR "land parcel" OR "land acquisition")',
        '("Delhi NCR" OR "New Delhi") AND RERA AND (project OR housing OR property)',
        '("Delhi NCR" OR "New Delhi" OR Delhi) AND (homebuyers OR "property prices")'
    ]
};

/* =========================================================
   POSITIVE REAL ESTATE KEYWORDS
========================================================= */

const POSITIVE_REAL_ESTATE_KEYWORDS = [

    // SALES
    "property sale",
    "property sales",
    "home sale",
    "home sales",
    "housing sales",
    "residential sales",
    "homes sold",
    "property transaction",
    "property transactions",

    // BUYERS
    "homebuyers",
    "home buyers",
    "homebuyer demand",
    "buyer demand",
    "housing demand",
    "property demand",

    // PURCHASE
    "property purchase",
    "property purchases",
    "home purchase",
    "home purchases",
    "land purchase",
    "land purchases",

    // LAND
    "land acquisition",
    "land acquisitions",
    "acquires land",
    "acquired land",
    "buys land",
    "bought land",
    "land parcel",
    "land parcels",

    // PROJECTS
    "housing project",
    "housing projects",
    "residential project",
    "residential projects",
    "real estate project",
    "real estate projects",
    "property project",
    "property projects",
    "new project",
    "new projects",
    "project launch",
    "project launches",
    "project launched",
    "housing development",
    "residential development",
    "real estate development",

    // DEVELOPERS
    "real estate developer",
    "realty developer",
    "property developer",
    "developer",
    "developers",
    "realty firm",
    "real estate firm",
    "real estate company",

    // PROPERTY TYPES
    "apartment",
    "apartments",
    "flat",
    "flats",
    "villa",
    "villas",
    "residential property",
    "residential properties",
    "commercial property",
    "commercial properties",
    "plot",
    "plots",
    "township",
    "township project",

    // PRICES / MARKET
    "property price",
    "property prices",
    "home prices",
    "housing prices",
    "property market",
    "real estate market",
    "housing market",
    "realty market",

    // INVESTMENT
    "real estate investment",
    "property investment",
    "housing investment",
    "investment in real estate",
    "investment in housing",

    // RERA
    "RERA project",
    "RERA projects",
    "RERA approval",
    "RERA approvals",
    "project approval",
    "housing project approved",
    "realty project approved"
];

/* =========================================================
   BLOCKED CONTENT
========================================================= */

const BLOCKED_KEYWORDS = [

    // Crime
    "murder",
    "murdered",
    "rape",
    "sexual assault",
    "assault",
    "violence",
    "violent",
    "riot",
    "riots",
    "protest",
    "protests",
    "clash",
    "clashes",
    "attack",
    "attacked",
    "terror",
    "terrorist",
    "crime",
    "criminal",
    "criminals",
    "arrest",
    "arrested",
    "police",
    "fir",
    "custody",

    // Fraud / scam
    "fraud",
    "fraudulent",
    "scam",
    "scammed",
    "cheating",
    "cheat",
    "forgery",
    "forged",
    "fake",
    "illegal",
    "illegally",
    "corruption",
    "bribery",
    "bribe",
    "money laundering",

    // Accidents / disaster
    "accident",
    "accidents",
    "fire",
    "explosion",
    "blast",
    "collapse",
    "collapsed",
    "flood",
    "flooding",
    "floodwaters",
    "earthquake",
    "landslide",
    "storm",
    "cyclone",
    "disaster",

    // Drugs / seizure
    "seized",
    "seizure",
    "narcotics",
    "drug",
    "drugs",
    "ganja",
    "cannabis",
    "contraband",
    "smuggling",
    "smuggled",

    // Damage
    "vandal",
    "vandalism",
    "damaged",
    "damage",
    "demolished",
    "demolition",
    "destroyed",
    "destruction",

    // Negative incident content
    "dead",
    "death",
    "died",
    "injured",
    "injuries",
    "victim",
    "victims",
    "body found",
    "missing",
    "kidnap",
    "kidnapped",
    "suicide",

    // Entertainment
    "celebrity",
    "actor",
    "actress",
    "bollywood",
    "hollywood",
    "film",
    "films",
    "movie",
    "movies",
    "web series",
    "television",
    "tv show",
    "entertainment",
    "music",
    "singer",
    "song",
    "viral video",
    "viral",

    // Sports
    "cricket",
    "football",
    "sports",
    "ipl",
    "match",
    "player",
    "tournament",

    // Food
    "recipe",
    "restaurant",
    "food",
    "cooking",

    // Travel
    "travel",
    "tourism",
    "tourist",

    // Unrelated finance
    "cryptocurrency",
    "crypto",
    "bitcoin",
    "mutual fund",
    "stock market",
    "share market",
    "shares",
    "stocks",
    "fixed deposit",
    "fixed deposits"
];

/* =========================================================
   LOCATION KEYWORDS
========================================================= */

const LOCATION_KEYWORDS = {

    noida: [
        "noida",
        "greater noida",
        "noida extension"
    ],

    gurgaon: [
        "gurgaon",
        "gurugram"
    ],

    lucknow: [
        "lucknow",
        "lucknow development authority",
        "lda lucknow"
    ],

    delhi: [
        "delhi ncr",
        "new delhi",
        "delhi"
    ]
};

/* =========================================================
   INDIA KEYWORDS
========================================================= */

const INDIA_KEYWORDS = [
    "india",
    "indian",
    "india's",
    "indian real estate",
    "india real estate",
    "india housing",
    "indian housing"
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(value = "") {
    return String(value)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function getArticleText(article) {
    return normalizeText(
        `${article?.title || ""} ${article?.description || ""}`
    );
}

/* =========================================================
   BLOCKED CHECK
========================================================= */

function hasBlockedContent(article) {

    const text = getArticleText(article);

    return BLOCKED_KEYWORDS.some(keyword =>
        text.includes(normalizeText(keyword))
    );
}

/* =========================================================
   REAL ESTATE SCORE
========================================================= */

function getRealEstateScore(article) {

    const title = normalizeText(article?.title || "");
    const description = normalizeText(article?.description || "");

    const fullText = `${title} ${description}`;

    let score = 0;

    for (const keyword of POSITIVE_REAL_ESTATE_KEYWORDS) {

        const normalizedKeyword =
            normalizeText(keyword);

        if (title.includes(normalizedKeyword)) {
            score += 4;
        }
        else if (description.includes(normalizedKeyword)) {
            score += 2;
        }
        else if (fullText.includes(normalizedKeyword)) {
            score += 1;
        }
    }

    return score;
}

/* =========================================================
   INDIA CHECK
========================================================= */

function hasIndiaSignal(article) {

    const text = getArticleText(article);

    return INDIA_KEYWORDS.some(keyword =>
        text.includes(normalizeText(keyword))
    );
}

/* =========================================================
   LOCATION SCORE
========================================================= */

function getLocationScore(article, location) {

    if (location === "all") {
        return 0;
    }

    const title =
        normalizeText(article?.title || "");

    const description =
        normalizeText(article?.description || "");

    let score = 0;

    const keywords =
        LOCATION_KEYWORDS[location] || [];

    for (const keyword of keywords) {

        const normalizedKeyword =
            normalizeText(keyword);

        if (title.includes(normalizedKeyword)) {
            score += 5;
        }

        if (description.includes(normalizedKeyword)) {
            score += 2;
        }
    }

    return score;
}

/* =========================================================
   LOCATION MATCH
========================================================= */

function hasLocationMatch(article, location) {

    if (location === "all") {
        return true;
    }

    return getLocationScore(article, location) > 0;
}

/* =========================================================
   ALL INDIA VALIDATION
========================================================= */

function isValidIndiaArticle(article) {

    if (!article?.title) {
        return false;
    }

    if (hasBlockedContent(article)) {
        return false;
    }

    if (!hasIndiaSignal(article)) {
        return false;
    }

    const realEstateScore =
        getRealEstateScore(article);

    if (realEstateScore < 4) {
        return false;
    }

    return true;
}

/* =========================================================
   CITY VALIDATION
========================================================= */

function isValidCityArticle(article, location) {

    if (!article?.title) {
        return false;
    }

    if (hasBlockedContent(article)) {
        return false;
    }

    if (!hasLocationMatch(article, location)) {
        return false;
    }

    const realEstateScore =
        getRealEstateScore(article);

    if (realEstateScore < 4) {
        return false;
    }

    const locationScore =
        getLocationScore(article, location);

    if (locationScore < 2) {
        return false;
    }

    return true;
}

/* =========================================================
   CLEAN ARTICLE
========================================================= */

function cleanArticle(article) {

    return {

        source: {
            id: article?.source?.id || null,

            name:
                article?.source?.name ||
                "News Source"
        },

        author:
            article?.author || null,

        title:
            article?.title || "",

        description:
            article?.description ||
            "Read the complete real estate update from the original publisher.",

        url:
            article?.url || "#",

        /*
         * IMPORTANT:
         * Keep NewsAPI's original image.
         */
        urlToImage:
            article?.urlToImage || null,

        publishedAt:
            article?.publishedAt || null
    };
}

/* =========================================================
   DUPLICATES
========================================================= */

function removeDuplicates(articles) {

    const seen = new Set();

    return articles.filter(article => {

        const key =
            article.url ||
            `${normalizeText(article.title)}-${normalizeText(
                article.source?.name
            )}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
}

/* =========================================================
   SORT
========================================================= */

function sortArticles(articles, location) {

    return [...articles].sort((a, b) => {

        const aRealEstate =
            getRealEstateScore(a);

        const bRealEstate =
            getRealEstateScore(b);

        const aLocation =
            getLocationScore(a, location);

        const bLocation =
            getLocationScore(b, location);

        const aScore =
            aRealEstate * 10 +
            aLocation * 5;

        const bScore =
            bRealEstate * 10 +
            bLocation * 5;

        if (bScore !== aScore) {
            return bScore - aScore;
        }

        const dateA =
            new Date(a.publishedAt || 0).getTime();

        const dateB =
            new Date(b.publishedAt || 0).getTime();

        return dateB - dateA;
    });
}

/* =========================================================
   DATE RANGE
========================================================= */

const NEWS_LOOKBACK_DAYS = 14;

function getFromDate() {

    const date = new Date();

    date.setDate(
        date.getDate() - NEWS_LOOKBACK_DAYS
    );

    return date.toISOString();
}

/* =========================================================
   FETCH NEWS
========================================================= */

async function fetchNews(query) {

    if (!NEWS_API_KEY) {
        throw new Error(
            "NEWS_API_KEY is missing in .env"
        );
    }

    const params = new URLSearchParams({

        q: query,

        searchIn:
            "title,description",

        language:
            "en",

        sortBy:
            "publishedAt",

        pageSize:
            "50",

        from:
            getFromDate()
    });

    const response = await fetch(
        `${NEWS_API_URL}?${params.toString()}`,
        {
            headers: {
                "X-Api-Key":
                    NEWS_API_KEY
            }
        }
    );

    const data =
        await response.json();

    if (
        !response.ok ||
        data.status !== "ok"
    ) {

        console.error(
            "NewsAPI Error:",
            data
        );

        throw new Error(
            data?.message ||
            `NewsAPI request failed with status ${response.status}`
        );
    }

    return Array.isArray(data.articles)
        ? data.articles
        : [];
}

/* =========================================================
   MULTIPLE QUERIES
========================================================= */

async function fetchMultipleQueries(queries) {

    const results = [];

    for (const query of queries) {

        try {

            const articles =
                await fetchNews(query);

            results.push(...articles);

        }
        catch (error) {

            console.error(
                `News query failed: ${query}`,
                error.message
            );
        }
    }

    return results;
}

/* =========================================================
   FILTER
========================================================= */

function filterArticles(
    articles,
    location
) {

    const cleaned =
        articles
            .map(cleanArticle)
            .filter(article => {

                if (location === "all") {
                    return isValidIndiaArticle(article);
                }

                return isValidCityArticle(
                    article,
                    location
                );
            });

    return removeDuplicates(cleaned);
}

/* =========================================================
   API ROUTE
========================================================= */

router.get("/", async (req, res) => {

    try {

        const location =
            normalizeText(
                req.query.location || "all"
            );

        if (
            !ALLOWED_LOCATIONS.includes(
                location
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid location. Allowed locations: all, noida, gurgaon, lucknow, delhi"
            });
        }

        const queries =
            SEARCH_QUERIES[location];

        const rawArticles =
            await fetchMultipleQueries(
                queries
            );

        let articles =
            filterArticles(
                rawArticles,
                location
            );

        articles =
            sortArticles(
                articles,
                location
            );

        /*
         * Return maximum 12 clean articles.
         */
        articles =
            articles.slice(0, 12);

        return res.json({

            success: true,

            location,

            count:
                articles.length,

            articles
        });

    }
    catch (error) {

        console.error(
            "Market News Route Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch market news."
        });
    }
});

export default router;