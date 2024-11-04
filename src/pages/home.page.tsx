import { BubbleSort } from "@/components/bubble-sort";
import { InsertionSort } from "@/components/insertion-sort";
import { MergeSort } from "@/components/merge-sort";
import { QuickSort } from "@/components/quick-sort";
import { SelectionSort } from "@/components/selection-sort";
import { useMediaQuery } from "@/utils/hooks";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";

const speeds = [0.25, 0.5, 1, 2, 4, 10];
const barCounts = [10, 20, 30, 50, 100];

const speedMultiplier = 15;

enum SorterState {
  InsertionSort,
  SelectionSort,
  BubbleSort,
  MergeSort,
  QuickSort,
}

export const Homepage = () => {
  const [sorterState, setSorterState] = useState<SorterState | null>(
    SorterState.InsertionSort
  );
  const [speed, setSpeed] = useState(10);
  const [barsCount, setBarsCount] = useState(20);
  const [isSorterOptionsOpen, setIsSorterOptionsOpen] = useState(false);

  const { isMediaQueryMatched } = useMediaQuery(800);

  const sorters: { sorterState: SorterState; text: string }[] = [
    {
      text: "Insertion Sort",
      sorterState: SorterState.InsertionSort,
    },
    {
      text: "Selection Sort",
      sorterState: SorterState.SelectionSort,
    },
    {
      text: "Bubble Sort",
      sorterState: SorterState.BubbleSort,
    },
    {
      text: "Merge Sort",
      sorterState: SorterState.MergeSort,
    },
    {
      text: "Quick Sort",
      sorterState: SorterState.QuickSort,
    },
  ];

  useEffect(() => {
    setIsSorterOptionsOpen(false);
  }, [sorterState, speed, barsCount]);

  const activeBarCounts = isMediaQueryMatched
    ? barCounts
    : barCounts.slice(0, 2);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center relative">
      <nav
        className={twMerge(
          "absolute top-0 left-0 flex flex-col justify-between items-center bg-black/75 w-full p-4 transition z-10 -translate-y-full",
          isSorterOptionsOpen && "translate-y-0",
          isMediaQueryMatched && "static translate-y-0"
        )}
      >
        <h1
          className="text-3xl text-center text-white mb-4"
          style={{
            fontFamily: "Fredericka the Great",
          }}
        >
          Sorting Visualizer
        </h1>
        {!isMediaQueryMatched && (
          <button
            className={twMerge(
              "absolute right-4 top-4 w-6 h-6 bg-black text-white rounded-full flex justify-center items-center text-2xl"
            )}
            onClick={() => setIsSorterOptionsOpen(false)}
          >
            <IoMdClose />
          </button>
        )}

        <div
          className={twMerge(
            "w-full flex flex-col justify-center space-y-4 items-center"
          )}
        >
          <div
            className={twMerge(
              "flex flex-col",
              isMediaQueryMatched && "flex-row space-x-4"
            )}
          >
            <div className="flex flex-col items-center">
              <span className="text-white font-semibold">Speed:</span>
              <div className="flex">
                {speeds.map((iSpeed, idx) => (
                  <button
                    key={idx}
                    className={twMerge(
                      "p-2 bg-black text-white rounded-lg border mr-2",
                      iSpeed == speed && "bg-white text-black"
                    )}
                    onClick={() => setSpeed(iSpeed)}
                  >
                    {iSpeed}X
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white font-semibold">No of Bars:</span>
              <div className="flex">
                {activeBarCounts.map((iBarsCount, idx) => (
                  <button
                    key={idx}
                    className={twMerge(
                      "p-2 bg-black text-white rounded-lg border mr-2",
                      iBarsCount == barsCount && "bg-white text-black"
                    )}
                    onClick={() => setBarsCount(iBarsCount)}
                  >
                    {iBarsCount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={twMerge(
              "flex flex-wrap justify-between items-center",
              isMediaQueryMatched && "space-x-2"
            )}
          >
            {sorters.map((sorter, idx) => (
              <button
                key={idx}
                className="text-md bg-blue-400 text-white p-2 rounded-lg w-[150px] my-1"
                style={{
                  fontFamily: "Fredericka the Great",
                }}
                onClick={() => setSorterState(sorter.sorterState)}
              >
                {sorter.text}
              </button>
            ))}
          </div>
        </div>
      </nav>
      {!isMediaQueryMatched && (
        <button
          onClick={() => setIsSorterOptionsOpen(true)}
          className="p-2 bg-[#ccc] rounded-lg my-2"
        >
          {isSorterOptionsOpen ? "Close " : "Open "}
          Sorting Options
        </button>
      )}

      <div className="mt-4 w-full grow">
        {sorterState == SorterState.InsertionSort && (
          <InsertionSort count={barsCount} speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.BubbleSort && (
          <BubbleSort count={barsCount} speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.SelectionSort && (
          <SelectionSort count={barsCount} speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.MergeSort && (
          <MergeSort count={barsCount} speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.QuickSort && (
          <QuickSort count={barsCount} speed={speed * speedMultiplier} />
        )}
      </div>
    </div>
  );
};
