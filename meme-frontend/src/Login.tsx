import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'https://memego.onrender.com/api';

const Login = () => {
  const { login, authenticated, ready, user } = usePrivy();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (authenticated && ready && user?.wallet?.address) {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`${API_BASE_URL}/users/${user.wallet.address}`);
          const data = await response.json();

          if (data.message === "User not found") {
            const res = await fetch(`${API_BASE_URL}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                walletAddress: user.wallet.address
              })
            });
            
            if (!res.ok) {
              throw new Error('Failed to create user');
            }
          }
          
          navigate("/");
        } catch (error) {
          setError(typeof error === 'string' ? error : 'Failed to process login');
          console.error("Error checking/creating user:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUser();
  }, [authenticated, ready, navigate, user]);

  return (
    <div className="w-screen flex justify-center items-center bg-gradient h-screen">
      <div className="flex flex-col gap-4 bg-white shadow-lg my-auto w-[90%] md:w-[50%] mx-auto rounded-xl min-h-96 justify-center items-center">
        <h1 className="text-2xl font-bold">Welcome to memego</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={() => login()}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Connect your wallet'}
        </button>
      </div>
    </div>
  );
};

export default Login;
