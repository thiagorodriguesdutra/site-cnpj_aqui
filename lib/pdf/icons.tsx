import { Circle, G, Path, Svg } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

interface BrasaoRepublicaProps {
  style?: Style;
}

export function BrasaoRepublica({ style }: BrasaoRepublicaProps) {
  return (
    <Svg viewBox="0 0 100 100" style={style}>
      <Circle cx="50" cy="50" r="48" fill="#009c3b" />
      <Path d="M50 8 L92 50 L50 92 L8 50 Z" fill="#ffdf00" />
      <Circle cx="50" cy="50" r="28" fill="#002776" />
      <Path
        d="M22 50 Q35 42, 50 44 Q65 46, 78 50 Q65 54, 50 52 Q35 50, 22 50"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <G fill="#ffffff">
        <Circle cx="35" cy="38" r="1.5" />
        <Circle cx="45" cy="35" r="1.5" />
        <Circle cx="55" cy="35" r="1.5" />
        <Circle cx="65" cy="38" r="1.5" />
        <Circle cx="40" cy="58" r="1.5" />
        <Circle cx="50" cy="62" r="1.5" />
        <Circle cx="60" cy="58" r="1.5" />
        <Circle cx="50" cy="68" r="2" />
      </G>
      <Circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#006400"
        strokeWidth="1"
      />
    </Svg>
  );
}
