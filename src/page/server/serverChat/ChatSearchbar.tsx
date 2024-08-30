import React, { useEffect, useRef } from "react";
import useChatSearch from "../../../hook/server/serverChat/useChatSearch.tsx";
import { useServerStore } from "../../../store/ServerStore.tsx";

export default function ChatSearchbar() {
  const { chatSearch } = useChatSearch();
  const { serverState, setServerState } = useServerStore();

  // 클릭시 자동 포커스
  const handleClickSearchButton = () => {
    setServerState({ serverSearchbar: true, serverSearchOption: true });
  };
  const inputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (serverState.serverSearchbar) {
      inputRef.current?.focus();
    }
  }, [serverState.serverSearchbar]);

  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        serverState.serverSearchbar &&
        !(e.target as HTMLElement).closest(".server-search-bar")
      ) {
        setServerState({
          serverSearchOption: false,
        });
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [serverState, setServerState]);

  // search 동작
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (serverState.searchKeyword) {
        chatSearch({ keyword: serverState.searchKeyword });
      }
    }
  };

  // 텍스트 끝에 커서 포커스 설정
  const setCursorToEnd = () => {
    if (inputRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // div search input
  const handleInput = () => {
    const usernamePrefix = "보낸유저:";
    const messagePrefix = "메시지:";
    if (inputRef.current) {
      // innerText에 "보낸유저:" 가 없다면, serverSearchOptionUser를 끔
      if (inputRef.current.innerText.indexOf(usernamePrefix) === -1) {
        setServerState({ serverSearchOptionUser: false });
      }

      // innerText에 "메시지:" 가 없다면, serverSearchOptionMessage를 끔
      if (inputRef.current.innerText.indexOf(messagePrefix) === -1) {
        setServerState({ serverSearchOptionMessage: false });
      }
      setServerState({
        searchKeyword: inputRef.current.innerText,
      });

      setTimeout(() => {
        setCursorToEnd();
      }, 0);
    }
  };

  // searchOption
  const handleClickSearchOptionButton = () => {
    setServerState({ serverSearchOption: true });
  };
  useEffect(() => {
    if (
      serverState.serverSearchbar &&
      (serverState.serverSearchOptionUser ||
        serverState.serverSearchOptionMessage)
    ) {
      inputRef.current?.focus();
      setCursorToEnd(); // 포커스를 끝으로 설정
    }
  }, [
    serverState.serverSearchOptionUser,
    serverState.serverSearchOptionMessage,
  ]);

  // search bar close
  const handleClickSearchCloseButton = () => {
    setServerState({
      serverSearchbar: false,
      serverSearchOption: false,
      serverSearchOptionUser: false,
      serverSearchOptionMessage: false,
      serverSearchList: false,
    });
  };

  return (
    <>
      {serverState.serverSearchbar ? (
        <div className={"relative"}>
          <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning={true}
            onKeyDown={(e) => handleKeyDown(e)}
            onInput={handleInput}
            className={
              "server-search-bar bg-searchbar relative flex h-full w-52 items-center rounded px-2 py-1 text-sm font-light"
            }
          >
            {serverState.serverSearchOptionUser ? (
              <div className={"bg-customDarkGray px-1 py-0.5 text-xs"}>
                보낸유저:
              </div>
            ) : null}
            {serverState.serverSearchOptionMessage ? (
              <div className={"bg-customDarkGray px-1 py-0.5 text-xs"}>
                메시지:
              </div>
            ) : null}
          </div>

          <div className={"absolute right-1 top-1"}>
            <button
              className={"mr-1"}
              onClick={() => {
                handleClickSearchOptionButton();
              }}
            >
              <svg
                width="14px"
                height="14px"
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
                    d="M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
            <button
              className={""}
              onClick={() => {
                handleClickSearchCloseButton();
              }}
            >
              <svg
                width="14px"
                height="14px"
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
                    d="M6 6L18 18M18 6L6 18"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => handleClickSearchButton()}
          className={
            "bg-searchbar flex w-44 cursor-text rounded px-2 py-1 text-sm text-gray-500"
          }
        >
          검색하기
          <svg
            className={"ml-auto"}
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
                d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
      )}
    </>
  );
}
