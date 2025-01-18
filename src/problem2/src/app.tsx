import React, { useState, useEffect } from "react";
import { fakeExchange } from "./service/exchangeCurrency";

interface CurrencyChosenProps {
  currency1?: Currency | null;
  currency2?: Currency | null;
  onSetCurrency1: (p: Currency) => void;
  onSetCurrency2: (p: Currency) => void;
}

const CurrencyChosen = ({
  onSetCurrency2,
  onSetCurrency1,
  currency1,
  currency2,
}: CurrencyChosenProps) => {
  const [currencyData, setCurrencyData] = useState<Currency[] | null>(null);

  useEffect(() => {
    const getCurrencyData = async () => {
      const res = await fetch("https://interview.switcheo.com/prices.json");
      const json = await res.json();

      const dupValue: Record<string, boolean> = {};

      setCurrencyData(
        json.filter((d: { currency: string }) => {
          if (d.currency && !dupValue[d.currency]) {
            dupValue[d.currency] = true;
            return true;
          }
          return false;
        }),
      );
    };

    getCurrencyData();
  }, []);

  return (
    <div className="flex justify-between gap-4">
      {currencyData ? (
        <>
          <div className="flex-grow">
            <select
              className="w-full"
              defaultValue=""
              id="currency1"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                event.preventDefault();
                const data = currencyData.find(
                  ({ currency }) => currency === event.target.value,
                );

                if (data) {
                  onSetCurrency1(data);
                }
              }}
            >
              <option disabled value="">
                {" "}
                Select current Currency{" "}
              </option>
              {currencyData.map(({ currency }) => (
                <option value={currency} key={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <div className="mt-3 h-[60px] text-center text-lg text-slate-100">
              {/* {currency1?.currency} */}
              {currency1?.price ? (
                <>
                  <p>Base Exchange rate:</p>
                  <p className="text-white"> {currency1?.price}</p>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex-grow">
            <select
              className="w-full"
              id="currency2"
              defaultValue=""
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                event.preventDefault();
                const data = currencyData.find(
                  ({ currency }) => currency === event.target.value,
                );

                if (data) {
                  onSetCurrency2(data);
                }
              }}
            >
              <option disabled value="">
                {" "}
                Select target Currency{" "}
              </option>
              {currencyData.map(({ currency }) => (
                <option value={currency} key={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <div className="mt-3 h-[60px] text-center text-lg text-slate-100">
              {/* <p> {currency2?.currency}</p> */}
              {currency2?.price ? (
                <>
                  <p>Base Exchange rate:</p>
                  <p className="text-white"> {currency2?.price}</p>
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div>Loading currency</div>
      )}
    </div>
  );
};

interface ExchangeProps {
  value: number;
  price1?: number;
  price2?: number;
  isCurrency1?: boolean;
}

const exchangeValue = ({
  price1,
  price2,
  value,
  isCurrency1,
}: ExchangeProps) => {
  if (!price2 || !price1 || value < 0) {
    return [0, 0];
  }
  let _currency1Value = 0,
    _currency2Value = 0;

  const ratio = price1 / price2;

  if (isCurrency1) {
    _currency1Value = value;
    _currency2Value = _currency1Value * ratio;
  } else {
    _currency2Value = value;
    _currency1Value = _currency2Value / ratio;
  }
  return [_currency1Value, _currency2Value];
};

const App = () => {
  const [currency1, setCurrency1] = useState<Currency | null>(null);
  const [currency2, setCurrency2] = useState<Currency | null>(null);

  const [currency1Value, setCurrency1Value] = useState(0);
  const [currency2Value, setCurrency2Value] = useState(0);

  const [isSubmiting, setIsSubmiting] = useState(false);

  let warningText = "";

  if (currency1?.currency === currency2?.currency && currency1?.currency) {
    warningText = "Target and source currency are identical";
  }

  let label1 = "Amount to send";
  let label2 = "Amount to receive";

  if (currency1?.currency) {
    label1 = `Amount to send (${currency1?.currency})`;
  }

  if (currency2?.currency) {
    label2 = `Amount to receive (${currency2?.currency})`;
  }

  const setCurrency = (p: Currency, isCurrency1?: boolean) => {
    if (isCurrency1) {
      setCurrency1(p);
    } else {
      setCurrency2(p);
    }

    setCurrency1Value(0);
    setCurrency2Value(0);

    // if (currency1 && currency2) {
    //   updateCurrencyValue(
    //     isCurrency1 ? currency1Value : currency2Value,
    //     isCurrency1,
    //   );
    // }
  };

  const updateCurrencyValue = (value: number, isCurrency1?: boolean) => {
    const price1 = currency1?.price || 0;
    const price2 = currency2?.price || 0;

    const [_currency1Value, _currency2Value] = exchangeValue({
      value,
      price1,
      price2,
      isCurrency1,
    });

    setCurrency1Value(_currency1Value);
    setCurrency2Value(_currency2Value);
  };

  const onCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCurrency1?: boolean,
  ) => {
    const curValue = parseFloat(e.target.value);
    updateCurrencyValue(curValue, isCurrency1);
  };

  const disabledSwap =
    !currency1 || !currency2 || warningText !== "" || isSubmiting;

  return (
    <div className="flex h-screen w-full flex-col items-center bg-slate-600 justify-center">
      <h1 className="mb-5 text-3xl font-bold uppercase text-slate-50">
        Currency Exchange
      </h1>
      <div className="rounded-md border-2 bg-slate-700 p-4">
        <CurrencyChosen
          currency1={currency1}
          currency2={currency2}
          onSetCurrency1={(p) => setCurrency(p, true)}
          onSetCurrency2={(p) => setCurrency(p)}
        />
        <form
          className="mb-0 mt-5 flex min-w-[600px] flex-col items-center justify-center gap-3 bg-slate-500 p-2"
          onSubmit={async (e) => {
            e.preventDefault();

            if (currency2 && currency1) {
              setIsSubmiting(true);
              await fakeExchange({
                targetId: currency2.currency,
                sourceId: currency1.currency,
                value: currency1Value,
              });
              setIsSubmiting(false);
              setCurrency1Value(0);
              setCurrency2Value(0);
            }
          }}
        >
          <h5 className="text-2xl font-bold uppercase">Swap</h5>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <input
                type="number"
                pattern="[-+]?[0-9]*[.,]?[0-9]+"
                disabled={disabledSwap}
                id="input-amount-1"
                onChange={(e) => {
                  onCurrencyChange(e, true);
                }}
                value={currency1Value}
              />
              <label htmlFor="input-amount-1">{label1} </label>
            </div>
            <div className="flex flex-col items-center gap-2">
              <input
                disabled={disabledSwap}
                id="output-amount-2"
                onChange={(e) => {
                  onCurrencyChange(e);
                }}
                type="number"
                pattern="[-+]?[0-9]*[.,]?[0-9]+"
                value={currency2Value}
              />
              <label htmlFor="output-amount-2">{label2}</label>
            </div>
          </div>
          <div className="h-5 uppercase text-red-300">
            {" "}
            {`${warningText ? `${warningText} !` : ""}`}
          </div>
          <button
            type="submit"
            disabled={disabledSwap || currency1Value === 0}
            className="mt-3 cursor-pointer rounded-md bg-slate-800 px-4 py-2 uppercase text-lg text-slate-100 hover:bg-slate-700 active:bg-gray-900"
          >
            {isSubmiting ? "Submitting..." : "CONFIRM SWAP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
