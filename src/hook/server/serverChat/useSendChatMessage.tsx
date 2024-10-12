import { useChatStore } from "../../../store/ChatStore.tsx";
import axios, { isAxiosError } from "axios";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import { Chat, ChatInfoList } from "../../../../index";
import devLog from "../../../devLog.ts";

interface Props {
  serverId?: number;
  channelId: number;
  chat: Chat;
  chatList: ChatInfoList[];
}

export default function useSendChatMessage() {
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useSendChatMessage";

  const sendChatMessage = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const message = {
      messageType: "CHAT_SEND",
      serverId: props.serverId,
      channelId: props.channelId,
      username: props.chat.username,
      message: props.chat.message,
      attachment: props.chat.attachment,
    };

    try {
      const response = await axios.post(chatUrl, message);
      // response 들어오면 해당 id를 찾아서 서버의 serverChat id 부여
      const newChatInfoList = props.chatList.map((chatInfoList) => {
        if (chatInfoList.channelId === Number(props.channelId)) {
          return {
            ...chatInfoList,
            chatList: chatInfoList.chatList.map((chat: Chat) => {
              if (chat.id === props.chat.id) {
                return {
                  ...chat,
                  id: response.data.id,
                  createTime: response.data.createTime,
                  updateTime: response.data.createTime,
                  attachment: response.data.attachment,
                  attachmentWidth: response.data.attachmentWidth,
                  attachmentHeight: response.data.attachmentHeight,
                };
              }
              return chat;
            }),
          };
        }
        return chatInfoList;
      });

      devLog(componentName, "setChatListState");
      setChatListState(newChatInfoList);
    } catch (error) {
      if (isAxiosError(error)) {
        // 해당 id를 찾아서 발송문제를 표시
        const newChatInfoList = props.chatList.map((chatInfoList) => {
          if (chatInfoList.channelId === Number(props.channelId)) {
            return {
              ...chatInfoList,
              chatList: chatInfoList.chatList.map((chat: Chat) => {
                if (chat.id === props.chat.id) {
                  return {
                    ...chat,
                    error: true,
                  };
                }
                return chat;
              }),
            };
          }
          return chatInfoList;
        });

        devLog(componentName, "setChatListState");
        setChatListState(newChatInfoList);
      }
    }
  };

  return { sendChatMessage };
}
