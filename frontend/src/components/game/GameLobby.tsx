import React, { useState } from "react";
import { useWalletConnection } from "../../hooks/useWalletConnection";
import { TankBattleSDK } from "../../sdk/suiClient";

const GameLobby: React.FC = () => {
  const { connected, account, signAndExecuteTransactionBlock } =
    useWalletConnection();
  const [sdk] = useState(() => new TankBattleSDK());
  const [joining, setJoining] = useState(false);

  const joinArena = async (arenaId: string, entryFee: number) => {
    if (!connected || !account) return;

    setJoining(true);
    try {
      const txb = await sdk.joinArena(arenaId, entryFee);
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log("Joined arena:", result);
    } catch (error) {
      console.error("Join failed:", error);
    } finally {
      setJoining(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center text-white">
        <p>Vui lòng kết nối ví để tham gia game</p>
      </div>
    );
  }

  return (
    <div className="bg-game-primary p-6 rounded-lg">
      <h2 className="text-white text-xl mb-4">Sảnh Game</h2>

      <div className="grid gap-4">
        <div className="bg-game-accent p-4 rounded border border-tank-green">
          <h3 className="text-tank-green font-bold">Arena Newbie</h3>
          <p className="text-white text-sm">Phí tham gia: 10 TANK</p>
          <p className="text-white text-sm">Người chơi: 2/4</p>
          <button
            onClick={() => joinArena("arena_1", 10)}
            disabled={joining}
            className="mt-2 bg-tank-green text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {joining ? "Đang tham gia..." : "Tham Gia"}
          </button>
        </div>

        <div className="bg-game-accent p-4 rounded border border-tank-red">
          <h3 className="text-tank-red font-bold">Arena Pro</h3>
          <p className="text-white text-sm">Phí tham gia: 50 TANK</p>
          <p className="text-white text-sm">Người chơi: 1/4</p>
          <button
            onClick={() => joinArena("arena_2", 50)}
            disabled={joining}
            className="mt-2 bg-tank-red text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {joining ? "Đang tham gia..." : "Tham Gia"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
