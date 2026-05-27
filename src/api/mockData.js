// Mock Holdings API — simulates a network call
export const fetchHoldings = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          coin: "BTC",
          coinName: "Bitcoin",
          logo: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
          totalHoldings: 0.63776,
          averageBuyPrice: 86842.37,
          currentPrice: 86740.16,
          totalCurrentValue: 55320.15,
          stcg: { gain: -1200, balance: 0.338 },
          ltcg: { gain: -2400, balance: 0.299 },
        },
        {
          coin: "ETH",
          coinName: "Ethereum",
          logo: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
          totalHoldings: 5.6738,
          averageBuyPrice: 1643.23,
          currentPrice: 1642.82,
          totalCurrentValue: 9324.21,
          stcg: { gain: 58239.29, balance: 35.48 },
          ltcg: { gain: -8239.29, balance: 5.6738 },
        },
        {
          coin: "USDT",
          coinName: "Tether",
          logo: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
          totalHoldings: 3096.54,
          averageBuyPrice: 1.01,
          currentPrice: 1.0,
          totalCurrentValue: 3142.21,
          stcg: { gain: -1200, balance: 2011.21 },
          ltcg: { gain: 2400, balance: 462.47 },
        },
        {
          coin: "MATIC",
          coinName: "Polygon",
          logo: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png",
          totalHoldings: 2210,
          averageBuyPrice: 2.18,
          currentPrice: 2.11,
          totalCurrentValue: 4672.12,
          stcg: { gain: -1200, balance: 982 },
          ltcg: { gain: 2400, balance: 1228 },
        },
        {
          coin: "ETH2",
          coinName: "Ethereum (Staked)",
          logo: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
          totalHoldings: 5.6738,
          averageBuyPrice: 1643.23,
          currentPrice: 9324.21,
          totalCurrentValue: 52900.15,
          stcg: { gain: 58239.29, balance: 3.5 },
          ltcg: { gain: -8239.29, balance: 2.17 },
        },
        {
          coin: "USDT2",
          coinName: "Tether (New)",
          logo: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
          totalHoldings: 3096.54,
          averageBuyPrice: 1.01,
          currentPrice: 1.0,
          totalCurrentValue: 3142.21,
          stcg: { gain: -1200, balance: 2011.21 },
          ltcg: { gain: -2400, balance: 462.47 },
        },
      ]);
    }, 800);
  });

// Mock Capital Gains API — simulates a network call
export const fetchCapitalGains = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        capitalGains: {
          stcg: { profits: 1540, losses: 743 },
          ltcg: { profits: 1200, losses: 650 },
        },
      });
    }, 600);
  });
