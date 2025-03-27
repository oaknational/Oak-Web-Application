type Noop = () => void;

const noop: Noop = () => {};
export default noop;

type AsyncNoop = () => Promise<void>;

export const asyncNoop: AsyncNoop = async () => {};
