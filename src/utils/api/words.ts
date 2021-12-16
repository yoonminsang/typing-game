import { AxiosResponse } from 'axios';
import { IWord } from '@/types/words';
import request from './request';

export const getWordsApi = (): Promise<AxiosResponse<IWord[]>> => request('GET', `/kakaopay-fe/resources/words`);
