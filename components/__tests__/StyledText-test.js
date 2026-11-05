import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import { MonoText } from '../StyledText';

it('renders the supplied text with the monospace font', async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<MonoText>BetSmart</MonoText>);
  });
  const rendered = tree.toJSON();
  expect(rendered.children).toEqual(['BetSmart']);
  expect(StyleSheet.flatten(rendered.props.style).fontFamily).toBe('SpaceMono');
  await act(async () => tree.unmount());
});
