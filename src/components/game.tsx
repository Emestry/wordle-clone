"use client";

import Keyboard from "@/components/keyboard";
import { MAX_GUESSES, WORD_LENGTH } from "@/lib/config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import dictionary from "@/data/dictionary.json";
import words from "@/data/words.json";
import { toast } from "sonner";

export default function Game() {
  const [currentWord, setCurrentWord] = useState(() =>
    words[Math.floor(Math.random() * words.length)].toUpperCase()
  );
  const WORD = currentWord;

  const DICTIONARY = useMemo(
    () => new Set(dictionary.map((word) => word.toUpperCase())),
    []
  );

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyStates, setKeyStates] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});

  const resetGame = useCallback(() => {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
    setKeyStates({});
    setCurrentWord(
      words[Math.floor(Math.random() * words.length)].toUpperCase()
    );
  }, []);

  const evaluteGuess = useCallback(
    (guess: string) => {
      const newKeyStates = { ...keyStates };
      guess.split("").forEach((letter, index) => {
        if (WORD[index] === letter) newKeyStates[letter] = "correct";

        if (WORD.includes(letter) && newKeyStates[letter] !== "correct")
          newKeyStates[letter] = "present";

        if (!WORD.includes(letter)) newKeyStates[letter] = "absent";
      });
      setKeyStates(newKeyStates);
    },
    [WORD, keyStates]
  );

  const handleGuess = useCallback(
    (guess: string) => {
      if (gameOver || guess.length !== WORD_LENGTH) return;

      const normalized = guess.toUpperCase();

      if (!DICTIONARY.has(normalized))
        return toast.error("Word not in list", {
          position: "top-center",
        });

      setGuesses((prev) => [...prev, normalized]);
      setCurrentGuess("");

      evaluteGuess(normalized);

      if (normalized === WORD) {
        setMessage("You guessed it!");
        setGameOver(true);
      }

      if (guesses.length + 1 === MAX_GUESSES) {
        setMessage(`The word was ${WORD}`);
        setGameOver(true);
      }
    },
    [WORD, gameOver, evaluteGuess, guesses.length, DICTIONARY]
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "ENTER") handleGuess(currentGuess);

      if (key === "BACKSPACE") setCurrentGuess((prev) => prev.slice(0, -1));

      if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key))
        setCurrentGuess((prev) => prev + key);
    },
    [currentGuess, gameOver, handleGuess]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const getColor = useCallback(
    (letter: string, index: number) => {
      if (WORD[index] === letter) return "bg-green-500";
      if (WORD.includes(letter)) return "bg-yellow-500";
      return "bg-secondary/50";
    },
    [WORD]
  );

  const rows = useMemo(() => {
    return Array.from({ length: MAX_GUESSES }, (_, i) => {
      const guess = guesses[i];

      if (guess) {
        return (
          <div key={i} className="flex space-x-2">
            {guess.split("").map((letter, j) => (
              <div
                key={j}
                className={`size-12 flex items-center justify-center font-bold rounded ${getColor(
                  letter,
                  j
                )}`}
              >
                {letter}
              </div>
            ))}
          </div>
        );
      }

      if (i === guesses.length && !gameOver) {
        return (
          <div key={i} className="flex space-x-2">
            {Array.from({ length: WORD_LENGTH }, (_, j) => (
              <div
                key={j}
                className="size-12 flex items-center justify-center font-bold rounded bg-secondary"
              >
                {currentGuess[j] || ""}
              </div>
            ))}
          </div>
        );
      }

      return (
        <div key={i} className="flex space-x-2">
          {Array.from({ length: WORD_LENGTH }, (_, j) => (
            <div
              key={j}
              className="size-12 flex items-center justify-center font-bold rounded bg-secondary"
            />
          ))}
        </div>
      );
    });
  }, [guesses, gameOver, currentGuess, getColor]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="space-y-2">{rows}</div>

      <div className=" flex flex-col gap-4 items-center justify-center">
        {message && <p className="text-xl">{message}</p>}
        {gameOver && <Button onClick={resetGame}>Play Again</Button>}
      </div>

      <div className="flex justify-center">
        {!gameOver && (
          <Keyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
        )}
      </div>
    </div>
  );
}
