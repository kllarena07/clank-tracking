interface LeaderboardEntry {
  rank: number;
  name: string;
  queries: number;
}

interface ApiResponse {
  data: LeaderboardEntry[];
  lastUpdated: string;
}

export default async function Home() {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL ? process.env.VERCEL_URL : 'localhost:3000';
  const response = await fetch(`${protocol}://${host}/api/leaderboard`, {
    cache: "no-store",
  });

  const { data: leaderboard, lastUpdated }: ApiResponse = await response.json();

  const timeAgo = new Date(lastUpdated);
  const now = new Date();
  const minutesAgo = Math.floor(
    (now.getTime() - timeAgo.getTime()) / (1000 * 60),
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-black dark:text-zinc-50">
            AI Query Leaderboard
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
            Hall of Shame: Most AI Queries This Month
          </p>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="font-semibold text-black dark:text-zinc-50">
                Rank
              </div>
              <div className="font-semibold text-black dark:text-zinc-50">
                Name
              </div>
              <div className="font-semibold text-right text-black dark:text-zinc-50">
                Queries
              </div>
            </div>

            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="grid grid-cols-3 gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center">
                  {user.rank <= 3 ? (
                    <span className="text-2xl">
                      {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400">
                      #{user.rank}
                    </span>
                  )}
                </div>
                <div className="text-black dark:text-zinc-50">{user.name}</div>
                <div className="text-right font-mono text-black dark:text-zinc-50">
                  {user.queries.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Data updated hourly • Last refresh: {minutesAgo}{" "}
            {minutesAgo === 1 ? "minute" : "minutes"} ago
          </div>
        </div>
      </main>
    </div>
  );
}
