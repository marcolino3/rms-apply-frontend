import { Header } from "@/components/header";

interface Props {
  children: React.ReactNode;
}

const MeetingLayout = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <div className="max-w-4xl  min-h-screen m-5 lg:mx-auto">{children}</div>
    </div>
  );
};

export default MeetingLayout;
