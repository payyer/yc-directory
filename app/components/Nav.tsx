import Image from "next/image";
import { auth, signIn, signOut } from "../auth";
import Link from "next/link";

export default async function Nav() {
  const session = await auth();
  return (
    <header>
      <nav className="flex justify-between items-center shadow-sm bg-white px-5 py-3 text-black">
        <Image src={"/logo.png"} alt="" width={144} height={30} />

        <div>
          {session && session?.user ? (
            <div className="flex gap-5">
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">Sign Out</button>
              </form>

              <Link href={`/user/${session?.user.id}`}>
                <span>{session?.user.name}</span>
              </Link>
            </div>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button type="submit">Signin with GitHub</button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
