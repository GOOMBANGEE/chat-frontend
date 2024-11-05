import useChatSearch from "../../../hook/server/serverChat/useChatSearch.tsx";

interface Props {
  currentPage?: number;
  totalPage?: number;
}

export default function PaginationBar(props: Readonly<Props>) {
  const { chatSearch } = useChatSearch();

  const currentPage = props.currentPage ? props.currentPage : 1;
  const totalPage = props.totalPage ? props.totalPage : 1;

  const renderPageNumbers = () => {
    let minPage = 1;
    let maxPage = (props.totalPage ?? 0 > 10) ? totalPage : 0;

    if (totalPage >= 7) {
      if (currentPage <= 3) {
        maxPage = 5;
      } else if (currentPage + 2 >= totalPage) {
        minPage = totalPage - 4;
      } else {
        minPage = currentPage - 2;
        maxPage = currentPage + 2;
      }
    }

    const pageNumbers = [];
    for (let i = minPage; i <= maxPage; i++) {
      const isActivePage = i === currentPage;
      pageNumbers.push(
        <button
          key={i}
          className={`${isActivePage ? "rounded-full bg-indigo-500" : ""} flex items-center justify-center border-0 px-2 text-lg font-semibold`}
          onClick={() => {
            if (isActivePage) {
              window.location.reload();
            }
            chatSearch({ page: i });
          }}
        >
          {i}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <div
      className={
        "mx-auto flex w-full justify-center border-0 font-semibold text-customText"
      }
    >
      <div className={"mx-6 my-2 flex p-1"}>
        {currentPage >= 4 ? (
          <>
            <button
              className={"px-1.5"}
              onClick={() => {
                chatSearch({ page: 1 });
              }}
            >
              〈〈
            </button>
            <button
              className={"px-1.5"}
              onClick={() => {
                chatSearch({
                  page:
                    currentPage >= totalPage - 2
                      ? totalPage - 5
                      : currentPage - 3,
                });
              }}
            >
              〈
            </button>
          </>
        ) : null}

        {renderPageNumbers()}

        {totalPage > 5 && totalPage - currentPage >= 3 ? (
          <>
            <button
              className={"px-1.5"}
              onClick={() => {
                chatSearch({ page: currentPage <= 2 ? 6 : currentPage + 3 });
              }}
            >
              〉
            </button>
            <button
              className={"px-1.5"}
              onClick={() => {
                chatSearch({ page: totalPage });
              }}
            >
              〉〉
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
