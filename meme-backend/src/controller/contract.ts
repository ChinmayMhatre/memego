import { Request, Response } from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { getDb } from '../config/database';

dotenv.config();

// ERC20 ABI for transfer function
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

interface Location {
    latitude: number;
    longitude: number;
    id: string;
}

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export async function sendMemeCoins(req: AuthenticatedRequest, res: Response) {
    try {
        const { walletAddress, lat, lng, id, coinType } = req.body;
        
        if (!walletAddress || !lat || !lng || !id || !coinType) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // fetch user object from database
        const db = getDb();
        const userRef = db.collection('users');
        const user =  await userRef.where('walletAddress', '==', walletAddress).get();

        // check if user exists
        if (user.empty) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        console.log(user.docs[0].data().$push.claimedPoints);

        // check if claimPoints include the lat and long of the location. If yes then return error cannot claim again at this location. ClaimPoints is an object.
        const claimedAtLocationPoints = user.docs[0].data().$push.claimedPoints.points;

        if (claimedAtLocationPoints.some((point: any) => point.lat === lat && point.lng === lng && point.id === id)) {
            return res.status(400).json({ 
                error: 'You have already claimed coins at this location' 
            });
        }

        // Check if the lat and long are valid in json file
        const pointsData = require('../../data/points.json');

        const validPoints = pointsData.some((point: { lat: number; lng: number; id: string }) => point.lat === lat && point.lng === lng && point.id === id);

        if (!validPoints) {
            return res.status(404).json({ 
                error: 'No meme coins available at this location' 
            });
        }

        // Send tokens using the distributor contract

         // Create wallet
         const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL);
         const privateKey = process.env.PRIVATE_KEY;
         
         if (!privateKey) {
             throw new Error('Private key not configured');
         }


        const wallet = new ethers.Wallet(privateKey, provider);

         // Create contract instance for the ERC20 token

        
        const coinAddress = pointsData.find((point: { id: string }) => point.id === id)?.coinAddress;
        const amount = pointsData.find((point: { id: string }) => point.id === id)?.amountToSend;

        const tokenContract = new ethers.Contract(coinAddress, ERC20_ABI, wallet);

        // Get token decimals
        const decimals = await tokenContract.decimals();
        
        // Convert amount to token units
        const tokenAmount = ethers.parseUnits(amount.toString(), decimals);

        // Send transaction
        const tx = await tokenContract.transfer(walletAddress, tokenAmount);
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();


        // Update user's claim history
        await userRef.doc(user.docs[0].id).update({
            $push: {
                claimedPoints: {
                    coinType: coinType,
                    coinAddress: coinAddress,
                    points: [{ lat: lat, lng: lng, id: id }]
                }
            }
        });

        return res.status(200).json({
            success: true,
            transaction: tx.hash,
            message: `Successfully sent ${tokenAmount} tokens to ${walletAddress}`
        });

    } catch (error) {
        console.error('Error sending meme coins:', error);
        return res.status(500).json({ 
            error: 'Failed to send meme coins' 
        });
    }
}
