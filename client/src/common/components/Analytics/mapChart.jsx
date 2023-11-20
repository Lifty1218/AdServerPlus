import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { mapData } from "../../../data/mapData";
import axios from "axios";

const MapChart = ({ domainId }) => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/web_analytics/users_by_country/${domainId}`
        );

        const filteredData = mapData.features.map((feature) => {
          const countryName = feature.properties.name;
          const item = response.data.find(
            (item) => item.country === countryName
          );
          return {
            ...feature,
            properties: {
              ...feature.properties,
              percentage: item ? parseFloat(item.percentage.toFixed(2)) : 0,
            },
          };
        });
        setLocationData(filteredData);
      } catch (error) {
        console.error("Error retrieving user counts:", error);
      }
    };

    fetchLocationData();
  }, [domainId]);

  useEffect(() => {
    const mapContainer =
      document.getElementsByClassName("leaflet-container")[0];
    if (mapContainer) {
      mapContainer.style.height = "500px";
    }
  }, []);

  const getColor = (percentage) => {
    if (percentage == 0) {
      return "transparent"; // Light gray
    } else if (percentage < 20) {
      return "#98FB98"; // Light green
    } else if (percentage < 40) {
      return "#66CDAA"; // Medium light green
    } else if (percentage < 60) {
      return "#40E0D0"; // Medium teal
    } else if (percentage < 80) {
      return "#00CED1"; // Medium dark teal
    } else {
      return "#008080"; // Dark teal
    }
  };

  const getMapStyle = (feature) => {
    const percentage = feature.properties.percentage;
    return {
      fillColor: getColor(percentage),
      weight: 1.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };

  const handleFeature = (feature, layer) => {
    const { name, percentage } = feature.properties;
    layer.bindPopup(
      `<p style="font-size: 12px;"><strong style="font-size: 15px;">${name}</strong><br/>User Traffic: ${percentage}%</p>`
    );
  };

  return (
    <>
      <p
        style={{
          fontSize: "2.5rem",
          color: "#00ADB5",
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
          marginBottom: "2.5rem",
        }}
      >
        Geographic Distribution
        <span
          style={{
            fontSize: "1.6rem",
            color: "#777777",
            display: "block",
          }}
        >
          Percentage of User Traffic by Location
        </span>
      </p>

      {locationData.length > 0 && (
        <MapContainer
          center={[30, 0]}
          zoom={2}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // attribution="Map data © OpenStreetMap contributors"
          />
          <GeoJSON
            data={locationData}
            style={getMapStyle}
            onEachFeature={handleFeature}
          />
        </MapContainer>
      )}
    </>
  );
};

export default MapChart;
