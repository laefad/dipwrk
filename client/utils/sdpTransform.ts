export const sdpTransform = (sdp: string) => {
    return sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=510000')
}