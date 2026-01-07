import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

const App = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUsers = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/user");
      const data = await res.json();

      setUsers(data.data);
      console.log(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const userFormData = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let res;

      if (isEdit && selectedUser) {
        res = await fetch(`http://localhost:5001/api/user/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        });
      } else {
        res = await fetch("http://localhost:5001/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        });
      }

      const data = await res.json();

      if (isEdit && selectedUser) {
        setUsers((prev) =>
          prev.map((user) => (user.id === data.data.id ? data.data : user))
        );
      } else {
        setUsers((prev) => [...prev, data.data]);
      }

      setSelectedUser(null);
      setIsEdit(false);
      setFormData({
        name: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEdit(true);
    setFormData({ name: user.name, email: user.email });
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await fetch(`http://localhost:5001/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            User Management
          </h1>
          <p className="text-gray-600 mt-2">
            A static page displaying users and a form for adding new users
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: User form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New User
              </h2>

              <form onSubmit={userFormData} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
                    {isEdit ? "Edit User" : "Add User"}
                  </button>
                  {isEdit && (
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setSelectedUser(null);
                        setFormData({
                          name: "",
                          email: "",
                        });
                      }}
                      type="button"
                      className="w-full bg-gray-400 hover:bg-gray-500 mt-2 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
                      Cancel
                    </button>
                  )}
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Note: This is a static page. Form submission is not
                    functional.
                  </p>
                </div>
              </form>

              {/* Additional info section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">
                  About This Page
                </h3>
                <p className="text-sm text-gray-600">
                  This is a completely static React page built with Tailwind
                  CSS. The form and table are for display purposes only and have
                  no functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: User table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  Current Users
                </h2>
                <p className="text-gray-600 mt-1">
                  A table displaying user information
                </p>
              </div>

              {/* Table container */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.created_at.slice(0, 10)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{users.length}</span>{" "}
                    users
                  </div>
                  <div className="text-sm text-gray-500">
                    This is static data only
                  </div>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {users.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800">
                  Recent Join
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {users[users.length - 1]?.created_at.slice(0, 10)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-medium text-gray-800">
                  Sample Data
                </h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  CRUD APP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Static User Management Page • Built with React and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
