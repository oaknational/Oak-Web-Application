type Noop = () => void;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: Noop = () => {};
export default noop;

type AsyncNoop = () => Promise<void>;
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const asyncNoop: AsyncNoop = async () => {};
