import { useNavigation } from "@react-navigation/native"
import { Screen } from "./Screen"
import { Button, H2, YStack } from "tamagui"

export function NoCameraFound() {
    const navigation = useNavigation()
    return (
        <Screen justifyContent="center" alignItems="center">
            <YStack gap={"$4"} maxWidth={360}>
                <H2 color={"$red10"}>No Camera Found</H2>
                <Button
                    pressStyle={{
                        scale: 0.95,
                    }}
                    borderRadius={"$12"}
                    onPress={() => {
                        navigation.canGoBack() && navigation.goBack()
                    }}
                >
                    Go Back
                </Button>
            </YStack>
        </Screen>
    )
}
