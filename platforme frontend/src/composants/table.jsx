import React from "react";
import "../styles/table.css";

export default function Table() {

  const data = [
    { name: "Vincent Williamson", age: 31, job: "iOS Developer", location: "Washington" },
    { name: "Tyler Reyes", age: 22, job: "UI/UX Designer", location: "New York" },
    { name: "Justin Black", age: 26, job: "Front-End Developer", location: "Los Angeles" },
    { name: "Sean Guzman", age: 25, job: "Web Designer", location: "San Francisco" },
    { name: "Keith Carter", age: 20, job: "Graphic Designer", location: "New York, NY" },
    { name: "Austin Medina", age: 32, job: "Photographer", location: "New York" },
    { name: "Adam Henderson", age: 35, job: "UI/UX Designer", location: "Washington" },
    { name: "Louis Smith", age: 27, job: "Photographer", location: "San Francisco" },
  ];

  return (
    <div className="table-container">

      {/* HEADER FIXED */}
      <div className="table-header">
        <div>Full Name</div>
        <div>Age</div>
        <div>Job Title</div>
        <div>Location</div>
      </div>

      {/* BODY SCROLL */}
      <div className="table-body">
        {data.map((item, index) => (
          <div className="table-row" key={index}>
            <div>{item.name}</div>
            <div>{item.age}</div>
            <div>{item.job}</div>
            <div>{item.location}</div>
          </div>
        ))}
      </div>

    </div>
  );
}