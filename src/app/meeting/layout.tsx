interface Props {
  children: React.ReactNode;
}

const MeetingLayout = ({ children }: Props) => {
  return <div className="max-w-6xl mx-auto min-h-screen">{children}</div>;
};

export default MeetingLayout;
