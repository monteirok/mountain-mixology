import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Mountain Mixology"
      width={180}
      height={60}
      priority
      className="h-12 w-auto"
    />
  );
}
