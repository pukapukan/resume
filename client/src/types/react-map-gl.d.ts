declare module 'react-map-gl' {
  import * as React from 'react';
  import mapboxgl from 'mapbox-gl';

  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
    padding?: number | { left: number; top: number; right: number; bottom: number };
  }

  export interface MapProps extends Omit<React.HTMLProps<HTMLDivElement>, 'style'> {
    mapboxAccessToken: string;
    initialViewState?: ViewState;
    viewState?: ViewState;
    onMove?: (evt: { viewState: ViewState }) => void;
    onMoveStart?: (evt: { viewState: ViewState }) => void;
    onMoveEnd?: (evt: { viewState: ViewState }) => void;
    mapStyle?: string;
    attributionControl?: boolean;
    reuseMaps?: boolean;
    projection?: string | { name: string; [key: string]: any };
    interactive?: boolean;
    terrain?: { source: string; exaggeration?: number };
    fog?: { [key: string]: any };
    cooperativeGestures?: boolean;
    hash?: boolean;
    scrollZoom?: boolean | { smooth?: boolean; speed?: number; around?: 'center' | 'mouse' };
    boxZoom?: boolean;
    doubleClickZoom?: boolean;
    keyboard?: boolean;
    dragRotate?: boolean;
    touchPitch?: boolean;
    touchZoom?: boolean;
    dragPan?: boolean;
    style?: React.CSSProperties;
    RTLTextPlugin?: string;
    onLoad?: (evt: { target: mapboxgl.Map }) => void;
    onError?: (evt: { error: Error }) => void;
    onRender?: () => void;
    mapLib?: any;
    renderWorldCopies?: boolean;
    maxBounds?: [[number, number], [number, number]];
    locale?: { [key: string]: string };
  }

  export interface MarkerProps {
    anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
    draggable?: boolean;
    latitude: number;
    longitude: number;
    offset?: [number, number];
    rotation?: number;
    pitchAlignment?: 'map' | 'viewport' | 'auto';
    rotationAlignment?: 'map' | 'viewport' | 'auto';
    popup?: React.ReactElement;
    onClick?: (evt: React.MouseEvent<HTMLDivElement>) => void;
    onDrag?: (evt: { lngLat: [number, number] }) => void;
    onDragStart?: (evt: { lngLat: [number, number] }) => void;
    onDragEnd?: (evt: { lngLat: [number, number] }) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface PopupProps {
    anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    className?: string;
    longitude: number;
    latitude: number;
    offset?: number | [number, number] | { [key: string]: [number, number] };
    closeButton?: boolean;
    closeOnClick?: boolean;
    closeOnMove?: boolean;
    focusAfterOpen?: boolean;
    maxWidth?: string;
    onClose?: () => void;
    onOpen?: () => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface NavigationControlProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
    style?: React.CSSProperties;
  }

  export interface FullscreenControlProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    containerId?: string;
    style?: React.CSSProperties;
  }

  export interface GeolocateControlProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    trackUserLocation?: boolean;
    showUserLocation?: boolean;
    showAccuracyCircle?: boolean;
    positionOptions?: PositionOptions;
    fitBoundsOptions?: { [key: string]: any };
    style?: React.CSSProperties;
    onGeolocate?: (evt: { coords: GeolocationCoordinates }) => void;
    onError?: (evt: { error: GeolocationPositionError }) => void;
  }

  export interface ScaleControlProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    maxWidth?: number;
    unit?: 'imperial' | 'metric' | 'nautical';
    style?: React.CSSProperties;
  }

  export class Map extends React.Component<MapProps> {
    getMap(): mapboxgl.Map;
    flyTo(options: { center: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number; essential?: boolean }): void;
  }

  export class Marker extends React.Component<MarkerProps> {}
  export class Popup extends React.Component<PopupProps> {}
  export class NavigationControl extends React.Component<NavigationControlProps> {}
  export class FullscreenControl extends React.Component<FullscreenControlProps> {}
  export class GeolocateControl extends React.Component<GeolocateControlProps> {}
  export class ScaleControl extends React.Component<ScaleControlProps> {}

  export default Map;
}