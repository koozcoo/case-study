
const API_ENDPOINT = 'https://mainnet.infura.io/v3/f1b70935143f4b22b3c165d6bdfd3021';

interface RpcMethodPayload {
    params: [
        `0x${string}`,
        'latest'
    ];
    id: number;
}

interface RpcData {
    jsonrpc: '2.0';
    id: number;
    result: `0x${string}`;
}

export const fetchBalance = (() => {
    const basePayload = {
        jsonrpc: '2.0',
        method: 'eth_getBalance'
    };

    let i = 1;
    let payload: RpcMethodPayload[] = [];
    let resPromise: Promise<RpcData[]> | null = null;

    return (addr: `0x${string}`) => {
        const id = i++;

        payload.push({
            params: [addr, 'latest'],
            id
        });

        return new Promise((resolve) => {
            queueMicrotask(async () => {
                if (payload.length > 0) {
                    i = 1;
                    const bodyData = payload.map(p => ({
                        ...basePayload,
                        ...p
                    }));

                    payload = [];

                    resPromise = new Promise((resolveBatch) => {
                        console.log("---> FETCH");

                        fetch(API_ENDPOINT, {
                            method: 'POST',
                            body: JSON.stringify(bodyData),
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(async (response) => {
                                return response.json();
                            })
                            .then(data => {
                                resolve(BigInt(data[0].result));
                                resolveBatch(data);
                            })
                            .catch(error => console.log('error:', error.message));
                    })
                } else {
                    if (!resPromise) {
                        return;
                    }

                    resPromise
                        .then(data => {
                            resolve(BigInt(data[id-1].result));
                        })
                }
            });
        });
    };
})();
