import { auth, signIn, signOut } from "auth";

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
        await signIn("github", { redirectTo: "/downloads/restricted" });
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
        <h3>Sign in to access restricted downloads</h3>
        {user ? <SignOut username={user} /> : <SignIn />}
      </div>
    </section>
  );
}
