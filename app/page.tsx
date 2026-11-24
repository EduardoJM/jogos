import { getAllGames } from "@/lib/games";
import GameBrowser from "./GameBrowser";

export default function Home() {
  return <GameBrowser games={getAllGames()} />;
}
