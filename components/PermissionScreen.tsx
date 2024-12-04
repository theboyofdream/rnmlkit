import { Screen } from "./Screen"
import { usePermissions } from "@/hooks/usePermissions"
import { useEffect } from "react"
import { Linking } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, H1, H2, H4, H5, Paragraph, Text, View, XStack, YStack } from "tamagui"

// const customTransition = SharedTransition.custom((values) => {
//     "worklet"
//     return {
//         height: withSpring(values.targetHeight),
//         // height: values.targetHeight,
//         width: withSpring(values.targetWidth),
//         originX: withSpring(values.targetOriginX),
//         originY: withSpring(values.targetOriginY),
//     }
// })

export function PermissionScreen() {
    const { hasPermissions, requestCameraPermission } = usePermissions()

    useEffect(() => {
        if (hasPermissions) {
            return
        }
        requestCameraPermission()
    }, [hasPermissions])

    return (
        <Screen justifyContent="center" alignItems="center">
            <YStack gap={"$4"} maxWidth={360}>
                <H2 color={"$red10"}>Permission Error:</H2>
                <Text fontSize={"$5"}>
                    Please grant camera and microphone permissions in app settings to continue.
                </Text>
                <Button
                    pressStyle={{
                        scale: 0.95,
                    }}
                    borderRadius={"$12"}
                    onPress={() => {
                        Linking.openSettings()
                    }}
                >
                    Open Settings
                </Button>
            </YStack>
        </Screen>
    )
}
