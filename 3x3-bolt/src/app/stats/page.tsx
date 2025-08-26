import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative">
        <nav className="absolute top-4 right-4 flex gap-2">
            <Button asChild variant="ghost">
            <Link href="/">Game</Link>
            </Button>
            <Button asChild variant="ghost">
            <Link href="/admin">Admin</Link>
            </Button>
        </nav>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                    Review your performance and streaks.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <p>Current Streak:</p>
                    <p className="font-bold">0</p>
                </div>
                <div className="flex justify-between">
                    <p>Total Games Played:</p>
                    <p className="font-bold">0</p>
                </div>
                <div className="flex justify-between">
                    <p>Average Rarity:</p>
                    <p className="font-bold">0%</p>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
