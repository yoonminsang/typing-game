import { AxiosResponse } from 'axios';
import { IWord } from '@/types/words';
import request from './request';

export const getWords = (): Promise<AxiosResponse> => request<IWord[]>('GET', `/kakaopay-fe/resources/words`);
