
user = 
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    nickname: {
      type: String,
      required: false,
      trim: true
    },
    currency: {
      type: String,
      required: false,
      trim: true
    },
    keywords: {
      type: Array,
      required: false,
      trim: true
    },
    rank: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  };