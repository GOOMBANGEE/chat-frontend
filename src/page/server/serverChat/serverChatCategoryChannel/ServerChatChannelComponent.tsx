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
  const { channelState, setChannelState, resetChannelState } =
    useChannelStore();
  const navigate = useNavigate();

  const handleChannelClick = () => {
    if (channelState.id !== props.channel.id) {
      resetChannelState();
      navigate(`/server/${serverState.id}/${props.channel.id}`);
    }
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
      className={"ml-2 mt-1 flex w-full items-center rounded pr-2 text-base"}
    >
      {channelState.id === props.channel.id ? (
        <div
          className={
            "w-full rounded bg-customDark_6 px-6 py-1 text-start text-customText"
          }
        >
          {props.channel.name}
        </div>
      ) : (
        <div className={"flex w-full items-center"}>
          {props.channel.lastMessageId !== props.channel.lastReadMessageId ? (
            <svg
              className={"absolute left-0"}
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  className={"fill-white stroke-white"}
                  d="M9 7.9313V16.0686C9 16.6744 9 16.9773 9.1198 17.1175C9.22374 17.2393 9.37967 17.3038 9.53923 17.2913C9.72312 17.2768 9.93731 17.0626 10.3657 16.6342L14.4343 12.5656C14.6323 12.3676 14.7313 12.2686 14.7684 12.1544C14.8011 12.054 14.8011 11.9458 14.7684 11.8454C14.7313 11.7313 14.6323 11.6323 14.4343 11.4342L10.3657 7.36561C9.93731 6.93724 9.72312 6.72305 9.53923 6.70858C9.37967 6.69602 9.22374 6.76061 9.1198 6.88231C9 7.02257 9 7.32548 9 7.9313Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          ) : null}

          <button
            onClick={handleChannelClick}
            className={`${props.channel.lastMessageId !== props.channel.lastReadMessageId ? "text-white" : "hover:text-gray-300"} w-full rounded px-6 py-1 text-start hover:bg-customDark_5`}
          >
            {props.channel.name}
          </button>
        </div>
      )}
    </div>
  );
}
