import { Bar } from "@/utils/types";
import { COLORS, generateUID, getRandomNum, wait } from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type MergeSortProps = {
  count?: number;
  speed?: number;
};

const MAX_BAR = 50;
const HEIGHT_CONSTANT = 8;

export const MergeSort: React.FC<MergeSortProps> = ({
  count = 30,
  speed = 10,
}) => {
  const [bars] = useState<Bar[]>(
    new Array(count).fill(0).map((_, idx) => ({
      prevTransform: 0,
      index: idx,
      value: getRandomNum(1, MAX_BAR),
      key: generateUID(),
    }))
  );
  const barsRef = useRef<Map<string, HTMLDivElement> | null>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [comparisonBars1, setComparisonBars1] = useState<Bar[]>([]);
  const comparisonBars1Ref = useRef<Map<string, HTMLDivElement> | null>(
    new Map()
  );

  const [comparisonBars2, setComparisonBars2] = useState<Bar[]>([]);
  const comparisonBars2Ref = useRef<Map<string, HTMLDivElement> | null>(
    new Map()
  );

  const getBarsMap = (
    barsRef: React.MutableRefObject<Map<string, HTMLDivElement> | null>
  ) => {
    if (!barsRef.current) {
      // Initialize the Map on first usage.
      barsRef.current = new Map();
    }
    return barsRef.current;
  };

  const speedRef = useRef(speed);

  const paintBar = (
    bar: Bar,
    color: string,
    barsRef: React.MutableRefObject<Map<string, HTMLDivElement> | null>
  ) => {
    const barNode = getBarsMap(barsRef).get(bar.key)!;
    barNode.style.backgroundColor = color;
  };
  const setBarValue = (bar: Bar, value: number) => {
    bar.value = value;
    const barNode = getBarsMap(barsRef).get(bar.key)!;
    barNode.style.height = `${bar.value * HEIGHT_CONSTANT}px`;
    barNode.querySelector("em")!.innerHTML = `${bar.value}`;
  };

  const highlight = ({
    color,
    bars,
  }: {
    color: string;
    bars: [Bar, React.MutableRefObject<Map<string, HTMLDivElement> | null>][];
  }) => {
    for (const [bar, barsRef] of bars) {
      paintBar(bar, color, barsRef);
    }
  };

  const animationWait = () => wait(10 / speedRef.current);

  const merge = async (
    arr1StartIdx: number,
    arr1EndIdx: number,
    arr2StartIdx: number,
    arr2EndIdx: number,
    barsClone: Bar[]
  ) => {
    let arr1Ptr = arr1StartIdx;
    let arr2Ptr = arr2StartIdx;
    let mainPtr = arr1StartIdx;
    const comparisonClone = barsClone.map((bar) => ({ ...bar }));
    const compBars1 = barsClone
      .slice(arr1StartIdx, arr1EndIdx + 1)
      .map((bar) => ({ ...bar }));
    setComparisonBars1(compBars1);
    await wait(0);
    const compBars2 = barsClone
      .slice(arr2StartIdx, arr2EndIdx + 1)
      .map((bar) => ({ ...bar }));
    setComparisonBars2(compBars2);
    await wait(0);

    while (arr1Ptr <= arr1EndIdx && arr2Ptr <= arr2EndIdx) {
      highlight({
        color: COLORS.Highlight,
        bars: [
          [compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref],
          [compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref],
        ],
      });

      highlight({
        color: COLORS.Minimum,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      if (comparisonClone[arr1Ptr].value <= comparisonClone[arr2Ptr].value) {
        highlight({
          color: COLORS.Swap,
          bars: [[compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref]],
        });
        await animationWait();
        setBarValue(barsClone[mainPtr], comparisonClone[arr1Ptr].value);
        await animationWait();
        highlight({
          color: COLORS.Unhighlight,
          bars: [[compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref]],
        });

        arr1Ptr++;
      } else {
        highlight({
          color: COLORS.Swap,
          bars: [[compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref]],
        });
        await animationWait();
        setBarValue(barsClone[mainPtr], comparisonClone[arr2Ptr].value);
        await animationWait();
        highlight({
          color: COLORS.Unhighlight,
          bars: [[compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref]],
        });
        arr2Ptr++;
      }
      highlight({
        color: COLORS.Unhighlight,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      mainPtr++;
    }

    while (arr1Ptr <= arr1EndIdx) {
      highlight({
        color: COLORS.Highlight,
        bars: [[compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref]],
      });
      highlight({
        color: COLORS.Minimum,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      highlight({
        color: COLORS.Swap,
        bars: [[compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref]],
      });
      await animationWait();
      setBarValue(barsClone[mainPtr], comparisonClone[arr1Ptr].value);
      await animationWait();
      highlight({
        color: COLORS.Unhighlight,
        bars: [[compBars1[arr1Ptr - arr1StartIdx], comparisonBars1Ref]],
      });
      highlight({
        color: COLORS.Unhighlight,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      arr1Ptr++;
      mainPtr++;
    }

    while (arr2Ptr <= arr2EndIdx) {
      highlight({
        color: COLORS.Highlight,
        bars: [[compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref]],
      });
      highlight({
        color: COLORS.Minimum,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      highlight({
        color: COLORS.Swap,
        bars: [[compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref]],
      });
      await animationWait();
      setBarValue(barsClone[mainPtr], comparisonClone[arr2Ptr].value);
      await animationWait();
      highlight({
        color: COLORS.Unhighlight,
        bars: [[compBars2[arr2Ptr - arr2StartIdx], comparisonBars2Ref]],
      });
      highlight({
        color: COLORS.Unhighlight,
        bars: [[barsClone[mainPtr], barsRef]],
      });
      await animationWait();
      arr2Ptr++;
      mainPtr++;
    }

    // setBars(Array.from(barsClone));
    // await animationWait();
  };

  const mergeHelper = async (
    startIdx: number,
    endIdx: number,
    barsClone: Bar[]
  ) => {
    if (startIdx == endIdx) return [startIdx, endIdx];
    const left = startIdx,
      right = endIdx;

    const mid = Math.floor((left + right) / 2);
    const [res1Start, res1End] = await mergeHelper(startIdx, mid, barsClone);
    const [res2Start, res2End] = await mergeHelper(mid + 1, endIdx, barsClone);
    await merge(res1Start, res1End, res2Start, res2End, barsClone);
    return [startIdx, endIdx];
  };

  useEffect(() => {
    const barsClone = bars.map((bar) => ({ ...bar }));
    mergeHelper(0, barsClone.length - 1, barsClone);
  }, []);

  // const helper = async () => {
  //   const barsClone = Array.from(bars);
  //   await merge(0, 0, 1, 1, barsClone);
  //   await merge(2, 2, 3, 3, barsClone);
  //   await merge(4, 4, 5, 5, barsClone);
  // };

  // useEffect(() => {
  //   helper();
  // }, []);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div className=" w-full flex flex-col justify-center">
      {createPortal(
        <InfoModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />,
        document.body
      )}
      <h1 className="text-4xl text-center font-bold mb-4">
        {" "}
        Merge Sort{" "}
        <button
          className="text-[#111] bg-[#ccc] p-2 rounded-full h-8 w-8 text-sm relative bottom-1 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span>i</span>
        </button>
      </h1>
      <div className={twMerge("flex w-full px-4", count > 40 && "flex-col")}>
        <Bars
          bars={bars}
          barMap={getBarsMap(barsRef)}
          height={400}
          heightConstant={8}
          className={twMerge("w-1/2", count > 40 && "w-4/5 mx-auto")}
        />
        <div className="w-1/2 mx-auto flex flex-col justify-center items-center my-4">
          <div className="flex gap-2 justify-between items-center">
            <Bars
              bars={comparisonBars1}
              barMap={getBarsMap(comparisonBars1Ref)}
              height={300}
              heightConstant={6}
            />
            <Bars
              bars={comparisonBars2}
              barMap={getBarsMap(comparisonBars2Ref)}
              height={300}
              heightConstant={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Bars: React.FC<{
  bars: Bar[];
  barMap: Map<string, HTMLDivElement>;
  height: number;
  heightConstant: number;
  className?: string;
}> = ({ bars, barMap, height, heightConstant, className }) => {
  return (
    <div
      style={{ height }}
      className={twMerge(
        "bg-blue-300 flex justify-between items-end",
        className
      )}
    >
      {bars.map((bar) => (
        <div
          key={bar.key}
          ref={(node) =>
            node ? barMap.set(bar.key, node) : barMap.delete(bar.key)
          }
          className={twMerge("bg-black w-5 relative transition")}
          style={{ height: heightConstant * bar.value }}
        >
          <em className="not-italic absolute top-0 left-[50%] -translate-x-[50%] text-white text-xs">
            {bar.value}
          </em>
        </div>
      ))}
    </div>
  );
};

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={twMerge(
        "fixed inset-0 bg-black/70 flex justify-center items-center transition h-screen",
        isOpen && "opacity-100 z-10",
        !isOpen && "opacity-0 -z-10"
      )}
      onClick={() => onClose()}
    >
      <div className="w-4/5 h-[80vh] overflow-y-auto bg-white rounded-lg p-4">
        <div className="max-w-[700px] mx-auto ">
          <h1 className="mx-auto text-center text-4xl font-bold mb-4">
            Merge Sort
          </h1>
          <p>
            Merge Sort is a divide and conquer sorting algorithm that sorts
            lists with a Big O Time complexity of O(Nlog(N)) and Big O Space
            Complexity of O(N) where N is the length of the input array. It is
            also a{" "}
            <a
              href="https://www.geeksforgeeks.org/stable-and-unstable-sorting-algorithms/"
              className="underline"
            >
              stable sorting algorithm
            </a>
            .
          </p>
          <h2 className="text-2xl font-semibold mt-4">Steps</h2>
          <p className="mb-4">
            We'll be using the array [8,4,3,9,0,1] to go through the steps
          </p>
          <ul className="list-disc space-y-2">
            <li className="">
              <span className="block">
                {" "}
                Slice the array in half till you get to an array of length 1.
              </span>
              <span>
                [8,4,3,9,0,1] -&gt; [8,4,3], [9,0,1] -&gt; [8,4], [3] -&gt; [8],
                [4]
              </span>
            </li>
            <li className="">
              <span className="block">
                Merge the arrays from the bottom up ensuring the resultant array
                is sorted
              </span>
              <span>[8], [4] -&gt; [4,8]</span>
            </li>
            <li className="">
              <span className="block">
                Arrays of size 1 are seen as already sorted so it is used as the
                base case e.g
              </span>
              <span>[3]</span>
            </li>
            <li className="">
              <span className="block">Merging</span>
              <span>[4,8], [3] -&gt; [3,4,8]</span>
            </li>
            <li className="">
              <span className="block">Split</span>
              <span>[9,0,1] -&gt; [9,0], [1] </span>
            </li>
            <li className="">
              <span className="block">Split</span>
              <span>[9,0] -&gt; [9], [0] </span>
            </li>
            <li className="">
              <span className="block">Merge</span>
              <span>[9], [0] -&gt; [0,9] </span>
            </li>
            <li className="">
              <span className="block">Merge</span>
              <span>[0,9], [1] -&gt; [0,1,9] </span>
            </li>
            <li className="">
              <span className="block">Merge</span>
              <span>[3,4,8], [0,1,9] -&gt; [0,1,3,4,8,9] </span>
            </li>
            <li className="">
              <span className="block">Sorted</span>
              <span>[0,1,3,4,8,9]🔥 </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
