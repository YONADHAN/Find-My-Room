import mongoose, { Schema, model, models } from 'mongoose'

const RoomSchema = new Schema(
  {
    // ✅ Linked to a specific location
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },

    // ✅ Basic room details
    size: { type: String, required: true }, // e.g., "Single Room", "1 RK"
    propertyType: { type: String, required: true }, // "Room", "Flat", "PG"
    furnishingStatus: { type: String, required: true }, // "Furnished", "Semi-furnished", "Unfurnished"
    rent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    floorNumber: { type: String },

    // ✅ Facilities & features
    facilities: { type: [String], default: [] }, // ["AC", "Fridge", "Washing Machine"]
    parking: { type: [String], default: [] }, // ["Car", "Bike"]
    distanceToBusStop: { type: String },
    distanceToMetro: { type: String },
    nearestBusStop: { type: String },
    nearestMetro: { type: String },

    // ✅ Who can stay (MULTIPLE allowed)
    allowedFor: {
      type: [String],
      enum: ['Bachelors', 'Family', 'Mixed'],
      default: ['Mixed'],
      validate: {
        validator: function (value: string[]) {
          return value.length > 0
        },
        message: 'At least one option must be selected for allowedFor',
      },
    },

    // ✅ Separate allowed counts
    bachelorsAllowed: { type: Number, default: 0 },
    familyMembersAllowed: { type: Number, default: 0 },
    mixedMembersAllowed: { type: Number, default: 0 },

    // ✅ Additional info
    extraCharges: { type: String },
    readyForRent: { type: Boolean, default: true },
    suitableFor: { type: [String], default: [] }, // ["Students", "Working Professionals"]
    mapLink: { type: String },
    petAllowed: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    additionalInfo: { type: String },

    // ✅ Media
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
  },
  { timestamps: true }
)

// ✅ Indexes for better performance
RoomSchema.index({ location: 1, rent: 1 })
RoomSchema.index({ propertyType: 1, furnishingStatus: 1 })
RoomSchema.index({ tags: 1 })

const Room = models.Room || model('Room', RoomSchema)
export default Room
