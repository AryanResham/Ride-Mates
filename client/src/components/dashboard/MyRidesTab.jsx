import React, { useState, useEffect } from "react";
import FilterButton from "../ui/FilterButton";
import RideCard from "../ui/RideCard";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function MyRides() {
  const [filter, setFilter] = useState("all");
  const [rides, setRides] = useState([]);
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      const token = await getIdToken();
      const response = await api.get("/api/driver/rides", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(response.data);
    };
    fetchRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRides =
    filter === "all" ? rides : rides.filter((ride) => ride.status === filter);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <FilterButton
          label="All Rides"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterButton
          label="Upcoming"
          active={filter === "upcoming"}
          onClick={() => setFilter("upcoming")}
        />
        <FilterButton
          label="Completed"
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
        />
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {filteredRides.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}
      </div>
    </div>
  );
}
