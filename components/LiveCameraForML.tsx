import { useIsFocused, useNavigation } from "@react-navigation/native"
import { Screen } from "./Screen"
import { usePermissions } from "@/hooks/usePermissions"
import { useRef, useState } from "react"
import { useAppState } from "@/hooks/useAppState"
import { Camera, useCameraDevice } from "react-native-vision-camera"
import { convertToRGB } from "react-native-image-to-rgb"
// import { TensorflowModel } from "react-native-fast-tflite"
import { Button, View, XStack, YStack } from "tamagui"
import { Images, SwitchCamera, X } from "@tamagui/lucide-icons"
import { PermissionScreen } from "./PermissionScreen"
import { NoCameraFound } from "./NoCameraFound"
import { StyleSheet } from "react-native"
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker"
import ImageResizer from "@bam.tech/react-native-image-resizer"

const resizeImage = async (uri: string, width: number, height: number) => {
    try {
        const response = await ImageResizer.createResizedImage(
            uri,
            width,
            height,
            "JPEG",
            100,
            0,
            undefined,
            true,
            { mode: "stretch" }
        )
        console.log(response.height, "x", response.width, " img")
        return response.uri
    } catch (err) {
        console.error(err)
        return null
    }
}

export function LiveCameraForML() {
    const navigation = useNavigation()
    const { hasPermissions } = usePermissions()

    const [isLive, setIsLive] = useState(false)

    const isFocused = useIsFocused()
    const isActive = useAppState()

    const device = useCameraDevice("back")
    const cameraRef = useRef<Camera>(null)

    const isCameraActive = hasPermissions && isActive && isFocused
    const [model, setModel] = useState<TensorflowModel | null>(null)

    async function captureImage() {
        if (!cameraRef.current) return
        const photo = await cameraRef.current.takePhoto({
            flash: "off",
            enableShutterSound: true,
        })
        if (!photo) {
            console.log({ photo })
            return
        }
        const resizedPhoto = await resizeImage(`file://${photo.path}`, 320, 320)
        if (!resizedPhoto) return
        const convertedArray = await convertToRGB(resizedPhoto)
        let red = []
        let blue = []
        let green = []
        for (let index = 0; index < convertedArray.length; index += 3) {
            red.push(convertedArray[index] / 255)
            green.push(convertedArray[index + 1] / 255)
            blue.push(convertedArray[index + 2] / 255)
        }
        const finalArray = [...red, ...green, ...blue]
        //convert to Uint8 array buffer (but some models require float32 format)
        const arrayBuffer = new Uint8Array(finalArray)

        //
        const result = model?.runSync([arrayBuffer]) || []

        // Assuming `result` is the output tensor from the model with shape [1,5,8400]
        const outputTensor = result[0] // Access the tensor
        const numDetections = 8400 // Total number of predictions
        const Alldetections = []
        for (let i = 0; i < numDetections; i++) {
            const x = outputTensor[i]
            const y = outputTensor[i + 8400 * 1]
            const width = outputTensor[i + 8400 * 2]
            const height = outputTensor[i + 8400 * 3]
            const confidenceForclass1 = outputTensor[i + 8400 * 4]
            Alldetections.push({
                boundingBox: { x, y, width, height },
                score: confidenceForclass1,
            })
        }
        console.log("")
        // console.log(Alldetections)
        console.log({
            // convertedArray,
            // finalArray,
            // arrayBuffer,
            photo,
            resizedPhoto,
            // result,
            Alldetections,
        })
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        })

        console.log(result)

        // if (!result.canceled) {
        //     setImage(result.assets[0].uri)
        // }
    }

    if (!hasPermissions) return <PermissionScreen />
    if (device == null) return <NoCameraFound />

    return (
        <Screen justifyContent="center" alignItems="center">
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                device={device}
                isActive={isCameraActive}
                photo
                // frameProcessor={frameProcessor}
            />
            <YStack position="absolute" bottom="$0" left="$0" right="$0" gap="$2" zIndex={"$1"}>
                <Button
                    icon={SwitchCamera}
                    scaleIcon={2}
                    aspectRatio={1}
                    chromeless
                    pressStyle={{
                        scale: 0.9,
                        backgroundColor: "$colorTransparent",
                        borderWidth: "$0",
                    }}
                    onPress={pickImage}
                    margin="$3"
                    alignSelf="flex-end"
                />

                <XStack
                    px="$5"
                    py="$10"
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
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                        onPress={pickImage}
                    />
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
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                        chromeless
                        onPress={() => {
                            navigation.canGoBack() && navigation.goBack()
                        }}
                    />
                </XStack>
            </YStack>
        </Screen>
    )
}
