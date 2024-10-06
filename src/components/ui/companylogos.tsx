import Image from 'next/image'
import solanaLogo from "../../assets/images/solana.png";
import quantumLogo from "../../assets/images/quantum.png";
import radarLogo from "../../assets/images/radar.png";
import ipfsLogo from "../../assets/images/ipfs.jpg";
import pulseLogo from "../../assets/images/pulse.png";
import apexLogo from "../../assets/images/apex.png";

export default function LogoCarousel() {

  const logos = [
  { src: solanaLogo, alt: "Acme Logo" },
  { src: quantumLogo, alt: "Quantum Logo" },
  { src: radarLogo, alt: "Radar Logo" },
  { src: ipfsLogo, alt: "Ipfs Logo" },
  { src: pulseLogo, alt: "Pulse Logo" },
  { src: apexLogo, alt: "Apex Logo" },
  ]

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {logos.map((logo, index) => (
          <li key={index}>
            <Image src={logo.src} alt={logo.alt} />
          </li>
        ))}
      </ul>
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
        {logos.map((logo, index) => (
          <li key={index}>
            <Image src={logo.src} alt={logo.alt} />
          </li>
        ))}
      </ul>
    </div>
  )
}