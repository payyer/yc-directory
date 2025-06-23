import { STARTUPS_BY_AUTHOR_QUERY } from "@/lib/queries";
import { client } from "@/sanity/lib/client";
import StartupCard, { StartupCardType } from "./StartupCard";
import { Skeleton } from "./ui/skeleton";

async function UserStartups({ id }: { id: string }) {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupCardType) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <>Don't have any startup</>
      )}
    </>
  );
}

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => {
      return (
        <li key={index}>
          <Skeleton className="startup-card_skeleton" />
        </li>
      );
    })}
  </>
);
export default UserStartups;
