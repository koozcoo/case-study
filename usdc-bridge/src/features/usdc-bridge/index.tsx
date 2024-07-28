import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BroadcastTxError, Coin, DeliverTxResponse, SigningStargateClient, TimeoutError } from "@cosmjs/stargate";
import Big from 'big.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { cctpTypes, errorMessage, formPattern, nobleChainInfos } from './config';
import { Input } from '../../components/Input';
import { ErrorMessage } from './types';
import { easyReadToBigStr, strToBigInt } from './utils';
import { burnDeposit } from './burn-deposit';
import { useKeplrWallet } from './useKeplrWallet';

export const UsdcBridge: React.FC<object> = () => {
    const [nobleAddr, setNobleAddress] = useState('nobleXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    const [nobleUsdcBalance, setNobleUsdcBalance] = useState('0');
    const [usdcAmount, setUsdcAmount] = useState('');
    const [ethRecipientAddr, setEthRecipientAddr] = useState('');
    const [errors, setError] = useState<ErrorMessage>({});
    const [loading, setLoading] = useState(false);

    const { client, account } = useKeplrWallet({
        chainId: nobleChainInfos.chainId,
        chainRpc: nobleChainInfos.rpc,
        registryTypes: cctpTypes
    });

    useEffect(() => {
        (async () => {
            if (!client || !account) {
                return;
            }

            const balances = await client.getAllBalances(account.address);
            const nobleUsdcBalance = getNobleUsdcBalance(balances);

            setNobleAddress(account.address);
            setNobleUsdcBalance(nobleUsdcBalance);
        })();
    }, [client, account]);

    const getNobleUsdcBalance = (balances: readonly Coin[]) => {
        const result = balances.find(balance => balance.denom === nobleChainInfos.usdcDenom);
        if (result) {
            return result.amount;
        }

        return '0'.repeat(nobleChainInfos.coinDecimals);
    };

    const getEasyReadNobleUsdcBalance = (balance: string) => {
        return (Big(balance).div(10 ** nobleChainInfos.coinDecimals)).toFixed(2).toString();
    }

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!formPattern.amount.regexp.test(value)) {
            return;
        }

        setUsdcAmount(value);

        if (value && strToBigInt(value, nobleChainInfos.coinDecimals).gte(Big(nobleUsdcBalance))) {
            setError((prevError) => ({
                ...prevError,
                balanceError: errorMessage.availableBalanceError
            }))
        } else {
            setError((prevError) => ({
                ...prevError,
                balanceError: ''
            }))
        }
    };

    const handleRecipientAddrChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setEthRecipientAddr(value.toLowerCase());

        if (value && !validateEthAddr(value)) {
            setError((prevError) => ({
                ...prevError,
                ethAddrFormatError: errorMessage.ethAddrrFormatError
            }))
        } else {
            setError((prevError) => ({
                ...prevError,
                ethAddrFormatError: ''
            }))
        }
    };

    const validateAmount = (value: string) => {
        return value && formPattern.amount.regexp.test(value) &&
            strToBigInt(value, nobleChainInfos.coinDecimals).lt(Big(nobleUsdcBalance));
    };

    const validateEthAddr = (value: string) => {
        return value && formPattern.ethAddr.regexp.test(value);
    };

    const handleTxSuccess = async (result: DeliverTxResponse) => {
        const burnTxLink = `https://mintscan.io/noble-testnet/tx/${result.transactionHash}`;
        const mintTxLink = `https://sepolia.etherscan.io/address/${ethRecipientAddr}`

        toast.success(
            <>
                <p>Burned on Noble: <a href={burnTxLink} target='_blank'>{burnTxLink}</a></p>
                <p>Minting on Ethereum to: <a href={mintTxLink} target='_blank'>{mintTxLink}</a></p>
            </>
        );

        const balances = await (client as SigningStargateClient).getAllBalances(nobleAddr);
        const nobleUsdcBalance = getNobleUsdcBalance(balances);

        setNobleUsdcBalance(nobleUsdcBalance);
        setUsdcAmount('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateAmount(usdcAmount) ||
            !validateEthAddr(ethRecipientAddr)) {
            return;
        }

        setLoading(true);

        try {
            const result = await burnDeposit({
                ethRecipientAddr,
                nobleAddr,
                client: client as SigningStargateClient,
                amount: easyReadToBigStr(usdcAmount, nobleChainInfos.coinDecimals)
            });

            // console.log(result);

            if (result?.code === 0) {
                handleTxSuccess(result);
            } else {
                toast.error(`${errorMessage.txCodeError} ${result?.code}`);
            }
        } catch (e) {
            if (e instanceof BroadcastTxError) {
                toast.error(`${errorMessage.txBroadcastError} ${e.log}`);
            } else if (e instanceof TimeoutError) {
                const txErrorLink = `https://mintscan.io/noble-testnet/tx/${e.txId}`;

                toast.error(
                    <>
                        {errorMessage.txTimeoutError} <a href={txErrorLink} target='_blank'>{txErrorLink}</a>
                    </>
                )
            } else {
                toast.error(errorMessage.txUnknownError);
            }
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = () => {
        return !validateAmount(usdcAmount) || !validateEthAddr(ethRecipientAddr) || loading;
    }

    return (
        <section>
            <h3 className="text-lg font-bold mb-8">Bridge USDC from Noble to Ethereum</h3>
            <div className="flex justify-center flex-wrap container sm w-full max-w-128">
                <p className="flex justify-between items-center w-full my-1">
                    <span className="text-xs md:text-sm text-ellipsis overflow-hidden">{nobleAddr}</span>
                    <span className="font-bold shrink-0">{getEasyReadNobleUsdcBalance(nobleUsdcBalance)} USDC</span>
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full h-128 border border-orange-300 p-4 sm:p-8 justify-around">
                    <h4 className="text-lg">Transfer USDC</h4>
                    <p>
                        <Input
                            value={usdcAmount}
                            onChange={handleAmountChange}
                            required
                            id="amount"
                            name="amount"
                            pattern={formPattern.amount.string}
                            label="Amount" />
                        {errors['balanceError'] && (
                            <span className="block text-rose-600 mt-2">{errors['balanceError']}</span>
                        )}
                    </p>

                    <p>
                        <Input
                            value={ethRecipientAddr}
                            onChange={handleRecipientAddrChange}
                            required
                            id="address"
                            name="address"
                            pattern={formPattern.ethAddr.string}
                            label="ETH recipient address" />
                        {errors['ethAddrFormatError'] && (
                            <span className="block text-rose-600 mt-2">{errors['ethAddrFormatError']}</span>
                        )}
                    </p>
                    <button
                        style={{opacity: isDisabled() ? 0.6 : 1 }}
                        disabled={isDisabled()}
                        className="w-full rounded-none bg-orange-500 text-white border-none">
                        {loading ? 'Bridge in progress...' : 'Bridge'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </section >
    );
};
