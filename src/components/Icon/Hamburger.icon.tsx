import { FC } from "react";

const Hamburger: FC = () => (
  <svg
    width="100%"
    height="100%"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="a"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="2"
      y="5"
      width="26"
      height="20"
    >
      <path fill="#D9D9D9" d="M2 5.5h26v19H2z" />
    </mask>
    <g mask="url(#a)" fill="#000">
      <path d="M3 13.578c.342-.497.705-.586 1.083-.577 2.503.055 5.002.075 7.502.171 2.604.097 5.207.28 7.81.389 1.99.082 3.981.09 5.971.172.37.04.735.149 1.093.326.322.14.52.78.484 1.404a7.576 7.576 0 0 0-.008.688c.015.217.037.432.065.644-.19.086-.383.143-.578.172-1.458.009-2.919.086-4.375-.031-1.53-.124-3.06-.101-4.588-.151-3.498-.115-6.995-.24-10.493-.378-.863-.036-1.724-.186-2.585-.305a2.023 2.023 0 0 1-.658-.226c-.474-.251-.7-.86-.715-1.812.003-.153-.004-.293-.008-.486Zm23.068.703v.117h.258v-.141l-.258.024Zm.03 1.94c.117-.62.117-.62-.079-.596.022.2.048.398.074.596h.005Zm-6.279.256-.018.084h.447v-.084h-.429Zm-.149-1.115-.013-.057h-.237v.057h.25Zm6.82 1.39.015-.094h-.336v.094h.32ZM6.214 9.778c-.095.085-.234.302-.345.297-.773-.03-1.616.441-2.34-.18.21-1.219.437-2.373.316-3.56.265-.116.51-.312.732-.306 1.235.038 2.462.142 3.696.189.72.027 1.465-.135 2.165.014.7.149 1.416.067 2.135-.012.97-.108 1.951-.343 2.918-.425.808-.067 1.6.015 2.402.019 1.298.003 2.594.031 3.898-.013a12.22 12.22 0 0 1 4.173.577.98.98 0 0 1 .237.157c.59.42.61.52.472 2.085-.083.94-.224 1.325-.642 1.463a2.734 2.734 0 0 1-1.101.107c-1.23-.092-2.45-.254-3.681-.33-1.481-.096-2.958-.176-4.446-.18-1.094.002-2.203.132-3.307.225-1.148.099-2.299.218-3.45.338-.239.026-.408-.274-.671-.228-.672.125-1.328.067-1.99.078-.318.004-.636.01-.95-.02-.067-.01-.123-.163-.221-.295Zm.18-3.075c.072.32.391-.125.299.564a.468.468 0 0 0 .157-.002c.089-.56.275-.254.463-.435l-.92-.127Zm2.554.257.01-.072-.323-.045-.01.073.323.044Zm-.207.331-.013.094.285-.01.006-.045-.278-.039Zm1.311.216.002-.01-.238-.033-.001.01.237.033Zm-4.717-.61.009-.067-.155-.021-.016.039.162.048ZM24.217 19.887c.174-.122.352-.213.533-.273a7.985 7.985 0 0 1 1.314-.1c.284 0 .567.113.884.186-.032.59-.088 1.11-.08 1.623.01.514.08 1.01.132 1.632-.29.055-.586.146-.882.16a21.88 21.88 0 0 1-1.64 0c-.75-.027-1.501-.102-2.252-.107-1.361 0-2.723-.026-4.084.052-.925.052-1.846.325-2.771.385-.941.06-1.885-.045-2.826-.038-1.195 0-2.39.055-3.584.086a12.938 12.938 0 0 1-3.968-.495 1.192 1.192 0 0 1-.257-.103c-.644-.35-.69-.47-.733-1.886-.022-.717.074-1.089.407-1.193a3.15 3.15 0 0 1 1.173-.139c1.092.073 2.182.24 3.274.292 1.777.082 3.555.142 5.333.134.93 0 1.86-.172 2.789-.263 1.163-.116 2.325-.23 3.487-.34.47.359.982.01 1.437.329.238.166.333-.374.553-.187.16.142.372 0 .561 0 .35 0 .695-.01 1.041.024.066.006.134.185.159.22Zm-1.248 2.633c.099.107.159.226.216.22.088 0 .175-.147.267-.15.455-.018.91 0 1.366 0-.29-.225-.628.154-.858-.479-.258.734-.631.138-.991.41Zm-2.266-.588v.039h1.333v-.04h-1.333Z" />
    </g>
  </svg>
);

export default Hamburger;
