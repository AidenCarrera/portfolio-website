import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aiden Carrera | Developer & Musician",
  description: "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
};

export default function Home() {
  return <HomeClient />;
}
