import { NoCameraFound, PermissionScreen, Screen } from "@/components"
import { usePermissions } from "@/hooks/usePermissions"
import { useNavigation } from "@react-navigation/native"
import { ChevronLeft, Flashlight, FlashlightOff, Images, X } from "@tamagui/lucide-icons"
import { useEffect, useRef } from "react"
import { Linking, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
    Camera,
    runAtTargetFps,
    useCameraDevice,
    useFrameProcessor,
} from "react-native-vision-camera"
import { Button, H1, H2, H4, H5, Paragraph, Text, View, XStack, YStack } from "tamagui"
// import { useTextRecognition } from "react-native-vision-camera-text-recognition"

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

const TARGET_FPS = 2

export function TextRecognitionScreen() {
    const navigation = useNavigation()
    const { hasPermissions } = usePermissions()

    const device = useCameraDevice("back")
    const cameraRef = useRef<Camera>(null)
    // const { scanText } = useTextRecognition()

    const frameProcessor = useFrameProcessor((frame) => {
        "worklet"
        // console.log("I'm running synchronously at 60 FPS!")

        runAtTargetFps(TARGET_FPS, () => {
            "worklet"

            // const data = scanText(frame)
            // console.log(data, "data")
            console.log("I'm running synchronously at 2 FPS!")
            // const brightness = detectBrightness(frame)
        })
    }, [])

    async function captureImage() {
        if (!cameraRef.current) return
        const photo = await cameraRef.current.takePhoto({
            flash: "off",
            enableShutterSound: true,
        })
        console.log({ photo })
    }

    if (!hasPermissions) return <PermissionScreen />
    if (device == null) return <NoCameraFound />

    return (
        <Screen justifyContent="center" alignItems="center">
            <XStack
                position="absolute"
                top="$0"
                left="$0"
                padding="$2"
                zIndex={"$1"}
                width={"100%"}
                // backgroundColor={"$background"}
                // justifyContent="space-between"
                justifyContent="flex-end"
                opacity={0}
            >
                {/* <Button icon={ChevronLeft} scaleIcon={1.5} aspectRatio={1} chromeless /> */}
                <Button
                    icon={X}
                    scaleIcon={1.5}
                    aspectRatio={1}
                    pressStyle={{
                        scale: 0.9,
                    }}
                    chromeless
                />
            </XStack>
            <Camera
                ref={cameraRef}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 30 }]}
                device={device}
                isActive={true}
                photo
                // frameProcessor={frameProcessor}
            />
            <XStack
                position="absolute"
                bottom="$0"
                left="$0"
                padding="$5"
                width={"100%"}
                backgroundColor={"$background"}
                justifyContent="space-around"
                alignItems="center"
            >
                <Button
                    icon={Images}
                    scaleIcon={2}
                    aspectRatio={1}
                    chromeless
                    pressStyle={{
                        scale: 0.9,
                    }}
                />
                {/* <Button icon={X} scaleIcon={2} aspectRatio={1} chromeless /> */}
                <Button
                    aspectRatio={1}
                    borderRadius={"$12"}
                    height={"$6"}
                    pressStyle={{
                        scale: 0.95,
                    }}
                    onPress={captureImage}
                >
                    <View
                        borderColor={"$color"}
                        borderWidth={"$1"}
                        borderRadius={"$12"}
                        padding={"$1.5"}
                    >
                        <View
                            backgroundColor={"$color"}
                            height={"$6"}
                            aspectRatio={1}
                            // width={"$6"}
                            borderRadius={"$12"}
                        />
                    </View>
                </Button>
                <Button
                    icon={X}
                    scaleIcon={2}
                    aspectRatio={1}
                    pressStyle={{
                        scale: 0.9,
                    }}
                    chromeless
                    onPress={() => {
                        navigation.canGoBack() && navigation.goBack()
                    }}
                />
                {/* <Button icon={X} scaleIcon={2} aspectRatio={1} chromeless opacity={0} /> */}
            </XStack>
        </Screen>
    )
}
