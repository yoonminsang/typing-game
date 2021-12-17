import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/utils/api/axios-instance';
import { IWord } from '@/types/words';
import { getWordsApi } from './words';

const mockWords: IWord[] = [
  {
    second: 10,
    text: 'hello',
  },
  {
    second: 5,
    text: 'world',
  },
];

const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

beforeEach(() => {
  mock.reset();
});

describe('api-words', () => {
  it('should success', async () => {
    mock.onGet('/kakaopay-fe/resources/words').reply(200, mockWords);
    const { data } = await getWordsApi();
    expect(data).toEqual(mockWords);
  });

  it('should fail', async () => {
    mock.onGet('/kakaopay-fe/resources/words').reply(500);
    getWordsApi().catch((err) => {
      expect(err).not.toBeNull();
    });
  });
});
