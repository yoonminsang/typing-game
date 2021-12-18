import { AxiosResponse } from 'axios';
import axiosInstance from './axios-instance';

// axios 함수를 모듈화 해서 만들었다. 함수 시작과 끝에 커스텀 이벤트를 발생시켜서 로딩을 적용시킨다.
// TODO: 테스트

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const requestEvent = new CustomEvent('request');
const requestEndEvent = new CustomEvent('request-end');

async function request(method: Method, url: string, data?: unknown): Promise<AxiosResponse> {
  window.dispatchEvent(requestEvent);
  try {
    const res = await axiosInstance({
      method,
      url,
      data,
    });
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    window.dispatchEvent(requestEndEvent);
  }
}

export default request;
