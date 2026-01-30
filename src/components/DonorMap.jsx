import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import hospitalIconImg from "../assets/hospital.png";
import pinImg from "../assets/pin.png";

// Icons
const hospitalIcon = new L.Icon({
  iconUrl: hospitalIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const pinIcon = new L.Icon({
  iconUrl: pinImg,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Search Bar
function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      position: "topright",
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      map.setView([y, x], 13);
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map]);

  return null;
}

// Click to pick location (FORM only)
function ClickPicker({ setSelectedPos }) {
  const map = useMap();

  useEffect(() => {
    const onClick = (e) => {
      setSelectedPos({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map, setSelectedPos]);

  return null;
}

// Auto-center map when donors change
function MapUpdater({ donors, mapType }) {
  const map = useMap();

  useEffect(() => {
    if (mapType === "list" && donors.length > 0) {
      const center = [Number(donors[0].lat), Number(donors[0].lng)];
      const zoom = donors.length === 1 ? 12 : 6;
      map.setView(center, zoom);
    }
  }, [donors, map, mapType]);

  return null;
}

export default function DonorMap({
  donors = [],
  enableSearch = false,
  setSearchPos,
  mapType = "list", // "list" | "form"
}) {
  const defaultCenter =
    donors.length > 0
      ? [Number(donors[0].lat), Number(donors[0].lng)]
      : [20.5937, 78.9629];

  const [selectedPos, setSelectedPos] = useState(
    mapType === "form" && donors[0]?.lat
      ? { lat: Number(donors[0].lat), lng: Number(donors[0].lng) }
      : null
  );

  useEffect(() => {
    if (setSearchPos && selectedPos) {
      setSearchPos(selectedPos);
    }
  }, [selectedPos, setSearchPos]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={donors.length === 1 ? 12 : 6}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {enableSearch && <SearchControl />}

      {mapType === "form" && <ClickPicker setSelectedPos={setSelectedPos} />}

      {mapType === "list" && <MapUpdater donors={donors} mapType={mapType} />}

      {/* 📍 PIN — FOR FORM AND VIEW PROFILE */}
      {(mapType === "form" || mapType === "view") && selectedPos && (
        <Marker
          position={[selectedPos.lat, selectedPos.lng]}
          icon={pinIcon}
        >
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* 📍 PIN — FOR VIEW PROFILE (fallback if selectedPos not set) */}
      {mapType === "view" && !selectedPos && donors.length > 0 && donors[0]?.lat && (
        <Marker
          position={[Number(donors[0].lat), Number(donors[0].lng)]}
          icon={pinIcon}
        >
          <Popup>
            <b>{donors[0].name || "Donor"}</b>
            <br />
            🩸 {donors[0].bloodGroup}
          </Popup>
        </Marker>
      )}

      {/* 🏥 HOSPITAL — ONLY FOR LIST */}
      {mapType === "list" &&
        donors
          .filter((d) => d.lat && d.lng)
          .map((d) => (
            <Marker
              key={d.id}
              position={[Number(d.lat), Number(d.lng)]}
              icon={hospitalIcon}
            >
              <Popup>
                <b>{d.name || "Donor"}</b>
                <br />
                🩸 {d.bloodGroup}
                <br />
                📍 {d.city}
                <br />
                📞 {d.phone}
              </Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}
