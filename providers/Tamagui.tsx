import { TamaguiProvider, Theme } from "@tamagui/core"
import { useColorScheme } from "react-native"
import config from "@/tamagui.config"
import { PropsWithChildren } from "react"
import { PortalProvider, YStack } from "tamagui"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Tamagui({ children }: PropsWithChildren) {
    const colorScheme = useColorScheme()
    const safeAreaInsets = useSafeAreaInsets()
    return (
        <TamaguiProvider config={config}>
            <Theme name={colorScheme}>
                <PortalProvider shouldAddRootHost>
                    <YStack
                        flex={1}
                        backgroundColor={"$background"}
                        // padding={"$2"}
                        // paddingTop={safeAreaInsets.top}
                    >
                        {children}
                    </YStack>
                </PortalProvider>
            </Theme>
        </TamaguiProvider>
    )
}
