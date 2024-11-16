import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { User } from '../models/User';
// import CONTRACT_ABI from '../smart-contract/memego.json';


interface Location {
    latitude: number;
    longitude: number;
}

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

// Initialize provider and contract
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const contract = new ethers.Contract(
//     process.env.DISTRIBUTOR_CONTRACT_ADDRESS!,
//     CONTRACT_ABI,
//     new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
// );

export async function sendMemeCoins(req: AuthenticatedRequest, res: Response) {
    try {
        const { walletAddress, latitude, longitude } = req.body;
        
        if (!walletAddress || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // fetch user object from database
        const user = await User.findOne({ walletAddress });

        // check if claimPoints include the lat and long of the location. If yes then return error cannot claim again at this location
        const hasClaimedAtLocation = user?.claimedPoints?.some(coinClaim => 
            coinClaim.points.some(point => point.lat === latitude && point.lng === longitude)
        );

        if (hasClaimedAtLocation) {
            return res.status(400).json({ 
                error: 'You have already claimed coins at this location' 
            });
        }

        // Check if the lat and long are valid in json file
        const pointsData = require('../data/points.json');

        const validPoints = pointsData.points.some((point: { lat: number; lng: number; }) => point.lat === latitude && point.lng === longitude);

        if (!validPoints) {
            return res.status(404).json({ 
                error: 'No meme coins available at this location' 
            });
        }

        // Send tokens using the distributor contract
        const amount = ethers.parseEther(pointsData.amount.toString());
        // const tx = await contract.distributeMemeCoin(
        //     process.env.MEME_TOKEN_ADDRESS!, // The address of your meme token
        //     walletAddress,
        //     amount
        // );
        // await tx.wait();

        // Update user's claim history
        await User.findByIdAndUpdate(user?._id, {
            $push: {
                claimedPoints: {
                    coinType: 'MEME',
                    coinAddress: process.env.MEME_TOKEN_ADDRESS!,
                    points: [{ lat: latitude, lng: longitude }]
                }
            }
        });

        return res.status(200).json({
            success: true,
            // transaction: tx.hash,
            amount: pointsData.amount
        });

    } catch (error) {
        console.error('Error sending meme coins:', error);
        return res.status(500).json({ 
            error: 'Failed to send meme coins' 
        });
    }
}
