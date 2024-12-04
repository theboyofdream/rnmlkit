import { useEffect } from "react"
import { useCameraPermission, useMicrophonePermission } from "react-native-vision-camera"

export function usePermissions() {
    const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission()
    const { hasPermission: hasMicrophonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission()

    const hasPermissions = hasCameraPermission && hasMicrophonePermission

    async function requestPermissions() {
        await requestCameraPermission()
        await requestMicrophonePermission()
    }

    useEffect(() => {
        if (hasPermissions) return
        requestPermissions()
    }, [])

    return {
        hasPermissions,
        requestCameraPermission,
    }
}