/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react"

import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { Tensor, TensorflowModel, useTensorflowModel } from "react-native-fast-tflite"
import {
    Camera,
    runAtTargetFps,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
} from "react-native-vision-camera"
import { useResizePlugin } from "vision-camera-resize-plugin"

function tensorToString(tensor: Tensor): string {
    return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`
}
function modelToString(model: TensorflowModel): string {
    return (
        `TFLite Model (${model.delegate}):\n` +
        `- Inputs: ${model.inputs.map(tensorToString).join("")}\n` +
        `- Outputs: ${model.outputs.map(tensorToString).join("")}`
    )
}

export function TextRecognitionScreen(): React.ReactNode {
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice("back")

    // from https://www.kaggle.com/models/tensorflow/efficientdet/frameworks/tfLite
    const model = useTensorflowModel(
        // require("@/assets/ai_models/efficientdet-lite0-detection-default-v1.tflite")
        require("@/assets/ai_models/ssd_mobilenet_v1_default.tflite")
        // { url: "https://tfhub.dev/google/lite-model/object_detection_v1.tflite" }
    )
    const actualModel = model.state === "loaded" ? model.model : undefined

    React.useEffect(() => {
        if (actualModel == null) return
        console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`)
    }, [actualModel])

    const { resize } = useResizePlugin()

    const frameProcessor = useFrameProcessor(
        (frame) => {
            "worklet"
            if (actualModel == null) {
                // model is still loading...
                return
            }

            runAtTargetFps(1 / 5, () => {
                "worklet"

                console.log(`Running inference on ${frame}`)
                const resized = resize(frame, {
                    scale: {
                        width: 320,
                        height: 320,
                    },
                    pixelFormat: "rgb",
                    dataType: "uint8",
                })
                const result = actualModel.runSync([resized])
                const num_detections = result[3]?.[0] ?? 0
                console.log("Result: " + num_detections, result)
            })
            // console.log(`Running inference on ${frame}`)
            // const resized = resize(frame, {
            //     scale: {
            //         width: 320,
            //         height: 320,
            //     },
            //     pixelFormat: "rgb",
            //     dataType: "uint8",
            // })
            // const result = actualModel.runSync([resized])
            // const num_detections = result[3]?.[0] ?? 0
            // console.log("Result: " + num_detections, result)
        },
        [actualModel]
    )

    React.useEffect(() => {
        requestPermission()
    }, [requestPermission])

    console.log(`Model: ${model.state} (${model.model != null})`)

    return (
        <View style={styles.container}>
            {hasPermission && device != null ? (
                <Camera
                    device={device}
                    style={StyleSheet.absoluteFill}
                    isActive={true}
                    frameProcessor={frameProcessor}
                    pixelFormat="yuv"
                />
            ) : (
                <Text>No Camera available.</Text>
            )}

            {model.state === "loading" && <ActivityIndicator size="small" color="white" />}

            {model.state === "error" && <Text>Failed to load model! {model.error.message}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})

// import { NoCameraFound, PermissionScreen, Screen } from "@/components"
// import { usePermissions } from "@/hooks/usePermissions"
// import { useIsFocused, useNavigation } from "@react-navigation/native"
// import {
//     Check,
//     ChevronLeft,
//     Flashlight,
//     FlashlightOff,
//     Images,
//     Radio,
//     SwitchCamera,
//     X,
// } from "@tamagui/lucide-icons"
// import { convertToRGB } from "react-native-image-to-rgb"
// import { useEffect, useRef, useState } from "react"
// import { Linking, StyleSheet } from "react-native"
// import { useSafeAreaInsets } from "react-native-safe-area-context"
// import {
//     Camera,
//     runAtTargetFps,
//     useCameraDevice,
//     useFrameProcessor,
// } from "react-native-vision-camera"
// import {
//     Button,
//     Checkbox,
//     getTokens,
//     H1,
//     H2,
//     H4,
//     H5,
//     Paragraph,
//     Switch,
//     Text,
//     View,
//     XStack,
//     YStack,
//     ZStack,
// } from "tamagui"
// import * as ImagePicker from "expo-image-picker"
// import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker"
// import { useAppState } from "@/hooks/useAppState"
// import { useTensorflowModel, loadTensorflowModel, TensorflowModel } from "react-native-fast-tflite"
// // import * as rnft from "react-native-fast-tflite"
// import { useAssets } from "expo-asset"

// import ImageResizer from "@bam.tech/react-native-image-resizer"

// const resizeImage = async (uri: string, width: number, height: number) => {
//     try {
//         const response = await ImageResizer.createResizedImage(
//             uri,
//             width,
//             height,
//             "JPEG",
//             100,
//             0,
//             undefined,
//             true,
//             { mode: "stretch" }
//         )
//         console.log(response.height, "x", response.width, " img")
//         return response.uri
//     } catch (err) {
//         console.error(err)
//         return null
//     }
// }

// // import { useTextRecognition } from "react-native-vision-camera-text-recognition"

// // const customTransition = SharedTransition.custom((values) => {
// //     "worklet"
// //     return {
// //         height: withSpring(values.targetHeight),
// //         // height: values.targetHeight,
// //         width: withSpring(values.targetWidth),
// //         originX: withSpring(values.targetOriginX),
// //         originY: withSpring(values.targetOriginY),
// //     }
// // })

// const TARGET_FPS = 2

// export function TextRecognitionScreen() {
//     // return <LiveCameraForML />

//     const safeAreaInsets = useSafeAreaInsets()
//     const tokens = getTokens()

//     const navigation = useNavigation()
//     const { hasPermissions } = usePermissions()

//     const [isLive, setIsLive] = useState(false)

//     const isFocused = useIsFocused()
//     const isActive = useAppState()

//     const device = useCameraDevice("back")
//     const cameraRef = useRef<Camera>(null)

//     const isCameraActive = hasPermissions && isActive && isFocused
//     const [model, setModel] = useState<TensorflowModel | null>(null)

//     useEffect(() => {
//         const loadModel = async () => {
//             try {
//                 const loadedModel = await loadTensorflowModel(
//                     // require("@/assets/ai_models/keras-ocr-dr-v2.tflite")
//                     require("@/assets/ai_models/efficientdet-lite0-detection-default-v1.tflite")
//                 )
//                 console.log("Model loaded:")
//                 console.dir(loadedModel)
//                 setModel(loadedModel)
//             } catch (error) {
//                 console.error("Error loading model:", error)
//             }
//         }

//         loadModel()
//     }, [])
//     const frameProcessor = useFrameProcessor((frame) => {
//         "worklet"
//         // console.log("I'm running synchronously at 60 FPS!")

//         runAtTargetFps(TARGET_FPS, () => {
//             "worklet"

//             // const data = scanText(frame)
//             // console.log(data, "data")
//             console.log("I'm running synchronously at 2 FPS!")
//             // const brightness = detectBrightness(frame)
//         })
//     }, [])

//     async function captureImage() {
//         if (!cameraRef.current) return
//         const photo = await cameraRef.current.takePhoto({
//             flash: "off",
//             enableShutterSound: true,
//         })
//         if (!photo) {
//             console.log({ photo })
//             return
//         }

//         // processImage(photo.path)
//         // return
//         const resizedPhoto = await resizeImage(`file://${photo.path}`, 320, 320)
//         if (!resizedPhoto) return
//         // const resizedPhoto = await resizeImage(`file://${photo.path}`, 200, 200)
//         // return
//         const convertedArray = await convertToRGB(resizedPhoto!)
//         let red = []
//         let blue = []
//         let green = []
//         for (let index = 0; index < convertedArray.length; index += 3) {
//             red.push(convertedArray[index] / 255)
//             green.push(convertedArray[index + 1] / 255)
//             blue.push(convertedArray[index + 2] / 255)
//         }
//         const finalArray = [...red, ...green, ...blue]
//         //convert to Uint8 array buffer (but some models require float32 format)
//         const arrayBuffer = new Uint8Array(finalArray)

//         //
//         const result = model?.runSync([arrayBuffer]) || []

//         // Assuming `result` is the output tensor from the model with shape [1,5,8400]
//         const outputTensor = result[0] // Access the tensor
//         // const numDetections = 8400 // Total number of predictions
//         // const Alldetections = []
//         // for (let i = 0; i < numDetections; i++) {
//         //     const x = outputTensor[i]
//         //     const y = outputTensor[i + 8400 * 1]
//         //     const width = outputTensor[i + 8400 * 2]
//         //     const height = outputTensor[i + 8400 * 3]
//         //     const confidenceForclass1 = outputTensor[i + 8400 * 4]
//         //     Alldetections.push({
//         //         boundingBox: { x, y, width, height },
//         //         score: confidenceForclass1,
//         //     })
//         // }
//         console.log("")
//         console.log(result[0])
//         // console.log(Alldetections)
//         // console.log({
//         //     // convertedArray,
//         //     // finalArray,
//         //     // arrayBuffer,
//         //     // photo,
//         //     // resizedPhoto,
//         //     // result: result[0],
//         //     // Alldetections,
//         // })
//         // console.log(Alldetections)
//     }

//     const pickImage = async () => {
//         // No permissions request is necessary for launching the image library
//         let result = await launchImageLibraryAsync({
//             mediaTypes: MediaTypeOptions.Images,
//             allowsEditing: true,
//             // aspect: [4, 3],
//             quality: 1,
//         })

//         console.log(result)

//         // if (!result.canceled) {
//         //     setImage(result.assets[0].uri)
//         // }
//     }

//     const processImage = async (image: any) => {
//         // if (!image) return

//         return
//         try {
//             // return
//             console.log({ image })
//             // Resize the image to the required input size for the model
//             // const resizedImage = await ImageResizer.createResizedImage(image, 224, 224, "JPEG", 100)
//             const resizedImage = await ImageResizer.createResizedImage(image, 200, 200, "JPEG", 100)

//             console.log(resizedImage)
//             return

//             // Convert the image to RGB format
//             const rgbImage = await convertToRGB(resizedImage.uri)

//             // Load the TFLite model
//             const model = await loadTensorflowModel(
//                 require("@/assets/ai_models/keras-ocr-dr-v2.tflite")
//             )

//             // Run inference
//             const output = await model.run(rgbImage)

//             console.log(output)
//             // Process the output to get the OCR result
//             // const ocrResult = processOutput(output)
//             // setResult(ocrResult)
//         } catch (error) {
//             console.error("Error processing image: ", error)
//         }
//     }

//     if (!hasPermissions) return <PermissionScreen />
//     if (device == null) return <NoCameraFound />

//     return (
//         <Screen justifyContent="center" alignItems="center">
//             <Camera
//                 ref={cameraRef}
//                 style={StyleSheet.absoluteFillObject}
//                 device={device}
//                 isActive={isCameraActive}
//                 photo
//                 // frameProcessor={frameProcessor}
//             />
//             <Button
//                 position="absolute"
//                 top={safeAreaInsets.top + tokens.space.$2.val}
//                 zIndex={"$1"}
//                 icon={Radio}
//                 scaleIcon={1.5}
//                 color={isLive ? "$red10" : "$color"}
//                 borderRadius={"$12"}
//                 pressStyle={{
//                     scale: 0.95,
//                     backgroundColor: "$backgroundHover",
//                     borderWidth: 0,
//                 }}
//                 onPress={() => setIsLive(!isLive)}
//             >
//                 <Text fontSize={"$3"}>Live {isLive ? "On" : "Off"}</Text>
//             </Button>

//             <YStack position="absolute" bottom="$0" left="$0" right="$0" gap="$2" zIndex={"$1"}>
//                 <Button
//                     icon={SwitchCamera}
//                     scaleIcon={2}
//                     aspectRatio={1}
//                     chromeless
//                     pressStyle={{
//                         scale: 0.9,
//                         backgroundColor: "$colorTransparent",
//                         borderWidth: "$0",
//                     }}
//                     onPress={pickImage}
//                     margin="$3"
//                     alignSelf="flex-end"
//                 />

//                 <XStack
//                     px="$5"
//                     py="$10"
//                     backgroundColor={"$background"}
//                     justifyContent="space-around"
//                     alignItems="center"
//                 >
//                     <Button
//                         icon={Images}
//                         scaleIcon={2}
//                         aspectRatio={1}
//                         chromeless
//                         pressStyle={{
//                             scale: 0.9,
//                             backgroundColor: "$colorTransparent",
//                             borderWidth: "$0",
//                         }}
//                         onPress={pickImage}
//                     />
//                     <Button
//                         aspectRatio={1}
//                         borderRadius={"$12"}
//                         height={"$6"}
//                         pressStyle={{
//                             scale: 0.95,
//                         }}
//                         onPress={captureImage}
//                     >
//                         <View
//                             borderColor={"$color"}
//                             borderWidth={"$1"}
//                             borderRadius={"$12"}
//                             padding={"$1.5"}
//                         >
//                             <View
//                                 backgroundColor={"$color"}
//                                 height={"$6"}
//                                 aspectRatio={1}
//                                 borderRadius={"$12"}
//                             />
//                         </View>
//                     </Button>
//                     <Button
//                         icon={X}
//                         scaleIcon={2}
//                         aspectRatio={1}
//                         pressStyle={{
//                             scale: 0.9,
//                             backgroundColor: "$colorTransparent",
//                             borderWidth: "$0",
//                         }}
//                         chromeless
//                         onPress={() => {
//                             navigation.canGoBack() && navigation.goBack()
//                         }}
//                     />
//                 </XStack>
//             </YStack>
//         </Screen>
//     )
// }
