import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HistorySyncStatus from '../HistorySyncStatus';
import { HistorySyncContext } from '@/contexts/HistorySyncContext';

jest.mock('@/contexts/HistorySyncContext', () => ({
  HistorySyncContext: require('react').createContext({ status: 'unavailable', retry: () => {} }),
}));

it.each([
  ['pending', 'History sync pending', true],
  ['syncing', 'Syncing history', false],
  ['synced', 'Last history sync completed', false],
  ['failed', 'History sync failed', true],
  ['unavailable', 'History sync unavailable', false],
])('renders %s and offers retry only when appropriate', async (status, label, canRetry) => {
  const retry = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(
      <HistorySyncContext.Provider value={{ status, retry }}>
        <HistorySyncStatus />
      </HistorySyncContext.Provider>
    );
  });
  expect(JSON.stringify(tree.toJSON())).toContain(label);
  expect(JSON.stringify(tree.toJSON())).toContain('Balances and transactions are not synced');
  expect(JSON.stringify(tree.toJSON())).not.toContain('Some betting history may be missing');
  if (status === 'failed') {
    expect(JSON.stringify(tree.toJSON())).toContain('Check your connection and retry');
    expect(JSON.stringify(tree.toJSON())).toContain('saved on this device are retained');
  }
  const buttons = tree.root.findAll((node) =>
    node.props.accessibilityLabel === 'Retry history sync' && typeof node.props.onPress === 'function'
  );
  expect(buttons).toHaveLength(canRetry ? 1 : 0);
  if (canRetry) {
    await act(async () => buttons[0].props.onPress());
    expect(retry).toHaveBeenCalledTimes(1);
  }
  await act(async () => tree.unmount());
});

it('shows a generic restore warning and notice-storage failure without exposing details', async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(
      <HistorySyncContext.Provider value={{ status: 'synced', retry: jest.fn(), hasHistoryWarning: true, warningStorageUnavailable: true }}>
        <HistorySyncStatus />
      </HistorySyncContext.Provider>
    );
  });
  const text = JSON.stringify(tree.toJSON());
  expect(text).toContain('Some betting history may be missing historical details');
  expect(text).toContain('History notices could not be saved or loaded');
  await act(async () => tree.unmount());
});
