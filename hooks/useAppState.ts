// SOURCE: https://github.com/react-native-community/hooks/blob/main/src/useAppState.ts

import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export function useAppState() {
    const currentState = AppState.currentState
    const [appState, setAppState] = useState(currentState)

    useEffect(() => {
        function onChange(newState: AppStateStatus) {
            setAppState(newState)
        }

        const subscription = AppState.addEventListener('change', onChange)

        return () => {
            subscription.remove()
        }
    }, [])

    return appState
}