import { ChannelInfo } from "../../../../../index";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useNavigate } from "react-router-dom";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import React from "react";

interface Props {
  channel: ChannelInfo;
}

export default function ServerChatChannelComponent(props: Readonly<Props>) {
  const { serverState } = useServerStore();
  const { channelState, setChannelState } = useChannelStore();
  const navigate = useNavigate();

  const handleChannelClick = () => {
    setChannelState({ id: props.channel.id });
    navigate(`/server/${serverState.id}/${props.channel.id}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setChannelState({
      id: props.channel.id,
      name: props.channel.name,
      contextMenu: true,
    });
  };

  return (
    <div
      onContextMenu={(e) => handleContextMenu(e)}
      className={"mt-1 flex w-full items-center rounded text-sm"}
    >
      {channelState.id === props.channel.id ? (
        <div
          className={
            "w-full rounded bg-customDark_6 px-4 py-1 text-start text-customText"
          }
        >
          {props.channel.name}
        </div>
      ) : (
        <button
          onClick={handleChannelClick}
          className={
            "w-full rounded px-4 py-1 text-start hover:bg-customDark_5 hover:text-gray-300"
          }
        >
          {props.channel.name}
        </button>
      )}
    </div>
  );
}