import { useState } from "react";
import Navbar from "./Navbar";
import { Field, Input, Select, Textarea } from "../ui/FormUi";

export default function CreateRidePanel() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
    price: "",
    vehicle: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to API
    console.log("Create ride:", form);
  };

  const handleDraft = () => {
    // TODO: save draft
    console.log("Save as draft:", form);
  };

  return (
    <>
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-5 sm:p-6 md:p-8 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Ride
            </h2>
            <p className="text-gray-500 mt-1">
              Share your journey and connect with passengers
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* From / To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="From">
                  <Input
                    name="from"
                    placeholder="Starting location"
                    value={form.from}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="To">
                  <Input
                    name="to"
                    placeholder="Destination"
                    value={form.to}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              {/* Date / Time / Seats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Date">
                  <Input
                    type="date"
                    name="date"
                    placeholder="dd-mm-yyyy"
                    value={form.date}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Time">
                  <Input
                    type="time"
                    name="time"
                    placeholder="--:-- --"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Available Seats">
                  <Select
                    name="seats"
                    value={form.seats}
                    onChange={handleChange}
                    options={[1, 2, 3, 4, 5, 6].map((n) => ({
                      label: `${n} seat${n > 1 ? "s" : ""}`,
                      value: n,
                    }))}
                  />
                </Field>
              </div>

              {/* Price / Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Price per seat">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                      $
                    </span>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      className="pl-7"
                    />
                  </div>
                </Field>
                <Field label="Vehicle">
                  <Input
                    name="vehicle"
                    placeholder="Honda Civic (ABC-123)"
                    value={form.vehicle}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              {/* Notes */}
              <Field label="Additional Notes">
                <Textarea
                  name="notes"
                  rows={3}
                  placeholder="Any additional information for passengers..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </Field>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
                >
                  + Create Ride
                </button>
                <button
                  type="button"
                  onClick={handleDraft}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------- Small reusable UI bits ---------- */
