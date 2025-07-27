import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="glass-card rounded-full py-5 border-primary/20 text-foreground hover:text-foreground hover:bg-background/80"
    >
      {theme === "light" ? (
        <Moon className="h-10 w-10" />
      ) : (
        <Sun className="h-10 w-10" />
      )}
    </Button>
  );
}