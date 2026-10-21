import { SVGProps } from 'react';

const paths = {
  cube: 'M12 3 3 8v9l9 5 9-5V8l-9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  sun: 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z',
  close: 'M6 6l12 12M6 18 18 6',
  download: 'M12 3v12M7 10l5 5 5-5M4 16v5h16v-5',
  user: 'M20 21v-2a8 8 0 0 0-16 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  check: 'm5 12 4 4L19 6',
  chevron: 'm6 9 6 6 6-6',
  home: 'm3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7',
  storage: 'M3 4h18v16H3ZM3 12h18M9 8h6M9 16h6',
  lamp: 'm8 3-5 11h18L16 3ZM12 14v7M8 21h8',
  tool: 'm14 6 4 4M3 21l8-8M14 3a7 7 0 0 0-8 9l6 6a7 7 0 0 0 9-8l-5 5-7-7Z',
  gear: 'M9 3h6l1 4 4 1 1 6-4 2-1 5h-6l-1-4-5-1-1-6 4-2ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  printer: 'M5 3h14v18H5ZM5 7h14M9 7v5h6V7M12 12v3M8 18h8',
  chip: 'M6 6h12v12H6ZM9 9h6v6H9ZM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4',
  puzzle:
    'M4 4h6a3 3 0 1 1 4 0h6v6a3 3 0 1 0 0 4v6h-6a3 3 0 1 0-4 0H4v-6a3 3 0 1 1 0-4Z',
  dice: 'M5 3h14l2 2v14l-2 2H5l-2-2V5ZM7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01',
  sculpture:
    'M8 6a4 4 0 1 1 8 0v3a4 4 0 0 1-8 0ZM8 14l-3 4v3h14v-3l-3-4M9 13v3h6v-3',
  mask: 'M3 5c6-3 12-3 18 0v7c0 5-5 9-9 10-4-1-9-5-9-10ZM6 9l4 2M18 9l-4 2M9 16h6',
  gem: 'M7 3h10l5 6-10 13L2 9ZM2 9h20M7 3l5 19 5-19',
  building: 'M4 21V3h12v18M16 9h4v12M2 21h20M8 7h4M8 11h4M8 15h4M9 21v-3h3v3',
  car: 'm5 10 2-6h10l2 6M3 10h18v9H3ZM6 19v2M18 19v2M6 14h2M16 14h2',
  mountain: 'm2 21 8-17 5 10 3-6 5 13ZM7 10l3 2 3-2',
  science: 'M9 2h6M10 2v7L4 19v3h16v-3L14 9V2M7 15h10M10 18h.01M14 20h.01',
  paw: 'M8 13c-2 2-5 6-2 8 2 1 4-1 6-1s4 2 6 1c3-2 0-6-2-8-2-2-6-2-8 0ZM8 6a2 3 0 1 1-4 0 2 3 0 0 1 4 0ZM20 6a2 3 0 1 1-4 0 2 3 0 0 1 4 0ZM4 11a1.5 2 0 1 1-3 0 1.5 2 0 0 1 3 0ZM23 11a1.5 2 0 1 1-3 0 1.5 2 0 0 1 3 0Z',
  chair: 'M6 12V3h12v9M4 9v8h16V9M4 13h16M6 17v5M18 17v5',
  plant:
    'M12 16V8M12 12C4 12 3 6 3 3c6 0 9 3 9 9ZM12 16c0-8 5-11 10-11 0 6-3 11-10 11ZM7 18h10l-1 5H8Z',
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
