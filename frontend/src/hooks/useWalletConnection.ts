import { useState, useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { TankBattleSDK } from "../sdk/suiClient";

export const useWalletConnection = () => {
  const { connected, account, signAndExecuteTransactionBlock } = useWallet();
  const [sdk] = useState(() => new TankBattleSDK());
  const [userTanks, setUserTanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mintTank = async () => {
    if (!connected || !account) return;

    setLoading(true);
    try {
      const txb = await sdk.mintTank(account.address);
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log("Tank minted:", result);
      await loadUserTanks();
    } catch (error) {
      console.error("Mint failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTanks = async () => {
    if (!connected || !account) return;

    try {
      const tanks = await sdk.getTanksByOwner(account.address);
      setUserTanks(tanks.data || []);
    } catch (error) {
      console.error("Load tanks failed:", error);
    }
  };

  useEffect(() => {
    if (connected && account) {
      loadUserTanks();
    }
  }, [connected, account]);

  return {
    connected,
    account,
    userTanks,
    loading,
    mintTank,
    loadUserTanks,
  };
};
