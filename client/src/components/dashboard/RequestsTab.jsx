import React, { useState } from "react";
import FilterButton from "../ui/FilterButton";
import RequestCard from "../ui/RequestCard";

export default function Requests() {
  const [filter, setFilter] = useState("pending");

  const requests = [
    // {
    //   id: 1,
    //   passengerName: "Sarah Johnson",
    //   passengerRating: 4.8,
    //   rideFrom: "Mumbai Central",
    //   rideTo: "Pune",
    //   rideDate: "Dec 29, 2:00 PM",
    //   seatsRequested: 2,
    //   message: "Hi! Can we make a quick stop at a petrol station?",
    //   status: "pending",
    // },
    // {
    //   id: 2,
    //   passengerName: "Raj Patel",
    //   passengerRating: 4.9,
    //   rideFrom: "Mumbai Central",
    //   rideTo: "Pune",
    //   rideDate: "Dec 29, 2:00 PM",
    //   seatsRequested: 1,
    //   message: "Looking forward to the trip!",
    //   status: "pending",
    // },
    // {
    //   id: 3,
    //   passengerName: "Priya Sharma",
    //   passengerRating: 4.7,
    //   rideFrom: "Andheri",
    //   rideTo: "Bandra",
    //   rideDate: "Dec 28, 9:30 AM",
    //   seatsRequested: 1,
    //   message: "",
    //   status: "accepted",
    // },
  ];

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <FilterButton
          label="Pending"
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
          count={requests.filter((r) => r.status === "pending").length}
        />
        <FilterButton
          label="Accepted"
          active={filter === "accepted"}
          onClick={() => setFilter("accepted")}
        />
        <FilterButton
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
