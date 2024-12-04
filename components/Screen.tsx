import Animated, { SharedTransition } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
// import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScrollView, YStack, YStackProps } from "tamagui"

type ScreenProps = YStackProps & {
    // sharedTransitionTag?: string
    // sharedTransitionStyle?: SharedTransition | undefined
    scrollable?: boolean
}

export function Screen({ scrollable = false, ...props }: ScreenProps) {
    const safeAreaInsets = useSafeAreaInsets()
    return (
        // <Animated.View
        //     style={{ flex: 1 }}
        //     sharedTransitionTag={props.sharedTransitionTag}
        //     sharedTransitionStyle={props.sharedTransitionStyle}
        // >
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={scrollable}
            backgroundColor={"$background"}
        >
            <YStack
                flex={1}
                backgroundColor={"$background"}
                padding={"$2"}
                paddingTop={safeAreaInsets.top}
                {...props}
            />
        </ScrollView>
        // </Animated.View>
    )
}
