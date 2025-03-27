import { useEffect, useState } from "react";
import React from "react";
import * as Toast from "@radix-ui/react-toast";
import "./App.css";

// https://www.radix-ui.com/primitives/docs/components/toast#installation

function App() {
  const [users, setUsers] = useState([]); // state all users
  const [search, setSearch] = useState(""); // state for search functionality
  const [sortField, setSortField] = useState("name"); // state for name / email sort
  const [sortOrder, setSortOrder] = useState("asc"); // state for asc / desc sort
  const [selectedUser, setSelectedUser] = useState(null); // state to open modal with more info
  const [isLoading, setIsLoading] = useState(false); // state for loading spinner

  // state for success toast modal
  const [open, setOpen] = useState(false);

  // new state for tracking if data fetching has failed
  const [fetchError, setFetchError] = useState(false);

  // Filter functionality - return users based on search input (no input = all users)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Sort functionality - return "filtered users" based on sorted options
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const comparison = a[sortField].localeCompare(b[sortField]); // name / email sort
    return sortOrder === "asc" ? comparison : -comparison; // asc / desc sort
  });

  // Helper function for data fetching
  const fetchUsers = () => {
    setIsLoading(true);
    setFetchError(false);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
        setOpen(true);
      })
      .catch(() => {
        // console.log(err)
        setIsLoading(false);
        setFetchError(true);
      });
  };

  // Data Fetching on load
  useEffect(() => {
    fetchUsers();
  }, []);

  // User Info Modal Logic
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <>
        {isLoading ? (
          // Spinner while loading
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
          </div>
        ) : fetchError ? ( // Fetch Error display
          <div className="flex flex-col justify-center items-center min-h-screen">
            <p className="mb-4 text-lg text-red-600">
              Data Fetching has failed.
            </p>
            <button
              onClick={fetchUsers}
              className="text-red-600 border border-red-600 px-4 py-2 rounded hover:cursor-pointer hover:bg-red-600 hover:border-0 hover:text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
          // UI for fetched users
          <div
            id="wrapper"
            className="flex items-center justify-center flex-col lg:px-50 md:px-30 mb-10 mx-3"
          >
            <h1 className="text-3xl font-bold text-indigo-600 italic my-5">
              User List
            </h1>

            <div className="flex sm:flex-row flex-col w-full justify-between mb-5 gap-4 md:gap-0">
              <div className="flex flex-col sm:flex-row justify-items-start w-full">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-2xl md:px-6 w-full mr-10 px-4 py-2 bg-transparent shadow-sm border-zinc-200 focus-visible:border-indigo-600"
                />
              </div>

              <div className="flex sm:justify-items-end gap-4 justify-between">
                <label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="border rounded-2xl md:px-4 px-6 py-3 bg-transparent shadow-sm border-zinc-200 focus-visible:border-indigo-600"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                </label>

                <label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border rounded-2xl md:px-4 px-6 py-3 bg-transparent shadow-sm border-zinc-200 focus-visible:border-indigo-600"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </label>
              </div>
            </div>

            <table className="table-auto w-full border border-zinc-200">
              <thead>
                <tr>
                  <th className="bg-transparent shadow-sm border-zinc-600 text-gray-600 px-4 py-2">
                    Name
                  </th>
                  <th className="bg-transparent shadow-sm border-zinc-600 text-gray-600 px-4 py-2">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="bg-transparent shadow-sm border-zinc-600 px-4 py-3">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="hover:text-indigo-600 hover:cursor-pointer"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="bg-transparent shadow-sm border-zinc-600 px-4 py-3">
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* UI Logic for User Info Modal */}
        {selectedUser && (
          <div className="modal fixed inset-0 flex items-center justify-center backdrop-blur-lg">
            <div className="modal-content bg-white p-6 rounded-xl shadow-lg w-11/12 md:w-1/2 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-4 text-gray-500 hover:text-indigo-600"
              >
                Close
              </button>
              <h2 className="text-2xl text-indigo-600 mb-4">
                {selectedUser.name}
              </h2>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${selectedUser.address.street}, ${selectedUser.address.suite}, ${selectedUser.address.city}, ${selectedUser.address.zipcode}`}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Company:</strong> {selectedUser.company.name}
              </p>
            </div>
          </div>
        )}
      </>

      {/* Success Toast - Only visible on larger screens */}
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="p-6 shadow-lg fixed bottom-5 opacity-100 rounded-2xl hidden lg:block right-5"
      >
        <Toast.Title className="text-sm font-semibold">
          ✅ Users loaded successfully
        </Toast.Title>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}

export default App;
