jest.mock('react-particles-js', () => () => '');
import { shallow } from 'enzyme';
import App from './App';

describe('<App />', () => {
  let component: ReturnType<typeof shallow>;

  beforeEach(() => {
    component = shallow(<App />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
