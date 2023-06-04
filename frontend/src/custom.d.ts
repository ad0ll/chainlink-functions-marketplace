// typings.d.ts
declare module '*.svg' {
    import React from "react";
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}
declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";