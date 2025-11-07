import React from "react";
import { useWalletConnection } from "../../hooks/useWalletConnection";

const WalletStatus: React.FC = () => {
  const { connected, account, userTanks, loading, mintTank } =
    useWalletConnection();

  if (!connected) {
    return (
      <div className="bg-game-primary p-4 rounded-lg text-center">
        <p className="text-white mb-2">Kết nối ví để bắt đầu chơi</p>
      </div>
    );
  }

  return (
    <div className="bg-game-primary p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-white text-sm">Địa chỉ ví:</p>
          <p className="text-tank-green font-mono">
            {account?.address?.slice(0, 8)}...{account?.address?.slice(-6)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm">Số tank:</p>
          <p className="text-tank-green text-xl font-bold">
            {userTanks.length}
          </p>
        </div>
      </div>

      <button
        onClick={mintTank}
        disabled={loading}
        className="w-full bg-tank-green text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Đang tạo..." : "Tạo Tank Mới"}
      </button>
    </div>
  );
};

export default WalletStatus;
