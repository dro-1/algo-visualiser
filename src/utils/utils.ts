export const getRandomNum = (min: number, max: number) => {
  return Math.max(min, Math.floor(Math.random() * max));
};

//Ref: https://stackoverflow.com/a/6248722
export const generateUID = () => {
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  return (
    ("000" + firstPart.toString(36)).slice(-6) +
    ("000" + secondPart.toString(36)).slice(-6)
  );
};

export const wait = (secondsToWait: number) =>
  new Promise((resolve) => setTimeout(resolve, secondsToWait * 1000));

export const COLORS = {
  Highlight: "rgb(253 224 71)",
  Unhighlight: "black",
  Swap: "rgb(34 197 94)",
  Minimum: "rgb(168 85 247)",
  Finished: "rgb(239 68 68)",
  InsertionSorted: "rgb(249 115 22)",
};
