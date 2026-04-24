import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

type YandexMapProps = {
  center?: [number, number];
  zoom?: number;
};

export function YandexMap({ center = [55.751244, 37.618423], zoom = 10 }: YandexMapProps) {
  return (
    <YMaps>
      <Map
        defaultState={{ center, zoom }}
        width="100%"
        height="420px"
        options={{ suppressMapOpenBlock: true }}
      >
        <Placemark geometry={center} />
      </Map>
    </YMaps>
  );
}
