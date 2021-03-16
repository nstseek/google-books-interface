import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import BookDetails from './BookDetails';

describe('<BookDetails />', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <BrowserRouter>
        <BookDetails />
      </BrowserRouter>
    );
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
