import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BalanceBox from '../PlaceBet/BalanceBox';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';

jest.mock('@/contexts/UserContext', () => ({
  UserContext: require('react').createContext({ userBalance: null }),
}));
jest.mock('@/contexts/NewBetContext/BetContext/BetContext', () => ({
  BetContext: require('react').createContext({}),
}));

it('renders before balances load', async () => {
  const setBookie = jest.fn();
  const setBookieId = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(
      <BetContext.Provider value={{ bookie: 'Default', bookieId: 0, signedIn: false, setBookie, setBookieId }}>
        <BalanceBox openModal={jest.fn()} />
      </BetContext.Provider>
    );
  });
  expect(JSON.stringify(tree.toJSON())).toContain('0.00');
  expect(setBookie).not.toHaveBeenCalled();
  expect(setBookieId).not.toHaveBeenCalled();
  await act(async () => tree.unmount());
});
