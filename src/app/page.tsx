import Game from "@/components/game";
import * as words from "@/data/words.json";

export const revalidate = 0;

export default function Home() {
  const word = words[Math.floor(Math.random() * words.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6 space-y-6 text-center selection:bg-secondary">
      <div>
        <h1 className="text-lg">Wordle Clone</h1>
        <p className="text-muted-foreground">Built by Karl Võhma</p>
      </div>

      <Game word={word} />
    </div>
  );
}
