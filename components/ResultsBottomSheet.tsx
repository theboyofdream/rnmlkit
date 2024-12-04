import { Copy, X } from "@tamagui/lucide-icons"
import * as Clipboard from "expo-clipboard"
import { ToastAndroid } from "react-native"
import { Button, Paragraph, Sheet, XStack } from "tamagui"

type ResultsBottomSheetProps = {
    open: boolean
    setOpen: (open: boolean) => void
    results: string
}
export function ResultsBottomSheet({ open, setOpen, results }: ResultsBottomSheetProps) {
    async function copyToClipboard() {
        await Clipboard.setStringAsync(results)
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
    }
    function closeBottomSheet() {
        setOpen(false)
    }

    return (
        <Sheet
            defaultOpen={open}
            open={open}
            onOpenChange={setOpen}
            modal
            forceRemoveScrollEnabled
            dismissOnSnapToBottom
            dismissOnOverlayPress
            snapPointsMode="mixed"
            snapPoints={["fit", "60%"]}
            animation="medium"
            zIndex={100_000}
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Frame
                gap="$3"
                padding="$3"
                borderTopLeftRadius={"$6"}
                borderTopRightRadius={"$6"}
            >
                <XStack justifyContent="space-between">
                    <Button
                        icon={Copy}
                        scaleIcon={1.3}
                        pressStyle={{
                            scale: 0.9,
                        }}
                        onPress={copyToClipboard}
                    >
                        Copy Results
                    </Button>
                    <Button
                        icon={X}
                        scaleIcon={1.5}
                        aspectRatio={1}
                        chromeless
                        pressStyle={{
                            scale: 0.9,
                            backgroundColor: "$colorTransparent",
                            borderWidth: "$0",
                        }}
                        onPress={closeBottomSheet}
                    />
                </XStack>
                <Paragraph>{results}</Paragraph>
                <Paragraph pb="$4" textAlign="center" theme={"alt2"}>
                    Long press to select the text
                </Paragraph>
            </Sheet.Frame>
        </Sheet>
    )
}
