import React, { useEffect, useRef } from "react";
import useChatSearch from "../../../../hook/server/serverChat/useChatSearch.tsx";
import { useServerStore } from "../../../../store/ServerStore.tsx";
import { useChatStore } from "../../../../store/ChatStore.tsx";

export default function ChatSearchbar() {
  const { chatSearch } = useChatSearch();
  const { serverState, setServerState } = useServerStore();
  const { chatSearchListState, setChatSearchListState } = useChatStore();

  const inputRefDefault = useRef<HTMLDivElement>(null);
  const inputRefUser = useRef<HTMLDivElement>(null);
  const inputRefMessage = useRef<HTMLDivElement>(null);

  // 기본 동작
  // 텍스트 끝에 커서 포커스 설정
  const setCursorToEnd = (ref: React.RefObject<HTMLSpanElement>) => {
    if (ref.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };
  // 클릭시 자동 포커스
  const handleClickSearchbar = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".server-search-bar")) {
      if (!serverState.searchOption) {
        setFocusAndCursor(inputRefDefault);
      }
    }
  };
  const setFocusAndCursor = (ref: React.RefObject<HTMLSpanElement>) => {
    ref.current?.focus();
    setCursorToEnd(ref);
    return;
  };
  const handleClickSearchButton = () => {
    setServerState({ searchbar: true, searchOptionMenu: true });
  };
  useEffect(() => {
    if (serverState.searchbar) {
      setFocusAndCursor(inputRefDefault);
    }
  }, [serverState.searchbar]);

  // search option button
  const handleClickSearchOptionButton = () => {
    setServerState({ searchOptionMenu: true });
  };
  // search bar close
  const handleClickSearchCloseButton = () => {
    setServerState({
      searchList: false,
      searchbar: false,
      searchOptionMenu: false,
      searchOption: false,
      searchOptionUser: false,
      searchOptionMessage: false,
    });
    setChatSearchListState({
      searchDefault: undefined,
      searchUser: undefined,
      searchMessage: undefined,
    });
  };
  // 바깥쪽 클릭시 close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        serverState.searchbar &&
        !(e.target as HTMLElement).closest(".server-search-bar")
      ) {
        setServerState({
          searchOptionMenu: false,
        });
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [serverState, setServerState]);

  // search 동작
  const handleKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setServerState({ serverUserList: false });
      chatSearch({ page: 1 });
    }
  };

  // option 추가 동작
  // default, option 값 입력
  const handleInput = (
    ref: React.RefObject<HTMLSpanElement>,
    stateKey: string,
  ) => {
    if (ref.current) {
      setServerState({ [stateKey]: ref.current.innerText });
    }
  };
  useEffect(() => {
    setChatSearchListState({
      searchDefault: inputRefDefault.current?.innerText,
      searchUser: inputRefUser.current?.innerText,
      searchMessage: inputRefMessage.current?.innerText,
    });
  }, [
    inputRefDefault.current?.innerText,
    inputRefUser.current?.innerText,
    inputRefMessage.current?.innerText,
  ]);

  // default에서 옵션이름: 추가시, 옵션추가
  // 옵션 추가시, default 내용삭제, 해당 옵션 맨뒤로 포커스
  // user에서 메시지: 추가시 -> "메시지:" 부분만 잘라내서 OptionMessage에 넣어줌
  const optionUser = "유저이름:";
  const optionMessage = "메시지:";
  // 옵션 변경시 맨뒤로 포커스 이동
  useEffect(() => {
    // option 없을때
    if (!serverState.searchOption) {
      setCursorToEnd(inputRefDefault);
    }
    // user 옵션만 있을때
    else if (serverState.searchOptionUser && !serverState.searchOptionMessage) {
      setCursorToEnd(inputRefUser);
    }
    // message 옵션 있을때
    else if (serverState.searchOptionMessage) {
      setCursorToEnd(inputRefMessage);
    }
  }, [
    chatSearchListState.searchDefault,
    serverState.searchOptionUser,
    serverState.searchOptionMessage,
  ]);

  // 유저옵션이 지워졌을때, 내용삭제
  // message 옵션이 있는가? -> message 맨뒤로 이동
  // message 옵션이 없는가? -> default 로 이동
  // 내용: 값 추가시 -> message option 켬
  const optionDelete = (
    ref: React.RefObject<HTMLSpanElement>,
    option: string,
    checkState: boolean,
    deleteState: string,
  ) => {
    if (!ref.current) return;
    // ref에서 option이 지워졌을때,
    if (ref.current?.innerText.indexOf(option) === -1) {
      // checkState가 있는가? -> 해당 옵션만 delete
      if (checkState) {
        setServerState({
          [deleteState]: false,
        });
      } else {
        // checkState가 없는가? -> 모든 옵션이 없는것 -> option false로 하여 default상태
        setServerState({
          searchOption: false,
          [deleteState]: false,
        });
      }
      // ref의 내용 비우기
      ref.current.innerText = "";
    }
  };
  // 옵션 추가
  const optionUpdate = (
    ref: React.RefObject<HTMLSpanElement>,
    option: string,
    updateOption: string,
  ) => {
    if (!ref.current) return;
    if (ref.current?.innerText.indexOf(option) !== -1) {
      // 이미 옵션이 있는경우
      if (serverState.searchOption) {
        // 기존 innerText에서 옵션에 해당하는 부분 자르기
        setServerState({
          [updateOption]: true,
        });
        ref.current.innerText = ref.current.innerText.slice(
          0,
          ref.current.innerText.indexOf(option),
        );
      } else {
        // 기존에 옵션이 없는 경우 (default에서 옵션 추가시)
        // option true, update option true, innerText 비우기
        setServerState({
          searchOption: true,
          [updateOption]: true,
        });
        ref.current.innerText = "";
      }
    }
  };

  // default에서 옵션 추가
  useEffect(() => {
    optionUpdate(inputRefDefault, optionUser, "searchOptionUser");
    optionUpdate(inputRefDefault, optionMessage, "searchOptionMessage");
  }, [inputRefDefault.current?.innerText]);
  // user에서 옵션 추가, 삭제
  useEffect(() => {
    optionDelete(
      inputRefUser,
      optionUser,
      serverState.searchOptionMessage,
      "searchOptionUser",
    );
    optionUpdate(inputRefUser, optionMessage, "searchOptionMessage");
  }, [inputRefUser.current?.innerText]);
  // message에서 옵션 삭제
  useEffect(() => {
    optionDelete(
      inputRefMessage,
      optionMessage,
      serverState.searchOptionUser,
      "searchOptionMessage",
    );
  }, [inputRefMessage.current?.innerText]);

  const refFocus = (
    e: React.MouseEvent,
    selector: string,
    ref: React.RefObject<HTMLSpanElement>,
  ) => {
    if (!(e.target as HTMLElement).closest(selector)) {
      setFocusAndCursor(ref);
    }
  };

  const renderPage = () => {
    if (serverState.searchbar) {
      return (
        <div className={"relative"}>
          <div
            onClick={(e) => handleClickSearchbar(e)}
            onKeyDown={(e) => handleKeyEnter(e)}
            className={
              "server-search-bar flex h-7 w-52 cursor-text items-center whitespace-nowrap bg-customDark_1 pr-12"
            }
          >
            {!serverState.searchOption ? (
              <span
                ref={inputRefDefault}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={() => handleInput(inputRefDefault, "searchDefault")}
                className={
                  "relative flex items-center overflow-x-hidden rounded px-2 text-sm font-light outline-none"
                }
              ></span>
            ) : null}
            {serverState.searchOptionUser ? (
              <div
                onClick={(e) =>
                  refFocus(e, ".search-option-user", inputRefUser)
                }
                className={`${chatSearchListState.searchMessage ? "" : "w-full"}`}
              >
                <span
                  ref={inputRefUser}
                  contentEditable
                  suppressContentEditableWarning={true}
                  onInput={() => handleInput(inputRefUser, "searchUser")}
                  className={
                    "search-option-user w-full bg-customDark_5 px-1 text-xs outline-none"
                  }
                >
                  {optionUser}
                </span>
              </div>
            ) : null}
            {serverState.searchOptionMessage ? (
              <div
                onClick={(e) =>
                  refFocus(e, ".search-option-message", inputRefMessage)
                }
                className={"w-full"}
              >
                <span
                  ref={inputRefMessage}
                  contentEditable
                  suppressContentEditableWarning={true}
                  onInput={() => handleInput(inputRefMessage, "searchMessage")}
                  className={
                    "search-option-message w-full bg-customDark_5 px-1 text-xs outline-none"
                  }
                >
                  {optionMessage}
                </span>
              </div>
            ) : null}
          </div>

          <div className={"absolute right-1 top-1.5 flex items-center"}>
            <button
              className={"mr-1"}
              onClick={() => {
                handleClickSearchOptionButton();
              }}
            >
              <svg
                width="18px"
                height="18px"
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
                    className={"stroke-customGray_4"}
                    d="M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
            <button
              onClick={() => {
                handleClickSearchCloseButton();
              }}
            >
              <svg
                width="18px"
                height="18px"
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
                    className={"stroke-customGray_4"}
                    d="M6 6L18 18M18 6L6 18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleClickSearchButton()}
        className={
          "flex w-44 cursor-text rounded bg-customDark_1 px-2 py-1 text-sm text-gray-500"
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
              className={"stroke-customGray_4"}
              d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
    );
  };

  return renderPage();
}
