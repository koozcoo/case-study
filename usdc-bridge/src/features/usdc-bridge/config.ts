import { GeneratedType } from '@cosmjs/proto-signing';
import { MsgDepositForBurn } from './generated/tx';

export const nobleChainInfos  = {
    chainId: 'grand-1',
    rpc: 'https://noble-testnet-rpc.polkachu.com:443',
    usdcDenom: 'uusdc',
    coinDecimals: 6
};

export const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
    ['/circle.cctp.v1.MsgDepositForBurn', MsgDepositForBurn],
];

export const formPattern = {
    amount: {
        string: '^[0-9]*[.,]?[0-9]*$',
        regexp: new RegExp('^[0-9]*[.,]?[0-9]*$')
    },
    ethAddr: {
        string: '^0x[a-f0-9]{40}',
        regexp: new RegExp('^0x[a-fA-F0-9]{40}')
    }
};

export const errorMessage = {
    availableBalanceError: 'Insufficient USDC balance.',
    ethAddrrFormatError: 'The Ethereum address is not properly formatted.',
    txBroadcastError: 'Transaction broadcast error: ',
    txTimeoutError: 'Transaction timeout error at:',
    txUnknownError: 'Something wrong happened.',
    txCodeError: 'Transaction error with code: ',
};