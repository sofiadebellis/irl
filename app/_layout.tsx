import "@/global.css";
import { Slot } from "expo-router";
import Nav from "./components/structure/nav";
import Header from "./components/structure/header";
import { usePathname } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const pathname = usePathname();

  // No header or nav for these routes
  const noHeaderOrNav = ["/", "/login", "/signup"].includes(pathname);

  // Header only for routes other than these
  const headerOnly =
    !noHeaderOrNav &&
    !["/events", "/dashboard", "/messages", "/profile"].includes(pathname);

  return (
    <GluestackUIProvider mode="light">
      {noHeaderOrNav ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar style="light" />
          <Header />
          <Slot />
          {!headerOnly && <Nav />}
        </SafeAreaView>
      )}
    </GluestackUIProvider>
  );
}
