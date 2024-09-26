import { useChatStore } from "../../../store/ChatStore.tsx";
import { useEnvStore } from "../../../store/EnvStore.tsx";
import axios, { isAxiosError } from "axios";
import { Chat, ChatInfoList } from "../../../../index";
import devLog from "../../../devLog.ts";
import { useServerStore } from "../../../store/ServerStore.tsx";
import { useChannelStore } from "../../../store/ChannelStore.tsx";

interface Props {
  chat: Chat;
  chatInfoList: ChatInfoList[];
}

export default function useChatEdit() {
  const { serverState } = useServerStore();
  const { channelState } = useChannelStore();
  const { setChatListState } = useChatStore();
  const { envState } = useEnvStore();
  const componentName = "useChatEdit";

  const chatEdit = async (props: Props) => {
    const chatUrl = envState.chatUrl;
    const message = {
      serverId: serverState.id,
      channelId: channelState.id,
      chatId: props.chat.id,
      username: props.chat.username,
      message: props.chat.message,
    };

    try {
      await axios.patch(chatUrl, message);
    } catch (error) {
      if (isAxiosError(error)) {
        // 해당 id를 찾아서 발송문제를 표시
        const newChatInfoList: ChatInfoList[] = props.chatInfoList.map(
          (chatInfoList) => {
            if (
              chatInfoList.serverId === serverState.id &&
              chatInfoList.channelId === channelState.id
            ) {
              return {
                ...chatInfoList,
                chatList: chatInfoList.chatList.map((chat: Chat) => {
                  if (chat.id === props.chat.id) {
                    return { ...chat, error: true };
                  }
                  return chat;
                }),
              };
            }
            return chatInfoList;
          },
        );

        devLog(componentName, "setChatListState newChatList");
        setChatListState(newChatInfoList);
      }
    }
  };

  return { chatEdit };
}
