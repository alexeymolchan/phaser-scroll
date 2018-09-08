export const debounce = (f, ms) => {
  let timer = null;
  
  return (...args) => {
    const onComplete = () => {
      f.apply(this, args);
      timer = null;
    };
    
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(onComplete, ms);
  };
};

export const getPercentageFromSide = (percentage, side) => (side * percentage) / 100;

export const flatten = arr => arr.reduce((acc, next) => acc.concat(...next), []);