/**
 * Build-time map geometry. Runs in a server component during `next build`, so visitors download
 * finished SVG paths and none of d3-geo, topojson or the atlas data.
 */
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldTopo from "world-atlas/countries-110m.json";
import usTopo from "us-atlas/states-albers-10m.json";

export interface MapShape {
  id: string;
  name: string;
  d: string;
  visited: boolean;
}

export interface MapMarker {
  id: string;
  name: string;
  x: number;
  y: number;
}

type Props = { name: string };

export function worldMap(visited: Record<string, string>, small: { id: string; name: string; coordinates: [number, number] }[]) {
  const width = 960;
  const height = 470;
  const topo = worldTopo as unknown as Topology<{ countries: GeometryCollection<Props> }>;
  const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, Props>;
  // Antarctica takes a third of the map and nobody has a trip there; leave it out.
  const land: FeatureCollection<Geometry, Props> = {
    ...countries,
    features: countries.features.filter((f) => f.properties.name !== "Antarctica"),
  };
  const projection = geoEqualEarth().fitExtent(
    [
      [6, 6],
      [width - 6, height - 6],
    ],
    land,
  );
  const path = geoPath(projection).digits(0);

  const shapes: MapShape[] = land.features.map((f) => {
    const id = String(f.id ?? f.properties.name);
    return { id, name: visited[id] ?? f.properties.name, d: path(f) ?? "", visited: id in visited };
  });
  const markers: MapMarker[] = small.map((p) => {
    const [x, y] = projection(p.coordinates) ?? [0, 0];
    return { id: p.id, name: p.name, x, y };
  });
  return { width, height, shapes, markers };
}

export function usMap(visited: string[]) {
  // The atlas is pre-projected to Albers USA in a 975 × 610 frame, so weights are in square pixels.
  // Dropping detail under ~1.5 px² is invisible at display size and trims the travel page by about a third.
  const raw = usTopo as unknown as Topology<{ states: GeometryCollection<Props> }>;
  const topo = simplify(presimplify(raw), 1.5) as typeof raw;
  const states = feature(topo, topo.objects.states) as FeatureCollection<Geometry, Props>;
  const path = geoPath(null).digits(0);
  const set = new Set(visited);
  const shapes: MapShape[] = states.features.map((f) => ({
    id: String(f.id),
    name: f.properties.name,
    d: path(f) ?? "",
    visited: set.has(f.properties.name),
  }));
  return { width: 975, height: 610, shapes };
}
