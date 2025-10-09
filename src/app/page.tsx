import Game from "@/components/game";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-6 space-y-6 text-center">
      <div>
        <h1 className="text-lg">Wordle Clone</h1>
        <p className="text-muted-foreground">Built by Karl Võhma</p>
      </div>

      <Game word="apple" />
    </div>
  );
}
