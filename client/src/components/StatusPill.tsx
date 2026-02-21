import { getStatusClass } from "@/lib/mock-data";

interface StatusPillProps {
  status: string;
}

const StatusPill = ({ status }: StatusPillProps) => {
  return (
    <span className={`status-pill ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusPill;
