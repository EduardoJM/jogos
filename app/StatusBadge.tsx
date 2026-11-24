import type { GameStatus } from "@/lib/games";

export default function StatusBadge({ status }: { status: GameStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
