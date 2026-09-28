import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      city: {
        type: String,
        required: true,
        index: true,
      },

      locality: {
        type: String,
        default: "",
        index: true,
      },

      address: {
        type: String,
        default: "",
      },
    },

    type: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "House",
        "Plot",
        "Commercial",
      ],
      required: true,
      index: true,
    },

    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      default: "Sale",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
      index: true,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    areaSqft: {
      type: Number,
      default: 0,
      index: true,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    furnished: {
      type: String,
      enum: [
        "Furnished",
        "Semi-Furnished",
        "Unfurnished",
      ],
      default: "Unfurnished",
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    available: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({
  "location.city": 1,
  "location.locality": 1,
  price: 1,
  bedrooms: 1,
});

const Property = mongoose.model(
  "Property",
  propertySchema
);

export default Property;