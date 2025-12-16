import { SM2Data } from './types';

export const calculateSM2 = (currentData: SM2Data, quality: number): SM2Data => {
  let { ease, interval, repetitions } = currentData;

  let newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEase < 1.3) newEase = 1.3;

  let newInterval = 0;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * ease);
    newRepetitions++;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  const now = new Date();
  const nextReview = now.setDate(now.getDate() + newInterval);

  return { ease: newEase, interval: newInterval, repetitions: newRepetitions, nextReview };
};

export const initialSM2: SM2Data = { ease: 2.5, interval: 0, repetitions: 0, nextReview: null };
