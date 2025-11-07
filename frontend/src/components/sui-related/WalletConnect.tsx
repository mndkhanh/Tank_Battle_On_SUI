import React from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";

const WalletConnect: React.FC = () => {
  const { connected, account } = useWallet();

  return (
    <div className="wallet-connect">
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Connected: {account?.address?.slice(0, 6)}...
          </span>
        </div>
      ) : null}
      <ConnectButton />
    </div>
  );
};

export default WalletConnect;
