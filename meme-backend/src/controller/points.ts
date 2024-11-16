import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getPoints = async (req: Request, res: Response) => {
    // Get points from data json file and return them
    try {
        const points = require('../data/points.json');
        return res.status(200).json(points);
    } catch (error) {
        console.error('Error fetching points:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// get claimed points for a user
export const getClaimedPoints = async (req: Request, res: Response) => {
    try {
        const db = getDb();
        const userRef = db.collection('users');
        const user = await userRef.where('walletAddress', '==', req.params.walletAddress).get();

        if (user.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const claimedPoints = user.docs[0].data().claimedPoints || [];
        return res.status(200).json({ claimedPoints });
    } catch (error) {
        console.error('Error fetching claimed points:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};