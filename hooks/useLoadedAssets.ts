import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(console.warn)

export function useLoadedAssets() {
    const [isFontLoaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })


    useEffect(() => {
        if (isFontLoaded) {
            SplashScreen.hideAsync().catch(console.warn)
        }
    }, [isFontLoaded])

    return isFontLoaded;
}
