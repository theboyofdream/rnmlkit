import { ResultsBottomSheet, Screen } from "@/components"
import { useNavigation } from "@react-navigation/native"
import {
    AudioWaveform,
    FileScan,
    Github,
    Linkedin,
    Mail,
    PersonStanding,
    Scan,
    ScanFace,
    TextSelect,
} from "@tamagui/lucide-icons"
import { FunctionComponent, useState } from "react"
import Animated, { SharedTransition } from "react-native-reanimated"
import { Button, H1, ListItem, Text, View, XStack, YStack } from "tamagui"

export function SplashScreen() {
    const navigation = useNavigation()
    return (
        <Screen px="$3" gap="$2.5" scrollable>
            <YStack
                height={"$20"}
                paddingBottom={"$6"}
                justifyContent="flex-end"
                alignContent="center"
            >
                <H1>React Native</H1>
                <H1>ML Kit</H1>
            </YStack>

            <CustomListItem
                icon={TextSelect}
                title="Text recognition"
                subTitle="Extract text from images"
                onPress={() => navigation.navigate("TextRecognition")}
            />

            <CustomListItem
                icon={AudioWaveform}
                title="Speech recognition"
                subTitle="Convert speech to text"
            />

            <CustomListItem
                icon={ScanFace}
                title="Face detection"
                subTitle="Detect faces from images/live camera"
            />
            <CustomListItem
                icon={Scan}
                title="Object detection"
                subTitle="Detect objects from images/live camera"
            />
            <CustomListItem
                icon={FileScan}
                title="Docs scanner"
                subTitle="Detect documents from images"
            />
            <CustomListItem
                icon={PersonStanding}
                title="Pose Detection"
                subTitle="Detect documents from images"
                onPress={() => navigation.navigate("PoseDetection")}
            />

            <YStack gap="$2.5" py="$10" justifyContent="center" alignItems="center">
                <XStack justifyContent="center">
                    <Text theme={"alt2"}>Social Links</Text>
                </XStack>

                <XStack justifyContent="center" gap={"$3"}>
                    <Button
                        icon={Github}
                        scaleIcon={1.5}
                        aspectRatio={1}
                        chromeless
                        pressStyle={{
                            scale: 0.9,
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                    />
                    <Button
                        icon={Linkedin}
                        scaleIcon={1.5}
                        aspectRatio={1}
                        chromeless
                        pressStyle={{
                            scale: 0.9,
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                    />
                    <Button
                        icon={Mail}
                        scaleIcon={1.5}
                        aspectRatio={1}
                        chromeless
                        pressStyle={{
                            scale: 0.9,
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                    />
                </XStack>
            </YStack>
        </Screen>
    )
}

function SheetBTN() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button onPress={() => setOpen(true)}>Open Sheet</Button>
            <ResultsBottomSheet
                open={open}
                setOpen={setOpen}
                results={
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur itaque perferendis fugit reiciendis. Quibusdam suscipit quasi fugiat aspernatur, facilis officia ea, nam praesentium culpa minus commodi corrupti repudiandae deserunt perferendis."
                }
            />
        </>
    )
}

type CustomListItemProps = {
    icon?: JSX.Element | FunctionComponent<{ color?: any; size?: any }> | null | undefined
    title: string
    subTitle?: string
    onPress?: () => void
    sharedTransitionTag?: string
    sharedTransitionStyle?: SharedTransition | undefined
    liveTag?: boolean
}
function CustomListItem(props: CustomListItemProps) {
    return (
        <Animated.View
            sharedTransitionTag={props.sharedTransitionTag}
            sharedTransitionStyle={props.sharedTransitionStyle}
        >
            <ListItem
                hoverTheme
                pressStyle={{ scale: 0.99 }}
                radiused
                icon={props.icon}
                scaleIcon={1.5}
                title={
                    props.liveTag ? (
                        <XStack gap="$2">
                            <Text>Text recognition</Text>
                            <XStack
                                themeInverse={true}
                                px="$2"
                                borderRadius={"$2"}
                                backgroundColor={"$background"}
                            >
                                <Text>Live</Text>
                            </XStack>
                        </XStack>
                    ) : (
                        props.title
                    )
                }
                subTitle={props.subTitle}
                onPress={props.onPress}
            />
        </Animated.View>
    )
}
