import { AccountData, GeneratedType, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { useEffect, useState } from "react";


interface WalletInfos {
    client: SigningStargateClient | null;
    account: AccountData | null;
}

interface UseKeplrWalletprops {
    chainId: string;
    chainRpc: string;
    registryTypes: Iterable<[string, GeneratedType]>;
}

export const useKeplrWallet = ({ chainId, chainRpc, registryTypes }: UseKeplrWalletprops) => {
    const [{ client, account }, setVariables] = useState<WalletInfos>({ client: null, account: null });

    useEffect(() => {
        (async () => {
            if (!window.keplr) {
                alert("Please install keplr extension");
                return;
            }

            await window.keplr.enable(chainId);
            const offlineSigner = window.keplr.getOfflineSigner(chainId);

            const [account] = await offlineSigner.getAccounts();
            const _client = await SigningStargateClient.connectWithSigner(
                chainRpc,
                offlineSigner,
                {
                    registry: new Registry(registryTypes)
                }
            );

            setVariables({
                client: _client,
                account
            });
        })();
    }, [chainId, chainRpc, registryTypes]);

    return { client, account };
};