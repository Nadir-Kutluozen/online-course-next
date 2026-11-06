import { forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, type CSSProperties, type MouseEventHandler } from "react";
import { mount, type Player, type Stew, type StewScene } from "@stew-engine/player";

/** What Stew's player plays on the artwork (generated - see the header). */
const SCENE: StewScene = { "v": 1, "doc": { "duration": 1.5, "tracks": [], "behaviors": [], "trigger": "load", "loop": true }, "interactions": [{ "id": "473085f9-a5a8-4f5a-a45d-15464d99ea73", "name": "Main", "doc": { "duration": 3, "tracks": [{ "id": "4e521ffb-4cb8-4580-b61a-d2e552bddc47", "targetUid": "path-165-518fe10e", "property": "anchor", "keyframes": [{ "id": "5d51a768-a29e-4d9f-be9d-b13885dc4a77", "time": 0, "value": "0.5075583275619356 0.9983140402538171", "easing": "power1.inOut" }] }, { "id": "141e080f-b285-47f5-905d-508191fa01cf", "targetUid": "path-165-518fe10e", "property": "scaleX", "keyframes": [{ "id": "b26ae064-cf1b-4c3c-bc58-4f6c3a5bf85b", "time": 0, "value": 1, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "290df50f-9e70-45e6-8302-ec00defc9276", "time": 0.4496301851792807, "value": 1, "easing": "power1.inOut" }] }, { "id": "e8d3d8cf-46c1-459a-9a9d-e7b10f8b188f", "targetUid": "path-165-518fe10e", "property": "scaleY", "keyframes": [{ "id": "113e6053-0915-41d6-a7fd-09d3c1dff9a3", "time": 0, "value": 1, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "64144c3e-095f-4114-bebb-99f708d32efb", "time": 0.4496301851792807, "value": 0, "easing": "power1.inOut" }] }, { "id": "e8b56057-26d0-41be-b432-43ea254d0df9", "targetUid": "path-ve7ap9u", "property": "anchor", "keyframes": [{ "id": "bd4d9c92-3f47-4d13-9404-94a430fce8c3", "time": 0.4496301851792807, "value": "1 0.5239364395095051", "easing": "power1.inOut" }] }, { "id": "becfb53c-2a70-4bb0-8cf9-2a9f7b72cca6", "targetUid": "path-ve7ap9u", "property": "scaleX", "keyframes": [{ "id": "729c4003-5e70-490e-b9e7-0f4e88c95f8f", "time": 0, "value": 1, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "e4335b1f-c895-49c3-b449-3c943b4bdce1", "time": 0.4496301851792807, "value": 0, "easing": "power1.inOut" }] }, { "id": "fe64638d-6443-4cd2-85a1-8ba42c3e53f1", "targetUid": "path-ve7ap9u", "property": "scaleY", "keyframes": [{ "id": "c9435e52-ae7e-4361-8aa9-df198a744d5c", "time": 0, "value": 1, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "9932c859-fb89-4abc-875b-d68f128f0ee3", "time": 0.4496301851792807, "value": 1, "easing": "power1.inOut" }] }, { "id": "2b6755a3-007e-4c77-b592-ee7fd8462815", "targetUid": "text-16a-d888b22a", "property": "x", "keyframes": [{ "id": "32ad6bb4-83e1-460f-8ac6-0b114d6ce5c6", "time": 0, "value": 0, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "35a81cbc-701d-4fc7-a5bb-72302d19ebae", "time": 0.4496301851792807, "value": 66.01, "easing": "power1.inOut" }] }, { "id": "1d1cb46f-0b30-4720-8f4b-f4dbf465abcf", "targetUid": "text-16a-d888b22a", "property": "y", "keyframes": [{ "id": "85db5d39-d8e0-46e6-bbc4-5b2c7fc15b01", "time": 0, "value": 0, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "d69802f6-5899-4893-a187-4423611406b2", "time": 0.4496301851792807, "value": 0, "easing": "power1.inOut" }] }, { "id": "ec66e3db-20e4-441f-9898-a64ec1a342b5", "targetUid": "text-21bbwsp", "property": "x", "keyframes": [{ "id": "c1d5ada6-4fa2-4636-a260-fa9558ba0338", "time": 0, "value": 0, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "7aeed485-66fc-43be-8432-67d8ad4d026d", "time": 0.4496301851792807, "value": -86.99, "easing": "power1.inOut" }, { "id": "0d27bbf8-93ce-405c-b527-d398dd0b7e65", "time": 0.6287359396066392, "value": -86.99, "easing": "power1.inOut" }] }, { "id": "4c932e5b-95b0-409c-9bd4-28e705a40701", "targetUid": "text-21bbwsp", "property": "y", "keyframes": [{ "id": "aa1b0f40-4262-4a7f-a85d-eedcbdb6fe77", "time": 0, "value": 0, "easing": "cubic-bezier(0.68,-0.6,0.32,1.6)" }, { "id": "4a825410-40ac-4d3d-84ef-a8c109cfaaa6", "time": 0.4496301851792807, "value": 0, "easing": "power1.inOut" }, { "id": "84a5441f-2b30-4ff6-8469-13e691e23794", "time": 0.6287359396066392, "value": 0.78, "easing": "power1.inOut" }] }, { "id": "acff14f8-70c9-462c-8aa4-13ea72a793f2", "targetUid": "text-21bbwsp", "property": "fill", "keyframes": [{ "id": "74193aaa-93eb-4a2f-8cf7-478c7894716d", "time": 0, "value": "#ffffff", "easing": "power1.inOut" }, { "id": "54b7d8c2-2b49-4f77-b212-c70905537285", "time": 0.4496301851792807, "value": "#2b0000", "easing": "power1.inOut" }] }], "behaviors": [] }, "interaction": { "on": "hover", "targetAll": true }, "blend": "add", "enabled": true, "labPos": { "x": 56, "y": 56 } }, { "id": "a8674bf8-3210-482c-8d45-7e7524dbcdfa", "name": "Press", "doc": { "duration": 1.5, "tracks": [{ "id": "d5ec1c06-a703-45e3-bef1-068fcb1234f2", "targetUid": "text-21bbwsp", "property": "fill", "keyframes": [{ "id": "d11f4574-3d28-4f28-afd2-a6f4673cde0e", "time": 0, "value": "#ffffff", "easing": "power1.inOut" }, { "id": "531a609e-ee12-4539-ba6c-b7e4128673cf", "time": 0.12220240447245201, "value": "#f31212", "easing": "power1.inOut" }] }, { "id": "a1c712e8-67a2-45d6-a45f-16f08cdf7551", "targetUid": "text-21bbwsp", "property": "scaleX", "keyframes": [{ "id": "4cf0d74d-76e2-4d4d-8049-7f6fc770077d", "time": 0, "value": 1, "easing": "power1.inOut" }, { "id": "d9ac1f91-3136-46c0-9283-fb7ac33826a3", "time": 0.12220240447245201, "value": 1.6, "easing": "power1.inOut" }] }, { "id": "af0f3d2e-b60b-4a63-80de-78e9119296dd", "targetUid": "text-21bbwsp", "property": "scaleY", "keyframes": [{ "id": "eead4196-07bc-40a9-ae51-b5b5546b23e4", "time": 0, "value": 1, "easing": "power1.inOut" }, { "id": "aa1a2cbf-a2f6-47d7-9bf1-350ec40b72e4", "time": 0.12220240447245201, "value": 1.6, "easing": "power1.inOut" }] }], "behaviors": [] }, "interaction": { "on": "press", "targetAll": true }, "labPos": { "x": 90, "y": 170 }, "enabled": true }] };

// The scene mounts before the first paint in a browser; a server has
// nothing to play.
const useMountEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface CourseCompareLogoAnimProps {
  /** Size/position it from the outside, e.g. <CourseCompareLogoAnim style={{ width: 240 }} /> */
  className?: string;
  style?: CSSProperties;
  /** notified when the artwork is clicked */
  onClick?: MouseEventHandler<SVGSVGElement>;
}

/** Drive it from code: <CourseCompareLogoAnim ref={anim} />, then anim.current?.player. */
export interface CourseCompareLogoAnimHandle {
  /** the scene's clip: play(), pause(), reverse(), restart(), seek(seconds),
   *  timeScale, duration... null until it mounts */
  readonly player: Player | null;
}

/**
 * CourseCompareLogoAnim - generated by Stew Factory.
 * Trigger: load · loops
 * Interactions: Main on hover, Press on press
 * Deps:  npm i @stew-engine/player
 *
 * Sizing: the SVG fills its container by default - wrap it in a sized element,
 * or pass className / style (e.g. style={{ width: 240, height: 240 }}).
 * overflow:visible lets motion extend past the frame (matches the editor).
 */
const CourseCompareLogoAnim = forwardRef<CourseCompareLogoAnimHandle, CourseCompareLogoAnimProps>(function CourseCompareLogoAnim({ className, style, onClick }, ref) {
  const root = useRef<SVGSVGElement>(null);
  const stew = useRef<Stew | null>(null);
  /** Marks this copy's ids: url(#...) and href="#..." search the whole page, so copies can't share them. */
  const sid = useId();

  useMountEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const scene = mount(svg, SCENE);
    stew.current = scene;
    return () => {
      scene.destroy();
      stew.current = null;
    };
  }, []);
  useImperativeHandle(ref, () => ({ get player() { return stew.current?.player ?? null; } }), []);

  return (
    <svg ref={root} xmlns="http://www.w3.org/2000/svg" viewBox="278.5 254.58 343.24 303.29" onClick={onClick} className={className} style={{ overflow: "visible", ...style }}>
      <style>{`@font-face{font-family:'ClashDisplay Semibold';src:url('https://oktjzmyydeilfcywogfh.supabase.co/storage/v1/object/public/fonts/c20559c2-46ca-4794-9500-83b73effd860/clashdisplay-semibold.woff2') format('woff2');font-weight:100 900;font-display:swap;}`}</style>
      <defs>
        <mask id={`${sid}-stew-text-16a-d888b22a-smask`} maskUnits="userSpaceOnUse" x="-100000" y="-100000" width="200000" height="200000">
          <rect x="-100000" y="-100000" width="200000" height="200000" fill="white" />
          <text x="512" y="512" fontSize="140" fontFamily="'ClashDisplay Semibold', sans-serif" dominantBaseline="middle" textAnchor="middle" fontWeight="900" fill="black" stroke="none">
            <tspan x="512" dy="0">
              C
            </tspan>
          </text>
        </mask>
      </defs>
      <g>
        <g data-stew-anim-uid="path-165-518fe10e">
          <g data-stew-turn-uid="path-165-518fe10e">
            <path data-stew-uid="path-165-518fe10e" id="path-165-518fe10e" d="M 296.89 272.97 C 363.28 272.97 401.4 272.97 450.35 329.78 C 450.35 400.08 450.35 466.82 450.35 539.48 C 403.78 495.39 364.47 495.39 296.89 495.39 Z" fill="#000000" stroke="none" strokeWidth="0" strokeOpacity="1" strokeLinecap="butt" strokeLinejoin="miter" strokeDasharray="" data-stew-fills={"[{\"id\":\"fill-166-323ca002\",\"paint\":{\"type\":\"solid\",\"color\":\"#000000\"},\"opacity\":1,\"visible\":true}]"} fillOpacity="1" data-stew-anchor="0.5075583275619356 0.9983140402538171" />
          </g>
        </g>
      </g>
      <g>
        <g data-stew-anim-uid="path-ve7ap9u">
          <g data-stew-turn-uid="path-ve7ap9u">
            <g transform="matrix(-1,0,0,1,900.24,0)">
              <path data-stew-uid="path-ve7ap9u" id="path-ve7ap9u" d="M 296.89 272.97 C 363.28 272.97 401.4 272.97 450.35 329.78 C 450.35 400.08 450.35 466.82 450.35 539.48 C 403.78 495.39 364.47 495.39 296.89 495.39 Z" fill="#000000" stroke="#ffffff" strokeWidth="3.8" strokeOpacity="1" strokeLinecap="round" strokeLinejoin="miter" strokeDasharray="" data-stew-fills={"[{\"id\":\"fill-166-323ca002\",\"paint\":{\"type\":\"solid\",\"color\":\"#000000\"},\"opacity\":1,\"visible\":true}]"} fillOpacity="1" data-stew-anchor="1 0.5239364395095051" />
            </g>
          </g>
        </g>
      </g>
      <g>
        <g data-stew-anim-uid="text-16a-d888b22a">
          <g transform="matrix(1,0,0,1,-138.38,-109.48)">
            <text data-stew-uid="text-16a-d888b22a" id="text-16a-d888b22a" x="512" y="512" fill="#000000" fontSize="140" fontFamily="'ClashDisplay Semibold', sans-serif" dominantBaseline="middle" textAnchor="middle" fontWeight="900" data-stew-fills={"[{\"id\":\"fill-16n-7be777d7\",\"paint\":{\"type\":\"solid\",\"color\":\"#000000\"},\"opacity\":1,\"visible\":true}]"} fillOpacity="1" stroke="none" strokeWidth="0" strokeDasharray="">
              <tspan x="512" dy="0">
                C
              </tspan>
            </text>
            <text x="512" y="512" fontSize="140" fontFamily="'ClashDisplay Semibold', sans-serif" dominantBaseline="middle" textAnchor="middle" fontWeight="900" fill="none" stroke="#ffffff" strokeWidth="10" strokeOpacity="1" strokeLinecap="butt" strokeLinejoin="round" style={{ "pointerEvents": "none" }} data-stew-stroke-overlay="text-16a-d888b22a" mask={`url(#${sid}-stew-text-16a-d888b22a-smask)`}>
              <tspan x="512" dy="0">
                C
              </tspan>
            </text>
          </g>
        </g>
      </g>
      <g>
        <g data-stew-anim-uid="text-21bbwsp">
          <g data-stew-turn-uid="text-21bbwsp">
            <g transform="matrix(1,0,0,1,14.62,-109.48)">
              <text data-stew-uid="text-21bbwsp" id="text-21bbwsp" x="512" y="512" fill="#ffffff" fontSize="150" fontFamily="'ClashDisplay Semibold', sans-serif" dominantBaseline="middle" textAnchor="middle" fontWeight="900" data-stew-fills={"[{\"id\":\"fill-16o-0af46c55\",\"paint\":{\"type\":\"solid\",\"color\":\"#ffffff\"},\"opacity\":1,\"visible\":true}]"} fillOpacity="1" stroke="none" strokeWidth="0" strokeDasharray="">
                <tspan x="512" dy="0">
                  C
                </tspan>
              </text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});

export default CourseCompareLogoAnim;
