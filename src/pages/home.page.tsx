import { BubbleSort } from "@/components/bubble-sort";
import { InsertionSort } from "@/components/insertion-sort";
import { MergeSort } from "@/components/merge-sort";
import { SelectionSort } from "@/components/selection-sort";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const speeds = [0.25, 0.5, 1, 2, 4];
const barCounts = [10, 20, 30, 50, 100];

const speedMultiplier = 15;

enum SorterState {
  InsertionSort,
  SelectionSort,
  BubbleSort,
  MergeSort,
}

export const Homepage = () => {
  const [sorterState, setSorterState] = useState<SorterState | null>(
    SorterState.InsertionSort
  );
  const [speed, setSpeed] = useState(1);
  const [barsCount, setBarsCount] = useState(20);

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
  ];

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <nav className="flex flex-col justify-between items-center bg-black/75 w-full p-4">
        <h1
          className="text-3xl text-center text-white mb-4"
          style={{
            fontFamily: "Fredericka the Great",
          }}
        >
          Sorting Visualizer
        </h1>
        <div className="w-full flex items-center">
          <div className="flex items-center">
            <span className="text-white font-semibold">Speed:</span>
            <div className="ml-2 mr-8">
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
          <div className="flex items-center">
            <span className="text-white font-semibold">No of Bars:</span>
            <div className="ml-2 mr-8">
              {barCounts.map((iBarsCount, idx) => (
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

          <div className="flex justify-between items-center w-[550px]">
            {sorters.map((sorter, idx) => (
              <button
                key={idx}
                className="text-md bg-blue-400 text-white p-2 rounded-lg"
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
      </div>
    </div>
  );
};

/*
Merge sort works by splitting the array into two and it continues to split it until
the array is of length 1 or 0

At that point, you then have a merge function that merges the sorted arrays
so it merges arrays of length 1 to create arrays of length 2
next, it merges arrays of length 2 to create arrays of length 4

*/
