import { FC } from "react";

const Tick: FC = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      height="100%"
      width="100%"
      {...props}
    >
      <path
        d="M6.805 1.105c-.352.352-.317.88 0 1.23l4.254 4.009H.969a.833.833 0 0 0-.844.843v1.125c0 .493.352.844.844.844h10.09L6.805 13.2a.916.916 0 0 0 0 1.23l.773.774c.352.317.879.317 1.195 0l6.856-6.855c.316-.317.316-.844 0-1.196L8.773.332c-.316-.316-.843-.316-1.195 0l-.773.773Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Tick;
