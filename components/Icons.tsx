// File: components/Icons.tsx
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export type IconProps = {
  color: string;
  size: number;
};

export function CloseIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="2" y="2" width="44" height="44" stroke={color} strokeWidth="4" />
      <Path d="M21.5998 26.3806H16.7998V31.1806H21.5998V26.3806Z" fill={color} />
      <Path d="M16.8 31.2H12V36H16.8V31.2Z" fill={color} />
      <Path d="M21.5998 16.7998H16.7998V21.5998H21.5998V16.7998Z" fill={color} />
      <Path d="M16.8 12H12V16.8L16.7998 16.7998L16.8 12Z" fill={color} />
      <Path d="M26.3999 21.5806H21.5999L21.5998 26.3806L26.3999 26.3806V21.5806Z" fill={color} />
      <Path d="M31.2097 26.3901H26.4097V31.1901H31.2097V26.3901Z" fill={color} />
      <Path d="M36 31.2H31.2V36H36V31.2Z" fill={color} />
      <Path d="M31.1999 16.7805H26.3999L26.3999 21.5806L31.1999 21.5805V16.7805Z" fill={color} />
      <Path d="M36 12H31.2V16.8H36V12Z" fill={color} />
    </Svg>
  );
}

export function NfcIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="2" y="2" width="44" height="44" stroke={color} strokeWidth="4" />
      <Path d="M22 34H26V38H22V34Z" fill={color} />
      <Path d="M22 26H26V30H22V26Z" fill={color} />
      <Path d="M22 18H26V22H22V18Z" fill={color} />
      <Path d="M22 10H26V14H22V10Z" fill={color} />
      <Path d="M18 28H22V32H18V28Z" fill={color} />
      <Path d="M18 20H22V24H18V20Z" fill={color} />
      <Path d="M18 12H22V16H18V12Z" fill={color} />
      <Path d="M14 22H18V26H14V22Z" fill={color} />
      <Path d="M14 14H18V18H14V14Z" fill={color} />
      <Path d="M10 16H14V20H10V16Z" fill={color} />
      <Path d="M26 28H30V32H26V28Z" fill={color} />
      <Path d="M26 20H30V24H26V20Z" fill={color} />
      <Path d="M26 12H30V16H26V12Z" fill={color} />
      <Path d="M30 22H34V26H30V22Z" fill={color} />
      <Path d="M30 14H34V18H30V14Z" fill={color} />
      <Path d="M34 17H38V21H34V17Z" fill={color} />
    </Svg>
  );
}

export function QrIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="2" y="2" width="44" height="44" stroke={color} strokeWidth="4" />
      <Path d="M12 12H20.4V20.4H12V12ZM27.6 12H36V20.4H27.6V12ZM12 27.6H20.4V36H12V27.6ZM30 14.4H33.6V18H30V14.4ZM14.4 30H18V33.6H14.4V30ZM22.8 12H25.2V20.4H22.8V12ZM12 22.8H20.4V25.2H12V22.8ZM27.6 22.8H30V25.2H27.6V22.8ZM32.4 22.8H36V25.2H32.4V22.8ZM22.8 27.6H25.2V30H22.8V27.6ZM22.8 32.4H25.2V36H22.8V32.4ZM27.6 27.6H30V30H27.6V27.6ZM32.4 27.6H36V31.2H32.4V27.6ZM27.6 32.4H31.2V36H27.6V32.4ZM34.8 32.4H36V33.6H34.8V32.4Z" fill={color} />
    </Svg>
  );
}

export function UserIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x="2" y="2" width="44" height="44" stroke={color} strokeWidth="4" />
      <Path d="M30.1597 14.4054V12.9371H28.7918V11.4683H27.4239V10H24.6881V10.0052H20.5758V11.4738H19.2079V12.9424H17.8403V14.411H16.4721V20.2852H17.8403V21.7538H19.2079V23.2224H20.5758V24.694H24.6881V24.6885H27.4239V23.2168H28.7918V21.7486H30.1597V20.2797H31.5279V14.4054H30.1597Z" fill={color} />
      <Path d="M35.6292 33.5853V30.6485H34.2613V29.1799H32.8935V27.7114H31.5258V26.2366H27.4219V27.7114H24.6861V27.7169H20.5781V26.2422H16.4744V27.7169H15.1065V29.1855H13.7387V30.6538H12.3708V33.5909H11V38H24.6901V37.9944H37V33.5853H35.6292Z" fill={color} />
    </Svg>
  );
}

export function DownloadIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 242 242" fill="none">
      <Path d="M214.386 214.4V53.6H187.6V26.8H160.8V53.6H187.586V214.4H53.5864V53.6H26.7864V214.4H0V241.2H241.2V214.4H214.386Z" fill={color} />
      <Path d="M160.8 0H80.4V26.8H160.8V0Z" fill={color} />
      <Path d="M80.4 26.8H53.6V53.6H80.4V26.8Z" fill={color} />
      <Path d="M134 187.6V160.8H160.8V134H134L134 53.6001H107.2L107.2 134H80.4L80.4 160.8H107.2V187.6H134Z" fill={color} />
    </Svg>
  );
}

export function MoreVerticalIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Outer 48x48 Border Box */}
      <Rect x="2" y="2" width="44" height="44" stroke={color} strokeWidth="0"/>
      
      {/* Vertical Dots (Meatball) */}
      <Rect x="21" y="10" width="6" height="6" fill={color} />
      <Rect x="21" y="21" width="6" height="6" fill={color} />
      <Rect x="21" y="32" width="6" height="6" fill={color} />
    </Svg>
  );
}