import { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-36">{children}</div>
  );
}
