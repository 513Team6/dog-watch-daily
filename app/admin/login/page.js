import { login } from "./actions";

export default function LoginPage({ searchParams }) {
  return (
    <div>
      <h1>Admin login</h1>
      <p className="subtitle">Enter the site password to manage dogs and post photos.</p>
      <form action={login} className="card">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required autoFocus />
        {searchParams?.error && (
          <p style={{ color: "#b3261e", marginTop: 8 }}>Wrong password, try again.</p>
        )}
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
