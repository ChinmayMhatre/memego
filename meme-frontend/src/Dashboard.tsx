import React, { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'

interface Point {
    lng: number;
    lat: number;
    id: string;
}

interface ClaimedPoint {
    coinType: string;
    points: Point[];
    coinAddress: string;
}

interface UserData {
    walletAddress: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    claimedPoints: ClaimedPoint[];
}

interface UserResponse {
    userData: UserData;
}

const Dashboard = () => {
    const { authenticated, ready, logout, user } = usePrivy()
    const navigate = useNavigate()
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        if (!authenticated && ready) {
            navigate('/login')
        }
    }, [authenticated, ready, navigate])

    useEffect(() => {
        const fetchUserData = async () => {
            console.log(user);
            
            if (authenticated && ready && user?.wallet?.address) {
                try {
                    const response = await fetch(`https://memego.onrender.com/api/users/${user.wallet.address}`);
                    const data: UserResponse = await response.json();
                    console.log(data);
                    
                    setUserData(data.userData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [authenticated, ready, user]);

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className=' p-7  bg-gradient w-full'>
            <div className="flex justify-between items-center">
                <h1 className='text-xl font-bold text-white'>Welcome Back, <span className='text-blue-600 text-2xl '>{userData?.walletAddress || 'Loading...'}</span></h1>
                <Button onClick={handleLogout} variant={'outline'}>
                    <LogOut className='w-4 h-4 text-black'/>
                </Button>
            </div>
            <div className="flex pt-8 justify-center gap-4">
                <div className="p-4 w-full bg-white flex justify-between items-center rounded-lg">
                    <h1 className='text-lg font-bold text-blue-600'>Portfolio Value</h1>
                    <p className='text-lg font-bold'>$100</p>
                </div>
            </div>
            <h2 className='text-lg text-white font-bold mt-4'>Your Memecoins</h2>
            <div className="bg-white rounded-lg mt-2 pb-4 px-2">
                {userData?.claimedPoints?.map((point, index) => (        
                    <div key={index} className="flex justify-between pt-4 px-4 items-center">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-green-400 rounded-full"></div>
                            <div className="flex flex-col">
                                <p className=' font-bold'>{point.coinType}</p>
                                <p className='text-sm text-gray-500'>{point.coinAddress}</p>
                            </div>
                        </div>
                        <p className='text-sm text-blue-600 font-bold'>$100</p>
                    </div>
                ))}
                {!userData?.claimedPoints?.length && (
                    <div className="p-4 text-center text-gray-500">
                        No memecoins claimed yet
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard