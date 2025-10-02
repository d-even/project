export function extractFeatures(
  keystrokes: number[],
  mouseVelocities: number[],
  scrollVelocities: number[]
) {
  function mean(arr: number[]) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  function variance(arr: number[]) {
    const avg = mean(arr);
    return arr.length ? arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length : 0;
  }

  return {
    avgKeystrokeInterval: mean(keystrokes),
    keystrokeVariance: variance(keystrokes),
    avgMouseVelocity: mean(mouseVelocities),
    mouseVelocityVariance: variance(mouseVelocities),
    avgScrollVelocity: mean(scrollVelocities)
  };
}
