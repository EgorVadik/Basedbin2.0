'use client'

import {
    ClientSideSuspense,
    LiveblocksProvider,
    RoomProvider,
} from '@liveblocks/react/suspense'

export const LiveblocksProviderWrapper = ({
    children,
    roomId,
}: {
    children: React.ReactNode
    roomId: string
}) => {
    return (
        <LiveblocksProvider
            authEndpoint={`/api/liveblocks-auth?roomId=${roomId}`}
            throttle={16}
        >
            <RoomProvider
                id={roomId}
                initialPresence={{
                    cursor: { x: 0, y: 0 },
                }}
            >
                <ClientSideSuspense fallback={'loading'}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
