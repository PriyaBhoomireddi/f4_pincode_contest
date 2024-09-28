import React, { useState } from "react";
import "../App.css";
import { FaSearch } from "react-icons/fa";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchPincodeData = async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await response.json();

      if (result[0].Status === "Error") {
        setError(result[0].Message);
        setData([]);
      } else {
        setData(result[0].PostOffice);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPincodeData();
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="pincode-lookup">
      {data.length === 0 ? (
        <>
          <h1>Enter Pincode</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode"
            />
            <button type="submit">Lookup</button>
          </form>
        </>
      ) : (
        <>
          <h1>Pincode: {pincode}</h1>
          {error && <div className="error">{error}</div>}
          {loading && <div className="loader">Loading...</div>}
          <div className="results">
            <div className="message">Message : Number of pincode(s) found: {filteredData.length}</div>
            <div className="filter-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter"
                className="filter-input"
              />
            </div>
            <div className="result-list">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <div className="result-item" key={index}>
                    <div><strong>Name:</strong> {item.Name}</div>
                    <div><strong>Branch Type:</strong> {item.BranchType}</div>
                    <div><strong>Delivery Status:</strong> {item.DeliveryStatus}</div>
                    <div><strong>District:</strong> {item.District}</div>
                    <div><strong>Division:</strong> {item.Division}</div>
                  </div>
                ))
              ) : (
                <div className="no-data">Couldn't find the postal data you’re looking for...</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PincodeLookup;
