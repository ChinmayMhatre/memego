import { getDb } from '../config/database';
import { Request, Response } from 'express';

export const createUserObject = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const userRef = db.collection('users');

    if (!req.body.walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // check if user already exists with wallet address
    const user = await userRef.where('walletAddress', '==', req.body.walletAddress).get();
    if (!user.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await userRef.add({
      ...req.body,
      createdAt: new Date()
    });   
    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  // Get user by wallet address
  try {
    const db = getDb();
    const userRef = db.collection('users');
    const user = await userRef.where('walletAddress', '==', req.params.walletAddress).get();
    if (user.empty) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ userData: user.docs[0].data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const addClaimedPoints = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const userRef = db.collection('users');
    // add dummy data to user

    console.log(req.params.walletAddress);
    // firebase get user by wallet address
    const user = await userRef.where('walletAddress', '==', req.params.walletAddress).get();
    if (user.empty) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = user.docs[0].data();
    // check if claimedPoints exists
    if (!userData.claimedPoints) {
      userData.claimedPoints = [];
    }
    userData.claimedPoints.push({
      coinType: req.body.coinType,
      coinAddress: req.body.coinAddress,
      points: req.body.points
    });
    await userRef.doc(user.docs[0].id).update(userData);
    return res.status(200).json({ message: 'Claimed points added successfully' });
  } catch (error) {
    console.error('Error adding claimed points:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};