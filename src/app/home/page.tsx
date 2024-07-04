import Link from "next/link";

import { auth, signIn, signOut } from "../../../auth";

function SignOut(props: { username: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button>Sign out as {props.username}</button>
    </form>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button>Sign In With Github</button>
    </form>
  );
}

export default async function Page() {
  const session = await auth();
  const user = session?.user?.name;

  return (
    <section>
      <h1>Home</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {user ? <SignOut username={user} /> : <SignIn />}
        <Link href="/downloads">Download free lesson resources</Link>
        <Link href="/downloads/restricted">
          Download restricted lesson resources
        </Link>
      </div>
    </section>
  );
}
