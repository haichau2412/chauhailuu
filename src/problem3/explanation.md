interface WalletBalance {
    currency: string;
    amount: number;
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {}

**anti-patterns**
missing rest type, as we pass rest as props of div, we should define props as props of div

const WalletPage: React.FC<Props> = (props: Props) => {
const { children, ...rest } = props;

**anti-patterns**
children is not used -> should remove or add to the below code if it's used

const balances = useWalletBalances();
const prices = usePrices();

const getPriority = (blockchain: any): number => {

**anti-patterns**
No any -> blockchain: string
As the code suggest, this blochain value is used alot, it should be exported from constants.js or helper
we should update to use object approach for easy update

    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }

};

const sortedBalances = useMemo(() => {
return balances
.filter((balance: WalletBalance) => {

**anti-patterns**
WalletBalance doesn't have field "blockchain"

        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {

**error**
lhsPriority : not declared

          if (balance.amount <= 0) {

**computational inefficiencies**
don't need a nested if like this, negative amount seems incorrect

            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = ;
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }

**anti-patterns**
reduce else if usage, and for this descending sort we only need to return difference

      });

}, [balances, prices]);

**anti-patterns**
remove prices as prices is not used

const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
return {
...balance,
formatted: balance.amount.toFixed(),

**computational inefficiencies**
The formatted value is easily deduced from amount value, we should compute it inside WalletRow
If we just want to show value as string, use toString() instead of toFixed() as it will round the value

    };

});

const rows = sortedBalances.map(
(balance: FormattedWalletBalance, index: number) => {
const usdValue = prices[balance.currency] \* balance.amount;
return (
<WalletRow
className={classes.row}
key={index}

**anti-patterns**
Do not use index as key

          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }

);

return <div {...rest}>{rows}</div>;
};
