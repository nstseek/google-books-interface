import React from 'react';
import { mount } from 'enzyme';
import Book from './Book';

describe('<Book />', () => {
  let component;

  beforeEach(() => {
    component = mount(
      <Book book={{ volumeInfo: {} } as any} openBook={() => null} />
    );
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
