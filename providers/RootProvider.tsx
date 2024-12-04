import { StatusBar } from "expo-status-bar"
import Tamagui from "./Tamagui"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { PropsWithChildren } from "react"

export function RootProvider({ children }: PropsWithChildren) {
    return (
        <>
            <Tamagui>{children}</Tamagui>
            <StatusBar />
        </>
    )
}
