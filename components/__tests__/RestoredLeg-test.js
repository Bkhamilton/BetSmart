import React from 'react';
import renderer, { act } from 'react-test-renderer';
import LegComponent from '../Home/BetReview/DetailedInfo/LegComponent';

jest.mock('@/contexts/DBContext', () => ({
  DBContext: require('react').createContext({ db: {} }),
}));
jest.mock('@/hooks/useTheme', () => () => ({ grayBorder: '#ccc' }));
jest.mock('@/db/general/Teams', () => ({
  getLogoUrl: jest.fn().mockResolvedValue(undefined),
  getTeamAbbreviationByName: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/db/general/Players', () => ({
  getPlayerLogo: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/utils/betSlipFunctions', () => ({
  displayLeg: (_leg, name) => name,
}));

it('renders a restored team selection without local reference metadata', async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(
      <LegComponent leg={{ targetType: 'Team', betTarget: 'Historical Team', marketType: 'spread' }} />
    );
  });

  expect(JSON.stringify(tree.toJSON())).toContain('Historical Team');
  await act(async () => tree.unmount());
});

it('marks missing historical selection details instead of displaying current data', async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<LegComponent leg={{ targetType: 'Player' }} />);
  });

  expect(JSON.stringify(tree.toJSON())).toContain('Selection details unavailable');
  await act(async () => tree.unmount());
});
