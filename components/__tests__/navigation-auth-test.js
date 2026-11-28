import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ExpoRoot, Stack } from 'expo-router';
import { inMemoryContext } from 'expo-router/build/testing-library/context-stubs';
import { internalNavigationEvents } from 'expo-router/build/global-state/internalNavigationEvents';
import TabLayout from '../../app/(tabs)/_layout';
import HomeLayout from '../../app/(tabs)/(index)/_layout';
import { UserContext } from '@/contexts/UserContext';

jest.mock('@/contexts/UserContext', () => ({
  UserContext: require('react').createContext({}),
}));

jest.mock('@/hooks/useTheme', () => () => ({
  grayBorder: '#ccc',
  grayBackground: '#fff',
  iconColor: '#000',
  borderColor: '#ccc',
  tint: '#000',
  tabBar: '#fff',
}));

const RootLayout = () => <Stack screenOptions={{ headerShown: false }} />;
const screen = (label) => () => <Text>{label}</Text>;
const context = inMemoryContext({
  _layout: RootLayout,
  '(tabs)/_layout': TabLayout,
  '(tabs)/(index)/_layout': HomeLayout,
  '(tabs)/(index)/index': screen('home'),
  '(tabs)/(index)/history': screen('history'),
  '(tabs)/(index)/login': screen('login'),
  '(tabs)/(index)/signup': screen('signup'),
  '(tabs)/insights': screen('insights'),
  '(tabs)/newBet': screen('new bet'),
  '(tabs)/data': screen('data'),
  '(tabs)/profile': screen('profile'),
});

it('restores, signs in and signs out without unnecessary home route reconciliation', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  const actions = [];
  const unsubscribe = internalNavigationEvents.addListener('actionDispatched', ({ actionType, payload }) =>
    actions.push({ actionType, payload })
  );
  const app = (value) => (
    <UserContext.Provider value={value}>
      <ExpoRoot context={context} location="/" />
    </UserContext.Provider>
  );
  let tree;
  try {
    await act(async () => {
      tree = renderer.create(app({ user: null, signedIn: false, authLoading: true }));
    });
    await act(async () => {
      tree.update(app({ user: null, signedIn: false, authLoading: false }));
    });
    expect(tree.root.findAllByType(Text).some((item) => item.props.children === 'login')).toBe(true);

    await act(async () => {
      tree.update(app({ user: { cloudUserId: 'user-1' }, signedIn: true, authLoading: false }));
    });
    expect(tree.root.findAllByType(Text).some((item) => item.props.children === 'home')).toBe(true);

    await act(async () => {
      tree.update(app({ user: null, signedIn: false, authLoading: false }));
    });
    expect(tree.root.findAllByType(Text).some((item) => item.props.children === 'login')).toBe(true);
    expect(actions.filter(({ actionType, payload }) =>
      actionType === 'ROUTE_NAMES_CHANGED' &&
      payload?.routeNames?.includes('history')
    )).toEqual([]);
    expect(error.mock.calls.filter(([message]) =>
      typeof message === 'string' && message.includes("The action 'ROUTE_NAMES_CHANGED'")
    )).toEqual([]);
  } finally {
    if (tree) await act(async () => tree.unmount());
    unsubscribe();
    error.mockRestore();
  }
});
