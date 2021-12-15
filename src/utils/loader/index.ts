import Loader from '@/components/loader';

// axios 함수 실행시 커스텀 이벤트를 발생시켜 전체에 로딩을 건다.

let requestCount = 0;

export const addLoader = () => {
  const $loader = document.querySelector('#loader') as HTMLElement;
  new Loader($loader);

  window.addEventListener('request', () => {
    requestCount++;
    $loader.classList.add('show');
  });

  window.addEventListener('request-end', () => {
    requestCount--;
    if (requestCount === 0) $loader.classList.remove('show');
  });
};
