import { Buffer } from 'buffer';
import { SigningStargateClient } from '@cosmjs/stargate';

interface BurnDepositArgs {
    ethRecipientAddr: string;
    nobleAddr: string;
    amount: string;
    client: SigningStargateClient;
}


export const burnDeposit = ({ ethRecipientAddr, nobleAddr, amount, client }: BurnDepositArgs) => {
    const rawMintRecipient = ethRecipientAddr;
    const cleanedMintRecipient = rawMintRecipient.replace(/^0x/, '');
    const zeroesNeeded = 64 - cleanedMintRecipient.length;
    const mintRecipient = '0'.repeat(zeroesNeeded) + cleanedMintRecipient;

    const buffer = Buffer.from(mintRecipient, 'hex');
    const mintRecipientBytes = new Uint8Array(buffer);

    const msg = {
        typeUrl: '/circle.cctp.v1.MsgDepositForBurn',
        value: {
            from: nobleAddr,
            amount,
            destinationDomain: 0,
            mintRecipient: mintRecipientBytes,
            burnToken: 'uusdc',
            // If using DepositForBurnWithCaller, add destinationCaller here
        }
    };

    const fee = {
        amount: [
            {
                denom: 'uusdc',
                amount: '0',
            },
        ],
        gas: '200000',
    };

    const memo = '';

    return client.signAndBroadcast(
        nobleAddr,
        [msg],
        fee,
        memo
    );
};
