import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CalcResult } from '../../types';
import { useStore } from '../../store/useStore';

interface Props {
  result: CalcResult;
  isVisible: boolean;
}

// Вызывает invalidateSize когда вкладка становится видимой
function MapResizer({ isVisible }: { isVisible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => {
        map.invalidateSize({ animate: false });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isVisible, map]);
  return null;
}

function EpicenterSetter() {
  const { setEpicenter } = useStore();
  useMapEvents({
    click(e) { setEpicenter([e.latlng.lat, e.latlng.lng]); },
  });
  return null;
}

export function ZonesMap({ result, isVisible }: Props) {
  const { epicenter } = useStore();
  const { zones } = result;
  const sortedZones = [...zones].sort((a, b) => b.radius - a.radius);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Заголовок и легенда */}
      <div className="flex items-start justify-between flex-wrap gap-3 shrink-0">
        <div>
          <h3 className="font-semibold text-slate-200" style={{ fontSize: 15 }}>Карта опасных зон</h3>
          <p className="text-slate-500 mt-0.5" style={{ fontSize: 13 }}>
            Нажмите на карту чтобы переместить эпицентр
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {zones.map(z => (
            <div key={z.label} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: z.color, backgroundColor: z.color + '30' }} />
              <span className="text-slate-400" style={{ fontSize: 13 }}>
                {z.thresholdKPa} кПа{z.radius > 0 ? ` · ${z.radius} м` : ' · —'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Карта */}
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-slate-800" style={{ minHeight: 400 }}>
        <MapContainer
          center={epicenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Карта">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                subdomains="abcd"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Спутник (Esri)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapResizer isVisible={isVisible} />
          <EpicenterSetter />

          {sortedZones.map(zone =>
            zone.radius > 0 ? (
              <Circle
                key={`${zone.label}-${zone.radius}-${epicenter[0]}-${epicenter[1]}`}
                center={epicenter}
                radius={zone.radius}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.13,
                  weight: 2.5,
                  opacity: 0.9,
                }}
              >
                <Popup>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    <strong>{zone.label}</strong><br />
                    {zone.description}<br />
                    ΔP = <strong>{zone.thresholdKPa} кПа</strong><br />
                    Радиус = <strong>{zone.radius.toLocaleString('ru')} м</strong><br />
                    Площадь = <strong>{zone.area.toLocaleString('ru')} м²</strong>
                  </div>
                </Popup>
              </Circle>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}
