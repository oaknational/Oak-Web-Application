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
import ContentGuidance from "./CotentGuidance.icon";
import Cross from "./Cross.icon";
import Download from "./Download.icon";
import External from "./External.icon";
import EquipmentRequired from "./EquipmentRequired.icon";
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
import SendToPupil from "./sendToPupil.icon";
import SoundHigh from "./SoundHigh.icon";
import SoundLow from "./SoundLow.icon";
import SoundOff from "./SoundOff.icon";
import Star from "./Star.icon";
import SupervisionLevel from "./SupervisionLevel.icon";
import Tick from "./Tick.icon";
import Twitter from "./Twitter.icon";
import LinkedIn from "./LinkedIn.icon";
import SubjectArtAndDesign from "./SubjectIconSvgs/ArtAndDesign.icon";

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
  ContentGuidance,
  Cross,
  Download,
  EquipmentRequired,
  External,
  Facebook,
  FullScreen,
  Go,
  Grid,
  Hamburger,
  Home,
  Instagram,
  LinkedIn,
  OutOfWindow,
  Pause,
  Play,
  Project,
  Rocket,
  Save,
  Search,
  SendToPupil,
  Share,
  SignLanguage,
  SoundHigh,
  SoundLow,
  SoundOff,
  Star,
  SubjectArtAndDesign,
  SupervisionLevel,
  Tick,
  Twitter,
} as const;

export const ICON_NAMES = Object.keys(iconSvgSymbols) as Array<
  keyof typeof iconSvgSymbols
>;
export type IconSvgName = keyof typeof iconSvgSymbols;

export default iconSvgSymbols;
