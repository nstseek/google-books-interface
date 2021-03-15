import { shallow } from 'enzyme';
import BookList from './BookList';
import { ReactUIContext } from '@nstseek/react-ui/context';

describe('<BookList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <ReactUIContext.Provider value={{ state: { loading: [] } } as any}>
        <BookList />
      </ReactUIContext.Provider>
    );
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
