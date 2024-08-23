import { Chat } from "../../../../index";

interface Props {
  chat: Chat;
}

export default function ChatComponent(props: Readonly<Props>) {
  return (
    <div className={"flex gap-2"}>
      <div className={"font-semibold"}>{props.chat.username} :</div>
      <div className={`${props.chat.error ? "text-red-600" : "text-white"}`}>
        {props.chat.message}
      </div>
    </div>
  );
}
