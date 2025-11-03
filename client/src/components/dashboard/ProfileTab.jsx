import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { Field, Input, Select, Textarea } from "../ui/FormUi";
import StatRow from "../ui/StatRow";

export default function ProfileTab() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    role: "Frequent Traveler",
    email: "jane.doe@example.com",
    phone: "+91 98765 43210",
    car: "Honda Civic",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Here you would typically make an API call to save the profile
      // await updateProfile(profile);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar Card */}
      <aside className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            {profile.name}
          </h3>
          <p className="text-gray-500">{profile.role}</p>
          <p className="mt-2 text-sm text-gray-700 flex items-center gap-1">
            <span className="text-yellow-500">★</span> 4.9{" "}
            <span className="text-gray-400">(23 rides)</span>
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <StatRow label="Total Rides" value="23" tone="blue" />
          <StatRow label="Money Saved" value="$340" tone="green" />
        </div>
      </aside>

      {/* Details */}
      <section className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
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
              disabled={!editing}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={onChange}
              disabled={!editing}
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
          <Field label="Preferred Vehicle">
            <Input
              name="car"
              value={profile.car}
              onChange={onChange}
              disabled={!editing}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
