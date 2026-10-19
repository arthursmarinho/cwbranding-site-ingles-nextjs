// Molduras de notebook e celular para mostrar prints de sites.
import Image from "next/image";
import { useId } from "react";

// Notebook feito com CSS: tela com borda escura e a base embaixo.
export function Laptop({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full">
      <div className="rounded-t-2xl border-[10px] border-b-[14px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-black">
          <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 90vw, 600px" className="object-cover object-top" />
        </div>
      </div>
      {/* Base do notebook, um pouco mais larga que a tela */}
      <div className="relative -mx-[6%] h-3 rounded-b-xl bg-gradient-to-b from-[#d4d4d4] to-[#8f8f8f]">
        <div className="mx-auto h-1.5 w-1/6 rounded-b-md bg-[#a3a3a3]" />
      </div>
    </div>
  );
}

// Celular: adaptado do componente "iPhone" da Magic UI (licença MIT, magicui.design).
// O desenho é um SVG com um "buraco" no lugar da tela, e o print fica por baixo.
const PHONE_WIDTH = 433;
const PHONE_HEIGHT = 882;
const SCREEN = { x: 21.25, y: 19.25, width: 389.5, height: 843.5, radius: 55.75 };

export function Phone({ src, alt }: { src: string; alt: string }) {
  // Id único para a máscara do SVG (pode haver vários celulares na página).
  // (tira caracteres especiais do id, que atrapalham o url(#...) do SVG)
  const maskId = `phone-screen-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}` }}>
      {/* Print na posição da tela */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${(SCREEN.x / PHONE_WIDTH) * 100}%`,
          top: `${(SCREEN.y / PHONE_HEIGHT) * 100}%`,
          width: `${(SCREEN.width / PHONE_WIDTH) * 100}%`,
          height: `${(SCREEN.height / PHONE_HEIGHT) * 100}%`,
          borderRadius: `${(SCREEN.radius / SCREEN.width) * 100}% / ${(SCREEN.radius / SCREEN.height) * 100}%`,
        }}
      >
        <Image src={src} alt={alt} fill sizes="200px" className="object-cover object-top" />
      </div>

      {/* Corpo do celular */}
      <svg viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`} className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width={PHONE_WIDTH} height={PHONE_HEIGHT} fill="white" />
            <rect
              x={SCREEN.x}
              y={SCREEN.y}
              width={SCREEN.width}
              height={SCREEN.height}
              rx={SCREEN.radius}
              fill="black"
            />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          {/* Borda externa e botões laterais */}
          <path
            d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
            fill="#4a4a4a"
          />
          <path d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z" fill="#4a4a4a" />
          <path d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z" fill="#4a4a4a" />
          <path d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z" fill="#4a4a4a" />
          <path d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z" fill="#4a4a4a" />
          {/* Moldura interna */}
          <path
            d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
            fill="#1a1a1a"
          />
        </g>
        {/* Câmera (dynamic island) */}
        <path
          d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
          fill="#0a0a0a"
        />
      </svg>
    </div>
  );
}
