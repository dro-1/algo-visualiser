import { BubbleSort } from "@/components/bubble-sort";
import { InsertionSort } from "@/components/insertion-sort";
import { SelectionSort } from "@/components/selection-sort";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const speeds = [0.25, 0.5, 1, 2, 4];

const speedMultiplier = 15;

enum SorterState {
  InsertionSort,
  SelectionSort,
  BubbleSort,
}

export const Homepage = () => {
  const [sorterState, setSorterState] = useState<SorterState | null>(null);
  const [speed, setSpeed] = useState(1);

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
  ];

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div>
        <h1
          className="text-6xl text-center mb-8"
          style={{
            fontFamily: "Fredericka the Great",
          }}
        >
          Sorting Visualizer
        </h1>
        <div className="mb-2 flex justify-between w-[300px] mx-auto">
          {speeds.map((iSpeed, idx) => (
            <button
              key={idx}
              className={twMerge(
                "p-2 bg-black text-white rounded-lg border",
                iSpeed == speed && "bg-white text-black"
              )}
              onClick={() => setSpeed(iSpeed)}
            >
              {iSpeed}X
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center w-[550px]">
          {sorters.map((sorter, idx) => (
            <button
              key={idx}
              className="text-2xl bg-blue-400 text-white p-3 rounded-lg"
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
      <div className="mt-4 w-full">
        {sorterState == SorterState.InsertionSort && (
          <InsertionSort speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.BubbleSort && (
          <BubbleSort speed={speed * speedMultiplier} />
        )}
        {sorterState == SorterState.SelectionSort && (
          <SelectionSort speed={speed * speedMultiplier} />
        )}
      </div>
    </div>
  );
};
