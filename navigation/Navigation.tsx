import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LinkingConfiguration from "./LinkingConfiguration"
import Providers from "@/providers"
import {
    HomeScreen,
    NotFoundScreen,
    PoseDetectionScreen,
    SplashScreen,
    TextRecognitionScreen,
} from "@/screens"

const Stack = createNativeStackNavigator()

export function Navigation() {
    return (
        <Providers>
            <NavigationContainer linking={LinkingConfiguration}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="TextRecognition" component={TextRecognitionScreen} />
                    <Stack.Screen name="PoseDetection" component={PoseDetectionScreen} />
                    <Stack.Screen
                        name="NotFound"
                        component={NotFoundScreen}
                        options={{ title: "Oops!" }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Providers>
    )
}
