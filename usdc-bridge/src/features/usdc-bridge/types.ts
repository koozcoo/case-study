export type ErrorName = 'ethAddrError' | 'balanceError';

export interface ErrorMessage {
    [name: string]: string;
}
