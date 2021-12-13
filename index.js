"use strict";
const OpenAPI = require('@tinkoff/invest-openapi-js-sdk');
const CronJob = require('cron').CronJob;
const instrumentName = 'SBER';
const lotsCount = 1;
const secretToken = '....';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const job = new CronJob('0 0 12 * * 1-5', () => {
    buy(instrumentName, lotsCount).catch(console.error);
}, null, true, 'Europe/Moscow');
job.start();
async function buy(name, lots) {
    console.log('buy', name, lots);
    const apiURL = 'https://api-invest.tinkoff.ru/openapi';
    const api = new OpenAPI({ apiURL, secretToken, socketURL });
    const res = await api.searchOne({ ticker: name });
    if (!res)
        throw new Error('instrument is not found');
    const { figi } = res;
    const info = await api.marketOrder({
        operation: 'Buy',
        figi,
        lots: lots,
    });
    console.log(info);
}
async function buyInSandbox(name, lots) {
    const apiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox';
    const secretToken = '...';
    const api = new OpenAPI({ apiURL, secretToken, socketURL });
    await api.sandboxClear();
    await api.setCurrenciesBalance({ balance: 10000, currency: 'RUB' });
    const res = await api.searchOne({ ticker: name });
    if (!res)
        throw new Error('instrument is not found');
    const { figi } = res;
    const info = await api.marketOrder({
        operation: 'Buy',
        figi,
        lots: lots,
    });
    console.log(info);
}
