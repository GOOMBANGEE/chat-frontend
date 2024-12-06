import { useCategoryStore } from "../../../../store/CategoryStore.tsx";
import { useChannelStore } from "../../../../store/ChannelStore.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { CategoryInfo, ChannelInfo } from "../../../../../index";
import ServerChatCategoryComponent from "./ServerChatCategoryComponent.tsx";
import ServerChatChannelComponent from "./ServerChatChannelComponent.tsx";
import React, { useEffect, useState } from "react";

export default function ServerChatCategoryChannelList() {
  const { serverState, setServerState } = useServerStore();
  const { categoryListState } = useCategoryStore();
  const { channelListState } = useChannelStore();

  const [categoryList, setCategoryList] = useState<CategoryInfo[]>();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setServerState({
      categoryChannelContextMenu: true,
    });
  };

  useEffect(() => {
    if (serverState.id) {
      const filteredCategoryList = categoryListState.filter(
        (category: CategoryInfo) => category.serverId === serverState.id,
      );
      setCategoryList(filteredCategoryList);
    }
  }, [serverState.id, categoryListState, channelListState]);

  return (
    <div
      className={
        "mt-2 flex h-full w-full flex-grow flex-col px-2 text-gray-400"
      }
    >
      {channelListState.map((channel) => {
        if (
          channel.serverId === serverState.id &&
          channel.categoryId === null
        ) {
          return (
            <ServerChatChannelComponent key={channel.id} channel={channel} />
          );
        }
      })}
      {categoryList?.map((category) => {
        const filteredChannelList = channelListState
          .filter(
            (channel: ChannelInfo) =>
              channel.serverId === serverState.id &&
              channel.categoryId === category.id,
          )
          .sort((a, b) => {
            const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });

        return (
          <div key={category.id}>
            <div
              className={"py-1"}
              onContextMenu={(e) => handleContextMenu(e)}
            ></div>
            <ServerChatCategoryComponent category={category} />
            {filteredChannelList.map((channel: ChannelInfo) => (
              <ServerChatChannelComponent key={channel.id} channel={channel} />
            ))}
          </div>
        );
      })}
      <div
        className={"flex-grow"}
        onContextMenu={(e) => handleContextMenu(e)}
      ></div>
    </div>
  );
}
