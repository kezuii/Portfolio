import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      mesh: ThreeElements['mesh'];
    }
  }
}

declare module "*.glsl" {
  const value: string;
  export default value;
}