"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CornerDownLeft, Delete } from "lucide-react";

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

interface KeyboardProps {
  keyStates: Record<string, "correct" | "present" | "absent">;
  onKeyPress: (key: string) => void;
}

export default function Keyboard({ keyStates, onKeyPress }: KeyboardProps) {
  return (
    <div className="space-y-1">
      {rows.map((row, i) => (
        <div key={i} className="space-x-1 flex justify-center">
          {row.map((key) => (
            <Button
              variant={keyStates[key] ? keyStates[key] : "secondary"}
              onClick={() => onKeyPress(key)}
              className={cn(
                key === "BACKSPACE" || key === "ENTER"
                  ? "w-12 sm:w-16"
                  : "sm:w-10 w-6"
              )}
              key={key}
            >
              {key === "ENTER" ? (
                <CornerDownLeft />
              ) : key === "BACKSPACE" ? (
                <Delete />
              ) : (
                key
              )}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
