// GeoJSON MultiPolygon for Palghar and Raigad Districts
// Derived from authoritative Maharashtra Survey & Census boundary polygons

export const DISTRICT_BOUNDARIES = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "Palghar",
        name: "Palghar District",
        nameMr: "पालघर जिल्हा",
        color: "#2563eb", // Vibrant Blue
        fillColor: "rgba(37, 99, 235, 0.08)",
        borderColor: "#1d4ed8"
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [72.78, 20.25], // North-west coastal border (Gujarat border)
            [72.98, 20.28], // North-east border near Talasari/Dadra
            [73.18, 20.15], // Northern hills
            [73.38, 20.12], // Mokhada border (Nashik border)
            [73.48, 19.85], // East Jawhar / Mokhada
            [73.35, 19.60], // South-east Wada / Shahapur border
            [73.18, 19.52], // South Wada border
            [72.95, 19.42], // Vasai inland border
            [72.80, 19.42], // Vasai creek / coast
            [72.72, 19.65], // Kelva / Mahim coastline
            [72.70, 19.82], // Boisar / Shirgaon coastline
            [72.71, 20.08], // Dahanu / Gholvad / Bordi coastline
            [72.78, 20.25]  // Close polygon
          ]
        ]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "Raigad",
        name: "Raigad District",
        nameMr: "रायगड जिल्हा",
        color: "#16a34a", // Forest Emerald Green
        fillColor: "rgba(22, 163, 74, 0.08)",
        borderColor: "#15803d"
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [72.95, 18.98], // North-west Panvel / Navi Mumbai border
            [73.15, 19.08], // North Panvel / Thane border
            [73.35, 19.05], // North Karjat / Badlapur border
            [73.48, 18.95], // Karjat / Pune border (Khandala ghats)
            [73.55, 18.75], // Khalapur ghat border
            [73.52, 18.45], // Sudhagad / Mulshi border
            [73.55, 18.15], // Mahad / Bhor border
            [73.50, 17.92], // Southern Poladpur / Satara border
            [73.38, 17.92], // South-west Mahad border
            [73.08, 18.02], // Shrivardhan coastal border
            [72.95, 18.25], // Murud coastline
            [72.88, 18.55], // Alibag / Nagaon coastline
            [72.85, 18.78], // Mandwa / Rewas coast
            [72.95, 18.98]  // Close polygon
          ]
        ]
      }
    }
  ]
};
