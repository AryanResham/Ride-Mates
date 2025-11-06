import { useState, useEffect } from "react";
import { Pencil, Save } from "lucide-react";
import { Field, Input, Select, Textarea } from "../ui/FormUi";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

export default function ProfileTab() {
  const { user, getIdToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        role: user.isDriver ? "Driver" : "Passenger",
        email: user.email || "",
        phone: user.phone || "",
        car: user.driverProfile?.vehicle?.model || "",
      });
    }
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getIdToken();
      // Assuming you have an endpoint to update the user profile
      await api.put("/api/user/me", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Details */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="text-gray-500">Manage your personal information</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 disabled:bg-gray-300 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name">
            <Input
              name="name"
              value={profile.name}
              onChange={onChange}
              disabled={!editing}
            />
          </Field>
          <Field label="Role">
            <Input
              name="role"
              value={profile.role}
              onChange={onChange}
              disabled={true}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={onChange}
              disabled={true}
            />
          </Field>
          <Field label="Phone">
            <Input
              name="phone"
              value={profile.phone}
              onChange={onChange}
              disabled={!editing}
            />
          </Field>
          {user.isDriver && (
            <Field label="Vehicle">
              <Input
                name="car"
                value={profile.car}
                onChange={onChange}
                disabled={!editing}
              />
            </Field>
          )}
        </div>
      </section>
    </div>
  );
}
