export const bytesToMB = (bytes: number) => {
  return (bytes / (1024 * 1024)).toPrecision(2);
}