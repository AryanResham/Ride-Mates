import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FilterButton from "../ui/FilterButton";
import RequestCard from "../ui/RequestCard";
import api from "../../utils/api";

export default function Requests() {
  const { getIdToken } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getIdToken();
      const res = await api.get("/api/driver/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setRequests(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, driverResponse) => {
    try {
      const token = await getIdToken();
      const res = await api.put(
        `/api/driver/requests/${requestId}/accept`,
        { driverResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeclineRequest = async (requestId, driverResponse) => {
    try {
      const token = await getIdToken();
      const res = await api.put(
        `/api/driver/requests/${requestId}/decline`,
        { driverResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;

  return (
    <div className="max-w-6xl w-full mx-auto">
      <div className="mb-4 flex gap-2">
        <FilterButton
          label={`Pending (${pendingCount})`}
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
          count={pendingCount}
        />
        <FilterButton
          label={`Accepted (${acceptedCount})`}
          active={filter === "accepted"}
          onClick={() => setFilter("accepted")}
        />
        <FilterButton
          label="Declined"
          active={filter === "declined"}
          onClick={() => setFilter("declined")}
        />
        <FilterButton
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto" />
          <p className="mt-2 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-500">
                {filter === "all"
                  ? "No ride requests found."
                  : `No ${filter} requests found.`}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
