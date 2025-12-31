import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Briefcase,
  Building,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Coins,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Gift,
  Home,
  Info,
  Lock,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Settings,
  Shield,
  TrendingDown,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

export type IconProps = React.ComponentPropsWithoutRef<"svg">;
export type LogoProps = React.ComponentPropsWithoutRef<"span">;

export const Icons = {
  search: Search,
  fileText: FileText,
  clock: Clock,
  shield: Shield,
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  moreHorizontal: MoreHorizontal,
  home: Home,
  menu: Menu,
  user: User,
  settings: Settings,
  logout: LogOut,
  barChart: BarChart3,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  gift: Gift,
  circle: Circle,
  coins: Coins,
  trendingDown: TrendingDown,
  activity: Activity,
  plus: Plus,
  alertTriangle: AlertTriangle,
  creditCard: CreditCard,
  qrCode: QrCode,
  refresh: RefreshCw,
  info: Info,
  lock: Lock,
  wallet: Wallet,
  zap: Zap,
  close: X,
  users: Users,
  briefcase: Briefcase,
  building: Building,
  download: Download,
  externalLink: ExternalLink,
  alertCircle: AlertCircle,
  checkCircle: CheckCircle,

  google: (props: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),

  brazil: (props: IconProps) => (
    <svg viewBox="0 0 512 512" aria-hidden="true" {...props}>
      <path
        fill="#009B3A"
        d="M256 0c141.38 0 256 114.62 256 256S397.38 512 256 512 0 397.38 0 256 114.62 0 256 0z"
      />
      <path fill="#FEDF00" d="M256 92 462 256 256 420 50 256z" />
      <path
        fill="#002776"
        d="M256 174c45.8 0 83 37.2 83 83s-37.2 83-83 83-83-37.2-83-83 37.2-83 83-83z"
      />
      <path
        fill="#fff"
        d="M179 224c9-1 19-2 29-2 49 0 94 18 129 47-1 4-2 9-3 13-33-30-78-48-126-48-11 0-22 1-33 3 1-4 3-9 4-13z"
      />
    </svg>
  ),

  spinner: (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  pix: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M242.4 292.5c5.4-5.4 14.7-5.4 20.1 0l77 77c14.2 14.2 33.1 22 53.1 22h15.1l-97.1 97.1c-30.3 29.5-79.5 29.5-109.8 0l-97.5-97.4h9.3c20 0 38.9-7.8 53.1-22l76.7-76.7zm20.1-73.6c-6.4 5.5-14.6 5.6-20.1 0l-76.7-76.7c-14.2-15.1-33.1-22-53.1-22h-9.3l97.4-97.4c30.4-30.3 79.6-30.3 109.9 0l97.2 97.1h-15.2c-20 0-38.9 7.8-53.1 22l-77 77zm-149.9-76.2c13.8 0 26.5 5.6 37.1 15.4l76.7 76.7c7.2 6.3 16.6 10.8 26.1 10.8 9.4 0 18.8-4.5 26-10.8l77-77c9.8-9.7 23.3-15.3 37.1-15.3h37.7l58.3 58.3c30.3 30.3 30.3 79.5 0 109.8l-58.3 58.3h-37.7c-13.8 0-27.3-5.6-37.1-15.4l-77-77c-13.9-13.9-38.2-13.9-52.1.1l-76.7 76.6c-10.6 9.8-23.3 15.4-37.1 15.4H80.8l-58-58c-30.3-30.3-30.3-79.5 0-109.8l58-58.1h31.8z"
      />
    </svg>
  ),

  whatsapp: (props: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  ),

  logo: (props: LogoProps) => (
    <span
      className="font-sans tracking-tight select-none inline-flex items-center"
      {...props}
    >
      <span className="font-extrabold text-foreground leading-none">CNPJ</span>
      <span className="font-bold text-primary leading-none ml-1">Aqui</span>
      <span className="text-primary leading-none">.</span>
    </span>
  ),

  brasaoRepublica: (props: IconProps) => (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <circle cx="50" cy="50" r="48" fill="#009c3b" />
      <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="#ffdf00" />
      <circle cx="50" cy="50" r="28" fill="#002776" />
      <path
        d="M22 50 Q35 42, 50 44 Q65 46, 78 50 Q65 54, 50 52 Q35 50, 22 50"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <g fill="#ffffff">
        <circle cx="35" cy="38" r="1.5" />
        <circle cx="45" cy="35" r="1.5" />
        <circle cx="55" cy="35" r="1.5" />
        <circle cx="65" cy="38" r="1.5" />
        <circle cx="40" cy="58" r="1.5" />
        <circle cx="50" cy="62" r="1.5" />
        <circle cx="60" cy="58" r="1.5" />
        <circle cx="50" cy="68" r="2" />
      </g>
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#006400"
        strokeWidth="1"
      />
    </svg>
  ),
};
