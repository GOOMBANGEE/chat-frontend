import { ChannelInfo } from "../../../../index";
import { useChannelStore } from "../../../store/ChannelStore.tsx";
import { useNavigate } from "react-router-dom";
import IconComponent from "../../../component/IconComponent.tsx";

export default function ServerIndexDMList() {
  const { channelState, directMessageChannelListState } = useChannelStore();

  const navigate = useNavigate();

  const handleDmChannelClick = (channelId: number) => {
    navigate("/server/dm/" + channelId);
  };

  return (
    <div
      style={{ width: "240px" }}
      className={"relative flex flex-col text-customText"}
    >
      <div className={"mt-1 flex h-14 w-full items-center shadow-md"}></div>

      {directMessageChannelListState.map((channelInfo: ChannelInfo) => {
        return (
          <button
            key={channelInfo.id}
            onClick={() => handleDmChannelClick(channelInfo.id)}
            className={`mx-1 my-0.5 flex items-center gap-4 rounded px-4 py-2 ${channelState.id === channelInfo.id ? "bg-customDark_5" : "hover:bg-customDark_5"}`}
          >
            <IconComponent icon={channelInfo.avatarImageSmall} size={10} />

            <div className={"text-start font-semibold"}>
              {channelInfo.username}
            </div>
          </button>
        );
      })}
    </div>
  );
}
