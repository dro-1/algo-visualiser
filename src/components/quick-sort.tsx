import { Bar } from "@/utils/types";
import {
  COLORS,
  generateUID,
  getRandomNum,
  viewportHeight,
  wait,
} from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaInfoCircle } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { twMerge } from "tailwind-merge";
import { InfoModal } from "./info-modal";

type QuickSortProps = {
  count?: number;
  speed?: number;
};

const MAX_BAR = 50;

export const QuickSort: React.FC<QuickSortProps> = ({
  count = 30,
  speed = 10,
}) => {
  const [bars, setBars] = useState<Bar[]>(
    new Array(count).fill(0).map((_, idx) => ({
      prevTransform: 0,
      index: idx,
      value: getRandomNum(3, MAX_BAR),
      key: generateUID(),
      isMinimum: false,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const barsRef = useRef<Map<string, HTMLDivElement> | null>(new Map());
  const speedRef = useRef(speed);

  const animationWait = () => wait(10 / speedRef.current);

  const getBarsMap = () => {
    if (!barsRef.current) {
      // Initialize the Map on first usage.
      barsRef.current = new Map();
    }
    return barsRef.current;
  };

  const paintBar = (bar: Bar, color: string) => {
    const barNode = getBarsMap().get(bar.key)!;
    barNode.style.backgroundColor = color;
  };

  const highlight = ({ color, bars }: { color: string; bars: Bar[] }) => {
    for (const bar of bars) {
      paintBar(bar, color);
    }
  };

  const swap = async (bar1: Bar, bar2: Bar, barsClone: Bar[]) => {
    const bar1Node = getBarsMap().get(bar1.key)!;
    const bar2Node = getBarsMap().get(bar2.key)!;

    // Paint both bars as color for swapping
    highlight({
      color: COLORS.Swap,
      bars: [bar1, bar2],
    });

    // Get the space between the two bars dictating how much they need to move
    const xEndingBar1 =
      bar1Node.getBoundingClientRect().x +
      bar1Node.getBoundingClientRect().width;
    const xStartingBar2 = bar2Node.getBoundingClientRect().x;
    const gap = xStartingBar2 - xEndingBar1;
    const spaceToMove = gap + bar1Node.getBoundingClientRect().width;

    // Use CSS transforms to move the above amount of space
    bar1Node.style.transform = `translateX(${
      bar1.prevTransform + spaceToMove
    }px)`;
    bar1Node.style.zIndex = "3";
    bar2Node.style.transform = `translateX(${
      bar2.prevTransform - spaceToMove
    }px)`;
    bar1.prevTransform += spaceToMove;
    bar2.prevTransform -= spaceToMove;

    //Pause for effect
    await animationWait();

    // Perform swap in actual array and in bar.index values
    barsClone[bar1.index] = bar2;
    barsClone[bar2.index] = bar1;
    const temp = bar2.index;
    bar2.index = bar1.index;
    bar1.index = temp;

    // Unhighlight both bars involved in swapping
    highlight({
      color: COLORS.Unhighlight,
      bars: [bar1, bar2],
    });
  };

  const markAsSpecial = (bar: Bar, specialText: string, color: string) => {
    // Paint bar as minimum color
    highlight({
      color: color,
      bars: [bar],
    });

    const barNode = getBarsMap().get(bar.key)!;

    const specialNode = barNode.querySelector("p");
    if (specialNode) {
      if (specialNode.innerHTML == specialText.toUpperCase()) return;
      specialNode.innerHTML = "LEFT & RIGHT";
      specialNode.style.width = "270px";
      specialNode.style.top = bar.value < MAX_BAR / 2 ? "-160px" : "50%";
    } else {
      const minText = document.createElement("p");
      minText.classList.add(specialText.toLowerCase());
      minText.innerHTML = specialText.toUpperCase();
      const minTextStyle: Partial<CSSStyleDeclaration> = {
        fontSize: "1.4rem",
        position: "absolute",
        top: bar.value < MAX_BAR / 2 ? "-140px" : "50%",
        left: "50%",
        transform: "translateX(-50%) rotate(90deg)",
        zIndex: "5",
        color: "white",
        letterSpacing: "10px",
      };
      Object.assign(minText.style, minTextStyle);

      // Append node to barNode

      barNode.appendChild(minText);
    }
  };

  const removeAsSpecial = (bar: Bar) => {
    // Paint minimum bar back to normal
    highlight({
      color: COLORS.Unhighlight,
      bars: [bar],
    });

    // Remove textnode from inside minimum bar
    const barNode = getBarsMap().get(bar.key)!;
    const specialNode = barNode.querySelector("p");
    if (specialNode) barNode.removeChild(specialNode);
  };

  const selectPivot = async (startIdx: number, endIdx: number, bars: Bar[]) => {
    const pivotIdx = getRandomNum(startIdx, endIdx);

    markAsSpecial(bars[pivotIdx], "pivot", COLORS.Minimum);
    await animationWait();

    if (pivotIdx != startIdx) {
      await swap(bars[startIdx], bars[pivotIdx], bars);
    }

    // Pivot is now ar index 0
    highlight({
      color: COLORS.Minimum,
      bars: [bars[startIdx]],
    });
    await animationWait();
  };

  const quickSelectHelper = async (
    startIdx: number,
    endIdx: number,
    bars: Bar[]
  ) => {
    if (startIdx >= endIdx) {
      if (startIdx == endIdx) {
        highlight({
          color: COLORS.Finished,
          bars: [bars[startIdx]],
        });
        await animationWait();
      }

      return;
    }
    // Select Pivot
    await selectPivot(startIdx, endIdx, bars);

    const pivot = startIdx;
    let left = startIdx + 1,
      right = endIdx;
    markAsSpecial(bars[left], "left", COLORS.Left);
    markAsSpecial(bars[right], "right", COLORS.Right);
    await animationWait();

    while (left <= right) {
      if (
        bars[left].value > bars[pivot].value &&
        bars[right].value < bars[pivot].value
      ) {
        await swap(bars[left], bars[right], bars);
        removeAsSpecial(bars[left]);
        removeAsSpecial(bars[right]);
      }
      if (bars[left].value <= bars[pivot].value) {
        removeAsSpecial(bars[left]);
        left++;
        if (left < endIdx) {
          markAsSpecial(bars[left], "left", COLORS.Left);
          await animationWait();
        }
      }
      if (bars[right].value >= bars[pivot].value) {
        removeAsSpecial(bars[right]);
        right--;
        if (right > pivot) {
          markAsSpecial(bars[right], "right", COLORS.Right);
          await animationWait();
        }
      }
      if (left < endIdx) markAsSpecial(bars[left], "left", COLORS.Left);
      if (right > pivot) markAsSpecial(bars[right], "right", COLORS.Right);
    }

    // insert position is at right index
    await animationWait();
    if (right > pivot) await swap(bars[pivot], bars[right], bars);
    await animationWait();
    removeAsSpecial(bars[pivot]);
    if (right > pivot) removeAsSpecial(bars[right]);
    if (left < endIdx) removeAsSpecial(bars[left]);

    highlight({
      color: COLORS.Finished,
      bars: [bars[right]],
    });

    // recursively call the function
    await quickSelectHelper(startIdx, right - 1, bars);
    await quickSelectHelper(right + 1, endIdx, bars);
  };

  const quickSelect = async () => {
    const barsClone = Array.from(bars);
    await quickSelectHelper(0, bars.length - 1, barsClone);
  };

  useEffect(() => {
    quickSelect();
  }, [bars]);

  useEffect(() => {
    setBars(
      new Array(count).fill(0).map((_, idx) => ({
        prevTransform: 0,
        index: idx,
        value: getRandomNum(3, MAX_BAR),
        key: generateUID(),
      }))
    );
  }, [count]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div className="h-[80%] w-[98%] mx-auto flex flex-col justify-center">
      {createPortal(
        <QuickSortInfoModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />,
        document.body
      )}
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-4xl text-center font-bold justify-center items-center inline-block">
          Quick Sort
        </h1>
        <button
          className="text-[#111] bg-[#ccc] p-2 rounded-full h-10 w-10 text-sm cursor-pointer ml-4"
          onClick={() => setIsModalOpen(true)}
        >
          <FaInfoCircle className="text-2xl" />
        </button>
        <button
          className="text-[#111] bg-[#ccc] p-2 rounded-full h-10 w-10 text-sm cursor-pointer ml-4"
          onClick={() =>
            setBars(
              new Array(count).fill(0).map((_, idx) => ({
                prevTransform: 0,
                index: idx,
                value: getRandomNum(3, MAX_BAR),
                key: generateUID(),
              }))
            )
          }
        >
          <GrPowerReset className="text-2xl" />
        </button>
      </div>
      <div
        className="bg-blue-300 flex justify-between items-end mb-4"
        style={{ height: 0.78 * viewportHeight }}
      >
        {bars.map((bar) => (
          <div
            key={bar.key}
            ref={(node) =>
              node
                ? getBarsMap().set(bar.key, node)
                : getBarsMap().delete(bar.key)
            }
            className={twMerge("bg-black w-5 relative transition")}
            style={{ height: (bar.value / MAX_BAR) * (0.78 * viewportHeight) }}
          >
            <em className="not-italic absolute top-0 left-[50%] -translate-x-[50%] text-white text-xs">
              {bar.value}
            </em>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickSortInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <h1 className="mx-auto text-center text-4xl font-bold mb-4">
            Quick Sort
          </h1>
          <p>
            Quick Sort is a divide and conquer sorting algorithm that sorts
            lists with an average Big O Time complexity of O(Nlog(N)) that can
            degrade to O(N<sup>2</sup>) in the worst case and Big O Space
            Complexity of O(N) where N is the length of the input array. It is
            an
            <a
              href="https://www.geeksforgeeks.org/stable-and-unstable-sorting-algorithms/"
              className="underline"
            >
              {" "}
              unstable sorting algorithm
            </a>
            . A major factor that affects how fast the list will be sorted is
            the partitioning scheme. For this example, we'd be using Hoare
            partition scheme.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Steps</h2>
          <p className="mb-4">
            We'll be using the array [8,4,3,9,0,1] to go through the steps.
          </p>
          <ul className="space-y-2">
            <li className="">
              <span className="block">
                {" "}
                - We'll select a random number from [8,4,3,9,0,1] as our pivot.
              </span>
              <span>[8,4,3,9,0,1] -&gt; 3</span>
            </li>
            <li className="">
              <span className="block">
                - We then swap the pivot with the number at index 0.
              </span>
              <span>[8,4,3,9,0,1] -&gt; [3,4,8,9,0,1]</span>
            </li>
            <li className="">
              <span className="block">
                - We then initialise 2 pointers: left, immediately after the
                pivot and right, at the end of the array.
              </span>
              <span>[3,4,8,9,0,1]; Pivot: 3; Left: 4; Right: 1</span>
            </li>
            <li className="">
              <span className="block">
                - If left is greater than pivot and right is less than pivot,
                swap left and right.
              </span>
            </li>
            <li className="">
              <span className="block">
                - If left is less than or equal to pivot, move left forward by
                one.
              </span>
            </li>
            <li className="">
              <span className="block">
                - If right is greater than or equal to pivot, move right
                backward by one.
              </span>
            </li>
            <li className="">
              <span className="block">
                - Repeat the three steps above till the left pointer is greater
                than the right. From our example, we'd now have.
              </span>
              <span>[3,4,8,9,0,1] -&gt; [3,1,0,9,8,4] </span>
            </li>
            <li className="">
              <span className="block">
                - Swap the values at the pivot position and the right index.
                This would put the pivot in its sorted position in the array.
              </span>
              <span>[3,1,0,9,8,4] -&gt; [0,1,3,9,8,4] </span>
            </li>
            <li className="">
              <span className="block">
                - Recursively perform the above on the subarrays: [start of
                array to right index - 1] and [right index + 1 to end of array].
                For the base case, any subarray that is of length one can be
                returned immediately as it is already sorted.
              </span>
            </li>
            <li className="">
              <span className="block">
                - When all recursive calls are completed, the array will be
                sorted🔥
              </span>
            </li>
          </ul>
        </>
      }
    />
  );
};
