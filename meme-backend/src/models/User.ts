import mongoose from 'mongoose';

interface ClaimedPoints {
  coinType: string;
  coinAddress: string;
  points: { lat: number; lng: number }[];
}

interface IUser {
  walletAddress: string;
  claimedPoints?: ClaimedPoints[];
}

interface Claim {
    latitude: number;
    longitude: number;
    timestamp: Date;
    amount: number;
}

const userSchema = new mongoose.Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  claimedPoints: {
    type: [{
      coinType: { type: String, required: true },
      coinAddress: { type: String, required: true },
      points: [{
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }]
    }],
    default: [],
    required: false,
  },
  claims: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date,
    amount: Number
  }]
}, {
  timestamps: true,
});

export const User = mongoose.model('User', userSchema); 