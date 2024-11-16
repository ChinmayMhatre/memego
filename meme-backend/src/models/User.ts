import mongoose from 'mongoose';

interface ClaimedPoints {
  coinType: string;
  coinAddress: string;
  points: { lat: number; lng: number, id: string }[];
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
        id: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }]
    }],
    default: [],
    required: false,
  }
}, {
  timestamps: true,
});

export const User = mongoose.model('User', userSchema); 