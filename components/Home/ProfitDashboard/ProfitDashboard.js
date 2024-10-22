import React from 'react';
import BalanceChecker from './BalanceChecker/BalanceChecker';
import BetSlipResults from './BetSlipResults';

export default function ProfitDashboard({ openTransaction, openChooseBookie, transactions }) {
    return (
        <>
            <BalanceChecker 
                openTransaction={openTransaction} 
                openChooseBookie={openChooseBookie}
                transactions={transactions}
            />
            <BetSlipResults />
        </>
  );
}
