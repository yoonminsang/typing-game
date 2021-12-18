# 타자게임

## 기본 설명

- 주어진 단어가 표시되면 input에 단어를 정해진 시간 내에 입력하여 점수를 획득하는 어플리케이션
- react와 같은 라이브러리 또는 프레임워크를 사용하지 않은 spa
- 컴포넌트, 라우터를 직접 구현
- jest와 testing library를 이용한 단위 테스트
- complete 페이지로 이동할 때 세션 방식 사용
- 반응형 css, 폰트 적용

## 해결 전략

### 코어 라이브러리

- npm에 배포한 바닐라자바스크립트 라이브러리를 ts로 마이그레이션
- 컴포넌트, 라우터, 옵저버 패턴 기능
- [https://www.npmjs.com/package/ms-vanilla](https://www.npmjs.com/package/ms-vanilla)

### 게임

1. 시작 버튼을 누른다.
2. 서버로부터 데이터를 불러온다.(setState로 데이터와 게임을 시작하는 기본값을 넣는다)
3. 게임이 시작된다.(2의 setState로 state가 바뀌면서 게임 화면으로 바뀐다)
4. 라운드가 바뀌어서 initialization 메서드를 실행한다. setInterval로 1초마다 countDown 메서드를 실행한다. timerId에 방금 실행한 setInterval Id와 초기화 state를 넣는다.
5. countDown 메서드는 setState로 타이머 값을 1씩 줄인다.
6. 만약 문제 단어와 같은 값을 입력하고 엔터 버튼을 누르면 타이머를 멈추고 타임 배열에 해결한 시간을 추가하고, 라운드를 증가시키고, input value 값을 초기화시킨다.
7. 시간내에 문제를 맞추지 못하고 timer가 1이 되면 countDown 메서드에서 라운드를 증가시키고, input value 값을 초기화시킨다.(6과 다른 점은 타임 배열에 값을 추가하지 않는 것이다.)
8. 라운드가 끝나면 세션에 score와 average를 저장해서 게임 완료 페이지로 이동시킨다.

### 게임 재시작

### 게임 완료

- 게임 완료시에 세션 스토리지에 key, value를 넣어서 url을 이동시킨다. 그리고 세션 값이 존재하지 않다면 메인 화면으로 redirect 시킨다. store를 만들어서 처리할 수도 있는데 너무 간단한 프로젝트라 필요성을 느끼지 못해서 가장 간단한 세션을 이용했다.
- 재시작을 누르면 세션에 again값을 넣어서 게임 화면으로 이동시킨다. 게임화면에서는 again값이 존재하면 바로 게임을 시작시킨다.

### 단위 테스트

- 코어 라이브러리를 제외한 필요한 모든 곳에 단위 테스트 작성
- 코어 라이브러리를 제외한 모든 곳에 coverage 100%
- 렌더링 테스트
- 스냅샷 테스트
- 유틸함수 테스트
- axios 테스트
- timer 테스트

![image](https://user-images.githubusercontent.com/57904979/146643245-4b3d896e-a766-4cc0-ae1b-aef14d042b1a.png)

## 트러블슈팅

### input value

input value의 state를 바꾸는 부분에서 문제가 발생했다. input 이벤트는 정상적으로 작동을 하는데 input value를 초기화할 때 setstae로 input value를 바꾸는 부분이 제대로 동작하지 않았다. 디버깅을 한 결과 attribute의 value만 바뀌는 것을 확인했다. attribute의 value가 바뀐다고 실제 input value 값이 바뀌지 않는다. 실제 키보드로 입력하고(ui에 바뀐 value 표시) input 이벤트가 발생해서(input value의 attribute 수정) 내가 잠시 착각했다. 그래서 component 추상 클래스의 update 메서드에 아래 코드를 추가해줬다.

```
if (curEl.nodeName === 'INPUT' && newAttr.name === 'value') {
  (curEl as HTMLInputElement).value = newAttr.value;
}
```

### 테스트

나는 프론트에서 제대로 테스트를 해본적이 없다. 백엔드에서 해보고 프론트에서 리액트를 사용해 간단한 예제나 사가 테스트를 다루어봤지만 모든 부분에 테스트를 시도한 것은 처음이였다. 다행히 테스트를 해봐서 기본 테스트는 문제가 크게 없었다. 하지만 axios, timer, 비동기처리, 내가 만든 컴포넌트로 테스트를 하는데 생각보다 시간이 걸렸다. 익숙하지 않아서 디버깅을 조금 많이 했다. 결국 모두 답을 찾았고 test coverage 100을 달성했다.
