import { Bar } from "@/utils/types";
import { COLORS, generateUID, getRandomNum, wait } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type InsertionSortProps = {
  count?: number;
  speed?: number;
};

const MAX_BAR = 50;

export const InsertionSort: React.FC<InsertionSortProps> = ({
  count = 30,
  speed = 10,
}) => {
  const [bars, setBars] = useState<Bar[]>(
    new Array(count).fill(0).map((_, idx) => ({
      prevTransform: 0,
      index: idx,
      value: getRandomNum(1, MAX_BAR),
      isHighlighted: false,
      isInFinalPosition: false,
      key: generateUID(),
      isMinimum: false,
    }))
  );

  const barsRef = useRef<Map<string, HTMLDivElement> | null>(new Map());
  const speedRef = useRef(speed);

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
    await wait(10 / speedRef.current);

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

  const compareBars = async () => {
    const barsClone = Array.from(bars);
    // First bar is automatically sorted
    highlight({
      color: COLORS.InsertionSorted,
      bars: [barsClone[0]],
    });

    //Loop through all bars
    for (let i = 1; i < barsClone.length; i++) {
      let j = i;
      while (j > 0) {
        highlight({
          color: COLORS.Highlight,
          bars: [barsClone[j], barsClone[j - 1]],
        });
        await wait(10 / speedRef.current);

        if (barsClone[j].value < barsClone[j - 1].value) {
          await swap(barsClone[j], barsClone[j - 1], barsClone);
          highlight({
            color: COLORS.InsertionSorted,
            bars: [barsClone[j], barsClone[j - 1]],
          });
        } else {
          highlight({
            color: COLORS.InsertionSorted,
            bars: [barsClone[j], barsClone[j - 1]],
          });
          break;
        }
        j--;
      }
    }

    for (const bar of barsClone) {
      highlight({
        color: COLORS.Finished,
        bars: [bar],
      });
      const barNode = getBarsMap().get(bar.key)!;
      barNode.style.transition = "none";
      barNode.style.transform = "";
    }
    setBars(barsClone);
  };

  useEffect(() => {
    compareBars();
  }, []);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div className="h-[90%] w-full flex flex-col justify-center">
      <h1 className="text-4xl text-center font-bold mb-4">Insertion Sort</h1>
      <div className="bg-blue-300 flex justify-between items-end">
        {bars.map((bar) => (
          <div
            key={bar.key}
            ref={(node) =>
              node
                ? getBarsMap().set(bar.key, node)
                : getBarsMap().delete(bar.key)
            }
            className={twMerge("bg-black w-5 relative transition")}
            style={{ height: 14 * bar.value }}
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
