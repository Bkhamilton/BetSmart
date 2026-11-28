import React, { useContext } from 'react';
import renderer, { act } from 'react-test-renderer';
import useHookData from '../useHookData';
import useHookInsights from '../useHookInsights';
import useHookHome from '../useHookHome';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { HistorySyncContext } from '@/contexts/HistorySyncContext';
import { getProfitByPeriod } from '@/db/data/data';
import { getBetSlipsLast7Days, getOpenBetSlips } from '@/db/betslips/BetSlips';

jest.mock('@/contexts/UserContext', () => ({ UserContext: require('react').createContext({}) }));
jest.mock('@/contexts/DBContext', () => ({ DBContext: require('react').createContext({}) }));
jest.mock('@/contexts/HistorySyncContext', () => ({ HistorySyncContext: require('react').createContext({ revision: 0 }) }));
jest.mock('@/db/data/data', () => ({
  getProfitByPeriod: jest.fn().mockResolvedValue(10),
  getWonBetSlipCountByPeriod: jest.fn().mockResolvedValue(1),
  getWinRateByPeriod: jest.fn().mockResolvedValue(50),
  getROIByPeriod: jest.fn().mockResolvedValue(10),
  getTotalBetAmountByPeriod: jest.fn().mockResolvedValue(100),
}));
jest.mock('@/db/betslips/BetSlips', () => ({
  getBetSlipsLast7Days: jest.fn().mockResolvedValue(2),
  getOpenBetSlips: jest.fn().mockResolvedValue([{ id: 1 }]),
  getLastWeekOfBetSlips: jest.fn().mockResolvedValue([]),
}));
jest.mock('@/db/betslips/BetSlipsResults', () => ({
  getWonBetSlipCountLast7Days: jest.fn().mockResolvedValue(1),
  getProfitLast7Days: jest.fn().mockResolvedValue(10),
  getWinningestBetSlipLast7Days: jest.fn().mockResolvedValue({}),
}));
jest.mock('@/contexts/NewBetContext/BetContext/betSlipHelpers', () => ({
  fillBetSlips: jest.fn(async (_db, slips) => slips),
  fillBetSlipsWithResults: jest.fn(async (_db, slips) => slips),
}));
jest.mock('@/utils/dbHelpers', () => ({ confirmBetResults: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

it('refreshes Data and Insights after history is restored', async () => {
  const db = {};
  const user = { id: 1 };
  let latest;
  const Harness = () => {
    latest = { data: useHookData(), insights: useHookInsights(), revision: useContext(HistorySyncContext).revision };
    return null;
  };
  const render = (revision) => (
    <UserContext.Provider value={{ user, signedIn: true }}>
      <DBContext.Provider value={{ db }}>
        <HistorySyncContext.Provider value={{ revision }}>
          <Harness />
        </HistorySyncContext.Provider>
      </DBContext.Provider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(render(0)); });
  expect(latest.data.data.totalProfit).toBe(10);
  expect(latest.insights.betsPlaced).toBe(2);
  expect(getProfitByPeriod).toHaveBeenCalledTimes(1);
  expect(getBetSlipsLast7Days).toHaveBeenCalledTimes(1);

  await act(async () => { tree.update(render(1)); });
  expect(getProfitByPeriod).toHaveBeenCalledTimes(2);
  expect(getBetSlipsLast7Days).toHaveBeenCalledTimes(2);
  await act(async () => tree.unmount());
});

it('does not show an earlier account result after switching accounts', async () => {
  let resolveFirst;
  getProfitByPeriod.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }));
  const db = {};
  let latest;
  const Harness = () => {
    latest = useHookData();
    return null;
  };
  const render = (id) => (
    <UserContext.Provider value={{ user: { id }, signedIn: true }}>
      <DBContext.Provider value={{ db }}>
        <HistorySyncContext.Provider value={{ revision: 0 }}>
          <Harness />
        </HistorySyncContext.Provider>
      </DBContext.Provider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(render(1)); });
  await act(async () => { tree.update(render(2)); });
  expect(latest.data.totalProfit).toBe(10);
  await act(async () => { resolveFirst(999); });
  expect(latest.data.totalProfit).toBe(10);
  await act(async () => tree.unmount());
});

it('refreshes Home after a restore and hides the previous account history immediately', async () => {
  const db = {};
  const setTrigger = jest.fn();
  let latest;
  const Harness = () => {
    latest = useHookHome();
    return null;
  };
  const render = (id, revision) => (
    <UserContext.Provider value={{ user: { id }, trigger: false, setTrigger }}>
      <DBContext.Provider value={{ db }}>
        <HistorySyncContext.Provider value={{ revision }}>
          <Harness />
        </HistorySyncContext.Provider>
      </DBContext.Provider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(render(1, 0)); });
  expect(latest.betSlips).toHaveLength(1);
  expect(getOpenBetSlips).toHaveBeenCalledTimes(1);
  await act(async () => { tree.update(render(1, 1)); });
  expect(getOpenBetSlips).toHaveBeenCalledTimes(2);
  let resolveSecond;
  getOpenBetSlips.mockImplementationOnce(() => new Promise(resolve => { resolveSecond = resolve; }));
  await act(async () => { tree.update(render(2, 1)); });
  expect(latest.betSlips).toEqual([]);
  await act(async () => { resolveSecond([{ id: 2 }]); });
  expect(latest.betSlips).toEqual([{ id: 2 }]);
  await act(async () => tree.unmount());
});
