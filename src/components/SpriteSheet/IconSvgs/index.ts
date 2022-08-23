import ArrowDown from "./ArrowDown.icon";
import ArrowLeft from "./ArrowLeft.icon";
import ArrowRight from "./ArrowRight.icon";
import ArrowUp from "./ArrowUp.icon";
import Back10 from "./Back10.icon";
import Bell from "./Bell.icon";
import Captions from "./Captions.icon";
import ChevronDown from "./ChevronDown.icon";
import ChevronLeft from "./ChevronLeft.icon";
import ChevronRight from "./ChevronRight.icon";
import ChevronUp from "./ChevronUp.icon";
import Cross from "./Cross.icon";
import Download from "./Download.icon";
import External from "./External.icon";
import Facebook from "./Facebook.icon";
import FullScreen from "./FullScreen.icon";
import Go from "./Go.icon";
import Grid from "./Grid.icon";
import Hamburger from "./Hamburger.icon";
import Home from "./Home.icon";
import Instagram from "./Instagram.icon";
import OutOfWindow from "./OutOfWindow.icon";
import Pause from "./Pause.icon";
import Play from "./Play.icon";
import Project from "./Project.icon";
import Rocket from "./Rocket.icon";
import Save from "./Save.icon";
import Search from "./Search.icon";
import Share from "./Share.icon";
import SignLanguage from "./SignLanguage.icon";
import SoundHigh from "./SoundHigh.icon";
import SoundLow from "./SoundLow.icon";
import SoundOff from "./SoundOff.icon";
import Star from "./Star.icon";
import Tick from "./Tick.icon";
import Twitter from "./Twitter.icon";

const iconSvgSymbols = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Back10,
  Bell,
  Captions,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cross,
  Download,
  External,
  Facebook,
  FullScreen,
  Go,
  Grid,
  Hamburger,
  Home,
  Instagram,
  OutOfWindow,
  Pause,
  Play,
  Project,
  Rocket,
  Save,
  Search,
  Share,
  SignLanguage,
  SoundHigh,
  SoundLow,
  SoundOff,
  Star,
  Tick,
  Twitter,
} as const;

export const ICON_NAMES = Object.keys(iconSvgSymbols) as Array<
  keyof typeof iconSvgSymbols
>;
export type IconSvgName = keyof typeof iconSvgSymbols;

export default iconSvgSymbols;
