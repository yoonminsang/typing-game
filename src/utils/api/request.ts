import axios, { AxiosInstance, AxiosResponse } from 'axios';

// axios 함수를 모듈화 해서 만들었다. 함수 시작과 끝에 커스텀 이벤트를 발생시켜서 로딩을 적용시킨다.
// TODO: 테스트

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const client: AxiosInstance = axios.create();

// client.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'https://my-json-server.typicode.com/';
client.defaults.baseURL = 'https://my-json-server.typicode.com/';
client.defaults.withCredentials = true;

const requestEvent = new CustomEvent('request');
const requestEndEvent = new CustomEvent('request-end');

async function request<T>(method: Method, url: string, data?: unknown, multipart?: boolean): Promise<AxiosResponse<T>> {
  window.dispatchEvent(requestEvent);
  const multipartOption = multipart && { 'Content-Type': 'multipart/form-data' };
  try {
    const res = await client({
      method,
      url,
      headers: {
        ...multipartOption,
      },
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
