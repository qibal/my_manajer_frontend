// components/atoms/Logo.js
import Image from "next/image";

export default function Logo({ width = 64, height = 64, ...props }) {
  return (
    <Image
      src="/image/asset3.png" // <-- perbaiki di sini
      alt="Logo Aplikasi"
      width={width}
      height={height}
      priority
      {...props}
    />
  );
}