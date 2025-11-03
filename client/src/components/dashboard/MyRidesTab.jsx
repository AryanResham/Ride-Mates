import React, { useState } from "react";
import FilterButton from "../ui/FilterButton";
import RideCard from "../ui/RideCard";

export default function MyRides() {
  const [filter, setFilter] = useState("all");

  const rides = [
    // {
    //   id: 1,
    //   from: "Mumbai Central",
    //   to: "Pune",
    //   date: "2024-12-29",
    //   time: "2:00 PM",
    //   passengers: 2,
    //   maxSeats: 4,
    //   price: 450,
    //   status: "upcoming",
    //   vehicle: "Honda Civic (MH-01-AB-1234)",
    // },
    // {
    //   id: 2,
    //   from: "Andheri",
    //   to: "Bandra",
    //   date: "2024-12-28",
    //   time: "9:30 AM",
    //   passengers: 1,
    //   maxSeats: 3,
    //   price: 180,
    //   status: "completed",
    //   vehicle: "Honda Civic (MH-01-AB-1234)",
    // },
    // {
    //   id: 3,
    //   from: "Thane",
    //   to: "Navi Mumbai",
    //   date: "2024-12-27",
    //   time: "6:15 PM",
    //   passengers: 3,
    //   maxSeats: 4,
    //   price: 320,
    //   status: "completed",
    //   vehicle: "Honda Civic (MH-01-AB-1234)",
    // },
  ];

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
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
}
