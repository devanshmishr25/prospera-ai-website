import "dotenv/config";
import mongoose from "mongoose";
import Property from "../src/models/Property.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/prospera_ai";

const properties = [
  // ============================================================
  // LUCKNOW
  // ============================================================

  {
    propertyId: "PROP_1001",
    title: "Modern 2 BHK Apartment in Gomti Nagar",
    description:
      "Well-planned 2 BHK apartment in a gated residential community.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar",
      address: "Gomti Nagar, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 4200000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1180,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    amenities: [
      "Gym",
      "Swimming Pool",
      "Security",
      "Power Backup",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1002",
    title: "Premium 3 BHK Apartment in Gomti Nagar Extension",
    description:
      "Spacious 3 BHK apartment with modern interiors and community amenities.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar Extension",
      address: "Gomti Nagar Extension, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 6800000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1680,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Club House",
      "Gym",
      "Security",
      "Garden",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1003",
    title: "Affordable 2 BHK in Indira Nagar",
    description:
      "Budget-friendly 2 BHK apartment close to schools and daily conveniences.",
    location: {
      city: "Lucknow",
      locality: "Indira Nagar",
      address: "Indira Nagar, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 3500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1050,
    parking: true,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1004",
    title: "Luxury 4 BHK Villa in Gomti Nagar",
    description:
      "Large independent villa with private parking and landscaped surroundings.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar",
      address: "Gomti Nagar, Lucknow",
    },
    type: "Villa",
    listingType: "Sale",
    price: 12500000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3200,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    ],
    amenities: [
      "Garden",
      "Private Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1005",
    title: "1 BHK Apartment Near Aliganj",
    description:
      "Compact 1 BHK apartment suitable for a small family or working professional.",
    location: {
      city: "Lucknow",
      locality: "Aliganj",
      address: "Aliganj, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 2400000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 680,
    parking: true,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1006",
    title: "3 BHK House in Mahanagar",
    description:
      "Independent residential house in a well-established Lucknow locality.",
    location: {
      city: "Lucknow",
      locality: "Mahanagar",
      address: "Mahanagar, Lucknow",
    },
    type: "House",
    listingType: "Sale",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2100,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Parking",
      "Garden",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1007",
    title: "2 BHK Furnished Apartment in Hazratganj",
    description:
      "Fully furnished apartment in central Lucknow.",
    location: {
      city: "Lucknow",
      locality: "Hazratganj",
      address: "Hazratganj, Lucknow",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 28000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Lift",
      "Security",
      "Power Backup",
      "Gym",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1008",
    title: "3 BHK Rental Apartment in Gomti Nagar",
    description:
      "Spacious semi-furnished rental apartment with parking.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar",
      address: "Gomti Nagar, Lucknow",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 32000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1750,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    amenities: [
      "Gym",
      "Lift",
      "Security",
      "Club House",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1009",
    title: "Residential Plot in Sultanpur Road",
    description:
      "Residential plot suitable for future home construction.",
    location: {
      city: "Lucknow",
      locality: "Sultanpur Road",
      address: "Sultanpur Road, Lucknow",
    },
    type: "Plot",
    listingType: "Sale",
    price: 3200000,
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 1500,
    parking: false,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    ],
    amenities: [
      "Road Access",
      "Water Supply",
      "Electricity",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1010",
    title: "Commercial Space in Gomti Nagar",
    description:
      "Commercial property suitable for office or retail use.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar",
      address: "Gomti Nagar, Lucknow",
    },
    type: "Commercial",
    listingType: "Rent",
    price: 55000,
    bedrooms: 0,
    bathrooms: 2,
    areaSqft: 1800,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Power Backup",
    ],
    available: true,
  },

  // ============================================================
  // NOIDA
  // ============================================================

  {
    propertyId: "PROP_1011",
    title: "2 BHK Apartment in Sector 137 Noida",
    description:
      "Modern apartment in a residential society with multiple amenities.",
    location: {
      city: "Noida",
      locality: "Sector 137",
      address: "Sector 137, Noida",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 5200000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1150,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Club House",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1012",
    title: "3 BHK Apartment in Sector 150 Noida",
    description:
      "Premium 3 BHK apartment near green spaces and major roads.",
    location: {
      city: "Noida",
      locality: "Sector 150",
      address: "Sector 150, Noida",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 9200000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1850,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    ],
    amenities: [
      "Park",
      "Gym",
      "Club House",
      "Swimming Pool",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1013",
    title: "1 BHK Apartment in Sector 62",
    description:
      "Compact apartment suitable for professionals working nearby.",
    location: {
      city: "Noida",
      locality: "Sector 62",
      address: "Sector 62, Noida",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 650,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1014",
    title: "4 BHK Villa in Noida Sector 128",
    description:
      "Large luxury villa with spacious rooms and private parking.",
    location: {
      city: "Noida",
      locality: "Sector 128",
      address: "Sector 128, Noida",
    },
    type: "Villa",
    listingType: "Sale",
    price: 18500000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 3500,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Garden",
      "Private Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  // ============================================================
  // GURGAON
  // ============================================================

  {
    propertyId: "PROP_1015",
    title: "2 BHK Apartment in Sector 57 Gurgaon",
    description:
      "Well-maintained 2 BHK apartment in a gated community.",
    location: {
      city: "Gurgaon",
      locality: "Sector 57",
      address: "Sector 57, Gurgaon",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 7800000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1250,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753051-1e5e6f7c0b12",
    ],
    amenities: [
      "Gym",
      "Security",
      "Lift",
      "Club House",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1016",
    title: "3 BHK Luxury Apartment in Golf Course Road",
    description:
      "Premium apartment with modern amenities and excellent connectivity.",
    location: {
      city: "Gurgaon",
      locality: "Golf Course Road",
      address: "Golf Course Road, Gurgaon",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 16500000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2450,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Club House",
      "Concierge",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1017",
    title: "2 BHK Furnished Rental in DLF Phase 3",
    description:
      "Furnished rental apartment close to major business districts.",
    location: {
      city: "Gurgaon",
      locality: "DLF Phase 3",
      address: "DLF Phase 3, Gurgaon",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 42000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Security",
      "Power Backup",
      "Lift",
      "Parking",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1018",
    title: "4 BHK Villa in Golf Course Extension",
    description:
      "Spacious independent villa with garden and multiple parking spaces.",
    location: {
      city: "Gurgaon",
      locality: "Golf Course Extension Road",
      address: "Golf Course Extension Road, Gurgaon",
    },
    type: "Villa",
    listingType: "Sale",
    price: 24000000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 4200,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    amenities: [
      "Garden",
      "Private Parking",
      "Club House",
      "Security",
    ],
    available: true,
  },

  // ============================================================
  // DELHI
  // ============================================================

  {
    propertyId: "PROP_1019",
    title: "2 BHK Apartment in Dwarka",
    description:
      "Comfortable 2 BHK apartment in a well-connected residential area.",
    location: {
      city: "Delhi",
      locality: "Dwarka",
      address: "Dwarka, New Delhi",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 6200000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1150,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    amenities: [
      "Park",
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1020",
    title: "3 BHK Apartment in Saket",
    description:
      "Spacious 3 BHK home in a premium South Delhi locality.",
    location: {
      city: "Delhi",
      locality: "Saket",
      address: "Saket, New Delhi",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 14500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1850,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    amenities: [
      "Security",
      "Parking",
      "Lift",
      "Garden",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1021",
    title: "1 BHK Furnished Apartment in Lajpat Nagar",
    description:
      "Fully furnished compact apartment suitable for working professionals.",
    location: {
      city: "Delhi",
      locality: "Lajpat Nagar",
      address: "Lajpat Nagar, New Delhi",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 24000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 600,
    parking: false,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1022",
    title: "4 BHK House in Vasant Kunj",
    description:
      "Large independent house with parking and spacious living areas.",
    location: {
      city: "Delhi",
      locality: "Vasant Kunj",
      address: "Vasant Kunj, New Delhi",
    },
    type: "House",
    listingType: "Sale",
    price: 22000000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3600,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  // ============================================================
  // MUMBAI
  // ============================================================

  {
    propertyId: "PROP_1023",
    title: "1 BHK Apartment in Andheri West",
    description:
      "Compact apartment in a popular Mumbai residential locality.",
    location: {
      city: "Mumbai",
      locality: "Andheri West",
      address: "Andheri West, Mumbai",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 11500000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 620,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Gym",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1024",
    title: "2 BHK Sea View Apartment in Powai",
    description:
      "Premium 2 BHK apartment in a modern residential complex.",
    location: {
      city: "Mumbai",
      locality: "Powai",
      address: "Powai, Mumbai",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 18500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Club House",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1025",
    title: "2 BHK Rental Apartment in Thane",
    description:
      "Well-connected apartment with modern community facilities.",
    location: {
      city: "Mumbai",
      locality: "Thane",
      address: "Thane, Mumbai Metropolitan Region",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 38000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1050,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Gym",
      "Lift",
      "Security",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1026",
    title: "3 BHK Luxury Apartment in Bandra",
    description:
      "Premium spacious residence in one of Mumbai's sought-after localities.",
    location: {
      city: "Mumbai",
      locality: "Bandra West",
      address: "Bandra West, Mumbai",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 42000000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2100,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    ],
    amenities: [
      "Gym",
      "Concierge",
      "Security",
      "Parking",
      "Club House",
    ],
    available: true,
  },

  // ============================================================
  // BANGALORE
  // ============================================================

  {
    propertyId: "PROP_1027",
    title: "2 BHK Apartment in Whitefield",
    description:
      "Modern apartment close to Bengaluru's technology corridor.",
    location: {
      city: "Bangalore",
      locality: "Whitefield",
      address: "Whitefield, Bangalore",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 6500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1180,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    amenities: [
      "Gym",
      "Swimming Pool",
      "Club House",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1028",
    title: "3 BHK Apartment in Sarjapur Road",
    description:
      "Family-friendly apartment with large living areas and amenities.",
    location: {
      city: "Bangalore",
      locality: "Sarjapur Road",
      address: "Sarjapur Road, Bangalore",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 9800000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1750,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    amenities: [
      "Gym",
      "Pool",
      "Garden",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1029",
    title: "1 BHK Furnished Apartment in Koramangala",
    description:
      "Fully furnished apartment suitable for professionals.",
    location: {
      city: "Bangalore",
      locality: "Koramangala",
      address: "Koramangala, Bangalore",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 28000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 700,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Power Backup",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1030",
    title: "4 BHK Villa in Electronic City",
    description:
      "Large independent villa with garden and private parking.",
    location: {
      city: "Bangalore",
      locality: "Electronic City",
      address: "Electronic City, Bangalore",
    },
    type: "Villa",
    listingType: "Sale",
    price: 14500000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3000,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  // ============================================================
  // HYDERABAD
  // ============================================================

  {
    propertyId: "PROP_1031",
    title: "2 BHK Apartment in Gachibowli",
    description:
      "Modern apartment close to Hyderabad's IT corridor.",
    location: {
      city: "Hyderabad",
      locality: "Gachibowli",
      address: "Gachibowli, Hyderabad",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 5800000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    amenities: [
      "Gym",
      "Pool",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1032",
    title: "3 BHK Apartment in Kondapur",
    description:
      "Spacious 3 BHK apartment with community amenities.",
    location: {
      city: "Hyderabad",
      locality: "Kondapur",
      address: "Kondapur, Hyderabad",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 8200000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1650,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    amenities: [
      "Gym",
      "Club House",
      "Security",
      "Garden",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1033",
    title: "2 BHK Furnished Rental in Hitech City",
    description:
      "Furnished rental apartment close to offices and transport links.",
    location: {
      city: "Hyderabad",
      locality: "Hitech City",
      address: "Hitech City, Hyderabad",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 30000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1150,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Gym",
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1034",
    title: "3 BHK Villa in Jubilee Hills",
    description:
      "Premium independent villa with spacious rooms and private parking.",
    location: {
      city: "Hyderabad",
      locality: "Jubilee Hills",
      address: "Jubilee Hills, Hyderabad",
    },
    type: "Villa",
    listingType: "Sale",
    price: 21000000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 3400,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Garden",
      "Private Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  // ============================================================
  // PUNE
  // ============================================================

  {
    propertyId: "PROP_1035",
    title: "2 BHK Apartment in Hinjewadi",
    description:
      "Modern apartment close to Pune's major IT parks.",
    location: {
      city: "Pune",
      locality: "Hinjewadi",
      address: "Hinjewadi, Pune",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 5400000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    amenities: [
      "Gym",
      "Pool",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1036",
    title: "3 BHK Apartment in Baner",
    description:
      "Spacious premium apartment in a popular Pune locality.",
    location: {
      city: "Pune",
      locality: "Baner",
      address: "Baner, Pune",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 9200000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1750,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Gym",
      "Club House",
      "Garden",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1037",
    title: "1 BHK Furnished Rental in Kharadi",
    description:
      "Furnished apartment near Pune's business and IT districts.",
    location: {
      city: "Pune",
      locality: "Kharadi",
      address: "Kharadi, Pune",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 22000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 680,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1038",
    title: "4 BHK Villa in Wakad",
    description:
      "Spacious family villa with garden and parking.",
    location: {
      city: "Pune",
      locality: "Wakad",
      address: "Wakad, Pune",
    },
    type: "Villa",
    listingType: "Sale",
    price: 13500000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2900,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  // ============================================================
  // CHENNAI
  // ============================================================

  {
    propertyId: "PROP_1039",
    title: "2 BHK Apartment in OMR",
    description:
      "Modern apartment close to Chennai's IT corridor.",
    location: {
      city: "Chennai",
      locality: "OMR",
      address: "Old Mahabalipuram Road, Chennai",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 4800000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1120,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    amenities: [
      "Gym",
      "Pool",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1040",
    title: "3 BHK Apartment in Anna Nagar",
    description:
      "Large family apartment in an established Chennai locality.",
    location: {
      city: "Chennai",
      locality: "Anna Nagar",
      address: "Anna Nagar, Chennai",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 10500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1900,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    amenities: [
      "Parking",
      "Security",
      "Lift",
      "Garden",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1041",
    title: "2 BHK Furnished Rental in Velachery",
    description:
      "Comfortable furnished rental apartment with parking.",
    location: {
      city: "Chennai",
      locality: "Velachery",
      address: "Velachery, Chennai",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 26000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  // ============================================================
  // KOLKATA
  // ============================================================

  {
    propertyId: "PROP_1042",
    title: "2 BHK Apartment in New Town",
    description:
      "Modern apartment in a planned residential neighborhood.",
    location: {
      city: "Kolkata",
      locality: "New Town",
      address: "New Town, Kolkata",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 4300000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1080,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    amenities: [
      "Gym",
      "Pool",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1043",
    title: "3 BHK Apartment in Salt Lake",
    description:
      "Spacious family apartment with parking and security.",
    location: {
      city: "Kolkata",
      locality: "Salt Lake",
      address: "Salt Lake, Kolkata",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 7200000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1650,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Security",
      "Parking",
      "Lift",
      "Garden",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1044",
    title: "1 BHK Furnished Rental in Ballygunge",
    description:
      "Compact furnished apartment in a premium residential locality.",
    location: {
      city: "Kolkata",
      locality: "Ballygunge",
      address: "Ballygunge, Kolkata",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 20000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 650,
    parking: false,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Power Backup",
    ],
    available: true,
  },

  // ============================================================
  // JAIPUR
  // ============================================================

  {
    propertyId: "PROP_1045",
    title: "2 BHK Apartment in Vaishali Nagar",
    description:
      "Affordable family apartment in a well-connected Jaipur locality.",
    location: {
      city: "Jaipur",
      locality: "Vaishali Nagar",
      address: "Vaishali Nagar, Jaipur",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 3900000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Security",
      "Lift",
      "Parking",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1046",
    title: "3 BHK Villa in Jagatpura",
    description:
      "Spacious villa with garden and private parking.",
    location: {
      city: "Jaipur",
      locality: "Jagatpura",
      address: "Jagatpura, Jaipur",
    },
    type: "Villa",
    listingType: "Sale",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2200,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1047",
    title: "2 BHK Furnished Rental in Malviya Nagar",
    description:
      "Furnished rental property close to shopping and offices.",
    location: {
      city: "Jaipur",
      locality: "Malviya Nagar",
      address: "Malviya Nagar, Jaipur",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 18000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1050,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  // ============================================================
  // MORE LUCKNOW DATA FOR PAGINATION TESTING
  // ============================================================

  {
    propertyId: "PROP_1048",
    title: "2 BHK Apartment in Vrindavan Yojna",
    description:
      "Affordable apartment in a growing residential neighborhood.",
    location: {
      city: "Lucknow",
      locality: "Vrindavan Yojna",
      address: "Vrindavan Yojna, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 3800000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1080,
    parking: true,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    amenities: [
      "Security",
      "Lift",
      "Park",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1049",
    title: "2 BHK Apartment in Ashiyana",
    description:
      "Comfortable residential apartment with parking.",
    location: {
      city: "Lucknow",
      locality: "Ashiyana",
      address: "Ashiyana, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 4100000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1150,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1050",
    title: "2 BHK Apartment in Jankipuram",
    description:
      "Budget-friendly apartment for families.",
    location: {
      city: "Lucknow",
      locality: "Jankipuram",
      address: "Jankipuram, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 3300000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    parking: false,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Security",
      "Park",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1051",
    title: "2 BHK Apartment in Faizabad Road",
    description:
      "Modern apartment with easy access to major roads.",
    location: {
      city: "Lucknow",
      locality: "Faizabad Road",
      address: "Faizabad Road, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 4500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    amenities: [
      "Gym",
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1052",
    title: "3 BHK Apartment in Alambagh",
    description:
      "Spacious apartment with convenient city connectivity.",
    location: {
      city: "Lucknow",
      locality: "Alambagh",
      address: "Alambagh, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 5600000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1500,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1053",
    title: "3 BHK Apartment in Sushant Golf City",
    description:
      "Premium apartment inside a large residential development.",
    location: {
      city: "Lucknow",
      locality: "Sushant Golf City",
      address: "Sushant Golf City, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 7200000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1750,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
    amenities: [
      "Golf Course",
      "Gym",
      "Pool",
      "Security",
      "Club House",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1054",
    title: "3 BHK House in Rajajipuram",
    description:
      "Independent family house with parking.",
    location: {
      city: "Lucknow",
      locality: "Rajajipuram",
      address: "Rajajipuram, Lucknow",
    },
    type: "House",
    listingType: "Sale",
    price: 6500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1800,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    amenities: [
      "Parking",
      "Garden",
      "Security",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1055",
    title: "1 BHK Apartment in Gomti Nagar",
    description:
      "Compact apartment for individuals or couples.",
    location: {
      city: "Lucknow",
      locality: "Gomti Nagar",
      address: "Gomti Nagar, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 2800000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 720,
    parking: true,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
    amenities: [
      "Security",
      "Lift",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1056",
    title: "4 BHK House in Aliganj",
    description:
      "Large independent house suitable for a family.",
    location: {
      city: "Lucknow",
      locality: "Aliganj",
      address: "Aliganj, Lucknow",
    },
    type: "House",
    listingType: "Sale",
    price: 9800000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2700,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1057",
    title: "2 BHK Rental Apartment in Indira Nagar",
    description:
      "Semi-furnished apartment available for rent.",
    location: {
      city: "Lucknow",
      locality: "Indira Nagar",
      address: "Indira Nagar, Lucknow",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 22000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    parking: true,
    furnished: "Semi-Furnished",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    amenities: [
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1058",
    title: "3 BHK Rental Apartment in Hazratganj",
    description:
      "Premium furnished rental apartment in central Lucknow.",
    location: {
      city: "Lucknow",
      locality: "Hazratganj",
      address: "Hazratganj, Lucknow",
    },
    type: "Apartment",
    listingType: "Rent",
    price: 45000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1800,
    parking: true,
    furnished: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    ],
    amenities: [
      "Gym",
      "Security",
      "Lift",
      "Power Backup",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1059",
    title: "2 BHK Apartment Without Parking in Lucknow",
    description:
      "Affordable apartment for buyers who do not require parking.",
    location: {
      city: "Lucknow",
      locality: "Chinhat",
      address: "Chinhat, Lucknow",
    },
    type: "Apartment",
    listingType: "Sale",
    price: 2900000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 980,
    parking: false,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    ],
    amenities: [
      "Security",
      "Park",
    ],
    available: true,
  },

  {
    propertyId: "PROP_1060",
    title: "Residential Plot in Faizabad Road",
    description:
      "Residential plot suitable for building a family home.",
    location: {
      city: "Lucknow",
      locality: "Faizabad Road",
      address: "Faizabad Road, Lucknow",
    },
    type: "Plot",
    listingType: "Sale",
    price: 4800000,
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 1800,
    parking: false,
    furnished: "Unfurnished",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    ],
    amenities: [
      "Road Access",
      "Water Supply",
      "Electricity",
    ],
    available: true,
  },
];

async function seedProperties() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected.");

    await Property.deleteMany({});

    console.log("Old property data removed.");

    const insertedProperties =
      await Property.insertMany(properties);

    console.log(
      `${insertedProperties.length} properties inserted successfully.`
    );

    console.log(
      "Property seeding completed successfully."
    );
  } catch (error) {
    console.error(
      "Property seeding failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log(
      "MongoDB connection closed."
    );
  }
}

seedProperties();