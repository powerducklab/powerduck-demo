interface LogoProps {
  size?: number;
}

/**
 * PowerDuck brand logo.
 * Two-tone circular arc mark in amber and teal.
 */
export function Logo({ size = 24 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M4 12C4 7.58 7.58 4 12 4C14.5 4 16.7 5.2 18.1 7"
        stroke="#E8A33D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 12C20 16.42 16.42 20 12 20C9.5 20 7.3 18.8 5.9 17"
        stroke="#7FD1AE"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
