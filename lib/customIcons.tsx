export const GoogleIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M43.6 20.5H42V20.5H24v7.5h11.3C34 33.6 29 37 23.9 37 15.9 37 9.6 30.7 9.6 22.7S15.9 8.4 23.9 8.4c3.3 0 6.2 1 8.5 2.9l5.8-5.8C35.6 2.1 30.1 0 23.9 0 10.8 0 0 10.8 0 24s10.8 24 23.9 24c13.1 0 23.9-10.8 23.9-24 0-1.6-.1-3.1-.2-4.5z"
      fill="#EA4335"
    />
  </svg>
);

export const OutlookIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="256" height="256" rx="28" fill="#0078D4" />
    <path d="M64 48h128v160H64z" fill="#FFFFFF" />
    <path d="M96 48v160l128-48V0H96z" fill="#004E8C" />
  </svg>
);

export const OtherIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" fill="#FFB300" />
    <path d="M7 8h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" fill="white" />
  </svg>
);
