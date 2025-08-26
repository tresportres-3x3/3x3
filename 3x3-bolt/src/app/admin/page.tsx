import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative">
       <nav className="absolute top-4 right-4 flex gap-2">
            <Button asChild variant="ghost">
            <Link href="/">Game</Link>
            </Button>
            <Button asChild variant="ghost">
            <Link href="/stats">Stats</Link>
            </Button>
        </nav>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                    Manage game data and settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="player-data">Seed Player Data</Label>
                    <Input id="player-data" type="file" />
                    <Button>Upload Players</Button>
                </div>
                 <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="flex flex-col space-y-2">
                         <Button variant="outline">Preview Tomorrow's Grid</Button>
                         <Button variant="outline">Backfill Derived Fields</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
