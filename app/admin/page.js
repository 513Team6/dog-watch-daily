import { listDogs } from "@/lib/blob";
import { createDogAction, deleteDogAction, logout } from "./actions";
import DeleteDogButton from "./DeleteDogButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const dogs = await listDogs();

  return (
    <div>
      <h1>Dogs you're watching</h1>
      <p className="subtitle">
        Add a dog, then send the owner their unique link at the start of the
        week.
      </p>

      {dogs.length === 0 && <p className="empty">No dogs yet, add your first one below.</p>}

      {dogs.map((dog) => (
        <div key={dog.slug} className="dog-link-row">
          <a className="dog-link" href={`/admin/dogs/${dog.slug}`}>
            {dog.name}
            <small>Owner: {dog.owner}</small>
          </a>
          <DeleteDogButton action={deleteDogAction.bind(null, dog.slug)} name={dog.name} />
        </div>
      ))}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Add a new dog</h2>
        <form action={createDogAction}>
          <label htmlFor="name">Dog's name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="owner">Owner's name</label>
          <input type="text" id="owner" name="owner" required />

          <button type="submit">Create dog page</button>
        </form>
      </div>

      <form action={logout}>
        <button type="submit" style={{ background: "transparent", color: "#9a8f83" }}>
          Log out
        </button>
      </form>
    </div>
  );
}
