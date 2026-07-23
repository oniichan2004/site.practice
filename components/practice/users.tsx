"use client";

import { useEffect, useState } from "react";

type Person = {
  id: number;
  name: string;
  surname: string;
};

export default function Users() {
  const [users, setUsers] = useState<Person[]>([
    { id: 1, name: "Ion", surname: "Popescu" },
    { id: 2, name: "Maria", surname: "Ionescu" },
  ]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [prefix, setPrefix] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState(Number);

  useEffect(() => {
    console.log("mount");
    return () => console.log("unmount");
  }, []);

  function Create() {
    if (name.trim() === "" || surname.trim() === "") return;

    const NewPerson: Person = {
      id: users.length + 1,
      name,
      surname,
    };

    setUsers((previousUsers) => [...previousUsers, NewPerson]);

    setName("");
    setSurname("");
  }

  function Delete() {
    if (selectedPersonId === null) {
      return;
    }
    setUsers((previousUsers) =>
      previousUsers.filter((person) => person.id !== selectedPersonId),
    );
    setSelectedPersonId(0);
  }

  function Update() {
    if (selectedPersonId === null) {
      return;
    }

    setUsers((previousUsers) =>
      previousUsers.map((person) =>
        person.id === selectedPersonId
          ? {
              ...person,
              name,
              surname,
            }
          : person,
      ),
    );
    setName("");
    setSurname("");
  }

  return (
    <div className="flex flex-col  h-130 w-200 bg-gray-100 p-3">
      <div className="flex flex-row items-center justify-center gap-7 ">
        <div className="flex flex-col items-center justify-center gap-3 h-100 w-100">
          <div className=" flex  flex-row justify-center items-center gap-2">
            <p>Filter prefix:</p>
            <input
              type="text"
              className="border border-gray-300  p-1"
              placeholder="Enter prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap  w-full h-full border ">
            {users.map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedPersonId(person.id)}
                className={
                  selectedPersonId === person.id
                    ? "bg-blue-200 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {person.name} {person.surname}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-3">
          <div className="flex  flex-row justify-center items-center gap-4">
            <p>Name:</p>
            <input
              type="text"
              className="border border-gray-300  p-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex  flex-row justify-center items-center gap-4">
            <p>Surname:</p>
            <input
              type="text"
              className="border border-gray-300  p-1"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center gap-9 mt-3">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={Create}>
          Create
        </button>
        <button
          disabled={selectedPersonId === null}
          className="bg-green-500 text-white p-2 rounded"
          onClick={Update}
        >
          Modify
        </button>
        <button
          disabled={selectedPersonId === null}
          className="bg-red-500 text-white p-2 rounded"
          onClick={Delete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
