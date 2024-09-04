import Piloting from "./pages/Piloting";
import { Weapons } from "./pages/Weapons";

export const Screens = [
    {
      name: "Piloting",
      component: () => <Piloting/>,
    },
    {
      name: "Weapons",
      component: () => <Weapons/>,
    },
  ];
  
  export type ScreenType = (typeof Screens)[number];