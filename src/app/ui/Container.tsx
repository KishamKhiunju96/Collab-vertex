import { ReactNode } from "react";
import Wrapper from "./Wrapper";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <div className="w-full">{children}</div>;
    </Wrapper>
  );
}
