import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { CategoryInfo, ChannelInfo } from "../../../../../index";
import ServerChatCategoryComponent from "./ServerChatCategoryComponent.tsx";
import ServerChatChannelComponent from "./ServerChatChannelComponent.tsx";

export default function ServerChatCategoryChannelList() {
  const { serverState } = useServerStore();
  const { categoryListState } = useCategoryStore();
  const { channelListState } = useChannelStore();

  const filteredCategoryList = categoryListState.filter(
    (category: CategoryInfo) => category.serverId === serverState.id,
  );

  return (
    <div className={"mt-2 w-full px-2 py-1 text-gray-400"}>
      {filteredCategoryList.map((category) => {
        const filteredChannelList = channelListState
          .filter(
            (channel: ChannelInfo) =>
              channel.serverId === serverState.id &&
              channel.categoryId === category.id,
          )
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return (
          <div key={category.id}>
            <ServerChatCategoryComponent category={category} />
            {filteredChannelList.map((channel: ChannelInfo) => (
              <ServerChatChannelComponent key={channel.id} channel={channel} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
