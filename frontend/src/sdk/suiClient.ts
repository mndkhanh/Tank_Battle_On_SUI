import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

export const PACKAGE_ID = "0x..."; // Will be set after deployment

export class TankBattleSDK {
  private client: SuiClient;

  constructor() {
    this.client = suiClient;
  }

  async mintTank(signer: string) {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${PACKAGE_ID}::game::mint_tank`,
      arguments: [],
    });

    return txb;
  }

  async joinArena(arenaId: string, entryFee: number) {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${PACKAGE_ID}::arena::join_match`,
      arguments: [txb.object(arenaId), txb.pure(entryFee)],
    });

    return txb;
  }

  async getTanksByOwner(owner: string) {
    return await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::game::Tank`,
      },
    });
  }
}
