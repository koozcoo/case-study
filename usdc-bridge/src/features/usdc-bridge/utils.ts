import Big from 'big.js';

export const strToBigInt = (value: string, nDecimals: number) => {
    return Big(value.replace(',', '.')).times(10 ** nDecimals);
};

export const easyReadToBigStr = (value: string, nDecimals: number) => {
    return Big(value.replace(',', '.')).times(10 ** nDecimals).toString();
};
