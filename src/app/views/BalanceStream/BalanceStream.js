import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import env from "../../constants/env";


const BalanceStream = () => {
    const [isConnected, setIsConnected] = useState(false)
    const [socket, setSocket] = useState(null);
    const [socketData, setSocketData] = useState({
        walletAddress: "",
        chainType: "",
    })
    const [accountBalance, setAccountBalance] = useState(null);

    const handleOnChange = (e)=>{
        const {name, value} = e.target;
        console.log(name, value)
        setSocketData((prev)=>({
            ...prev,
            [name] : value
        }))
    }

    //     if (socketData?.walletAddress && socketData?.chainType) {
    //         // Create a new socket connection
    //         const socket = io(`https://sorobonhooks.dataconnect.shop/balance?apiKey=${env.apiKey}&address=${socketData?.walletAddress}&chainType=${socketData?.chainType}`);

    //         // Listen for balance events
    //         socket.on('balance', (data) => {
    //             console.log('Balance event received:', data);
    //         });

    //         // Listen for error events
    //         socket.on('error', (data) => {
    //             console.error('Error event received:', data);
    //         });

    //         // Handle connection errors
    //         socket.on('connect_error', (err) => {
    //             console.error('Connection error:', err.message);
    //         });

    //         // Cleanup previous socket connection on component unmount or dependency change
    //         return () => {
    //             socket.disconnect();
    //         };
    //     }
    // }, [socketData?.walletAddress, socketData?.chainType]); // Recreate socket when walletAddress or chainType changes

    const handleConnectAndDisConnectSocket = () => {
        if (socketData.walletAddress && socketData.chainType && !socket) {
            
            const socketUrl = `https://api.sorobanhooks.xyz/balance?apiKey=${env.apiKey}&address=${socketData.walletAddress}&chainType=${socketData.chainType}`;
    
            const socket = io(socketUrl, {
                transports: ['websocket'], // Specify transport type if necessary
            });
    
            socket.on('connect', () => {
                console.log('Socket connected successfully.');
                setIsConnected(true);
                setSocket(socket);
            });
            socket.on('balance', (data) => {
                console.log('Balance event received:', data);
                setAccountBalance(data)
            });
    
            socket.on('error', (data) => {
                setIsConnected(false);
                console.error('Error event received:', data);
            });
    
            socket.on('connect_error', (err) => {
                setIsConnected(false);
                console.error('Connection error:', err.message);
            });
    
        }else{
            socket.disconnect(); 
            setSocket(null); 
            setIsConnected(false); 
            console.log('Socket has been disconnected.');
        }
    };

    console.log("************",accountBalance)

    return (
    <div>
        <div className="flex justify-center items-center min-h-[70vh]">
        <div className="p-4 w-[50%] rounded-md shadow-xl">
            <h1 className="text-xl font-bold mb-4 text-center">Balance Stream</h1>
            
            <div className="mb-4">
                <label className="block mb-2 font-medium">Wallet Address:</label>
                <input
                    name="walletAddress"
                    type="text"
                    value={socketData?.walletAddress}
                    onChange={handleOnChange}
                    placeholder="Enter your wallet address"
                    className="w-full px-3 py-2 border rounded-lg text-black"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Chain Type:</label>
                <select
                    placeholder="Chain Type"
                    name="chainType"
                    value={socketData?.chainType}
                    onChange={handleOnChange}
                    className="w-full px-3 py-2 border rounded-lg "
                >
                    <option>Chain Type</option>
                    <option value="testnet">Testnet</option>
                    <option value="mainnet">Mainnet</option>
                </select>
            </div>
            <div className=' flex justify-center items-center'>
                <button
                    onClick={handleConnectAndDisConnectSocket}
                    className={`p-2 text-white mt-4 mb-4 rounded-xl w-[18rem] ${isConnected ? "bg-[#2c6a63]": "bg-[#7b0093]"}`}
                >
                    {isConnected ? "Disconnect" : "Connect"}
                </button>
            </div>
            {isConnected && (<p className="text-gray-600 text-center">
                Listening for balance events
            </p>)}
        </div>   
        </div>
        <div className="flex flex-col justify-center items-center min-h-[30vh] mx-auto space-y-4">
      {/* Iterate over data array */}
      {accountBalance && (
        <div className="mb-6 border rounded-lg p-4 shadow-lg">
          <p className="text-lg font-semibold text-gray-800">
            Address: <span className="text-blue-600">{accountBalance.address}</span>
          </p>
          <div className="mt-4">
            <h4 className="font-bold text-gray-700">Balances:</h4>
            {/* Iterate over balance array */}
            <ul className="mt-2 space-y-2">
              {accountBalance?.balance.map((asset, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-gray-100 p-2 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {asset.assetCode}
                  </span>
                  <span className="text-gray-900">{asset.balance}</span>
                </li>
              ))}
            </ul>
            </div>
            </div>
        )}
        </div>
    </div>
    );
};

export default BalanceStream;
