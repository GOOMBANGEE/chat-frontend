import { IMessage } from "@stomp/stompjs";
import devLog from "../devLog.ts";
import { useUserStore } from "../store/UserStore.tsx";
import { useStompStore } from "../store/StompStore.tsx";
import { useTokenStore } from "../store/TokenStore.tsx";

export default function useStompSubscribe() {
  const { userState } = useUserStore();
  const { stompState, setStompState } = useStompStore();
  const { tokenState } = useTokenStore();
  const componentName = "useStompSubscribe";

  // 유저, 서버, 채널 변경시 추가로 구독
  const stompSubscribe = (subscriptionUrl: string) => {
    if (
      // 이미 추가되어있는 url이면 추가구독하지않음
      !stompState.subscriptionUrl.has(subscriptionUrl) &&
      stompState.client?.active &&
      userState.id
    ) {
      stompState.client.subscribe(
        subscriptionUrl,
        (message: IMessage) => {
          const receiveMessage = JSON.parse(message.body);
          devLog(componentName, "setStompClient chatMessage");
          setStompState({ chatMessage: receiveMessage });
        },
        {
          id: userState.id.toString(),
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      );

      // 구독중인 경로 추가
      const strings = stompState.subscriptionUrl.add(subscriptionUrl);
      setStompState({ subscriptionUrl: strings });
    }
  };

  return { stompSubscribe };
}
