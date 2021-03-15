import { shallow } from 'enzyme';
import BookDetails from './BookDetails';

describe('<BookDetails />', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <BookDetails book={{ volumeInfo: {} } as any} close={() => null} />
    );
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
