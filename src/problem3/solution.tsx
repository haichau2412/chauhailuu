/*
I assume currency is unique id of a currency
*/

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

//import from helper
const BLOCKCHAIN_PRIORITY = Object.freeze({
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
});

const getPriority = (blockchainName: string): number => {
  if (blockchainName in BLOCKCHAIN_PRIORITY) {
    return BLOCKCHAIN_PRIORITY[
      blockchainName as keyof typeof BLOCKCHAIN_PRIORITY
    ];
  }
  return -99;
};

const WalletPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount; // I assume prices always has value for balance.currency and we only show wallet balance when amount is > 0
        return (
          <WalletRow
            className={classes.row} // missing classes import
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toString()} //balance.amount.toFixed() if the inital format is intended
          />
        );
      })}
      {children}
    </div>
  );
};
