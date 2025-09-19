export const secondsPerYear = BigInt(365.25 * 24 * 60 * 60);
export const millionYears = BigInt(1e6) * secondsPerYear;

// https://www.aanda.org/articles/aa/full_html/2020/09/aa33910-18/aa33910-18.html
export const secondsTil2020 = BigInt(13780) * millionYears;

export const calendarYear = (year: number) => {
  return secondsTil2020 - BigInt(2020 - year) * secondsPerYear;
};

export const unixEpoch = calendarYear(1970);
