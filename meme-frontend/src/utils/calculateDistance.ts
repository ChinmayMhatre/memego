export const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
) => {
    var a = 6378137;
    var b = 6356752.3142;
    var f = 1 / 298.257223563; // WGS-84 ellipsoid params
    var L = toRad(lng2 - lng1);
    var x = Math.atan(1 - f);
    var U1 = x * Math.tan(toRad(lat1));
    var U2 = x * Math.tan(toRad(lat2));
    var sinU1 = Math.sin(U1);
    var cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2);
    var cosU2 = Math.cos(U2);
    var lambda = L;
    var lambdaP;
    var iterLimit = 100;
    do {
        var sinLambda = Math.sin(lambda);
        var cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt(
            cosU2 * sinLambda * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
        );
        if (0 === sinSigma) {
            return 0; // co-incident points
        }
        var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda,
            sigma = Math.atan2(sinSigma, cosSigma),
            sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma,
            cosSqAlpha = 1 - sinAlpha * sinAlpha,
            cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha,
            C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        if (isNaN(cos2SigmaM)) {
            cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
        }
        lambdaP = lambda;
        lambda =
            L +
            (1 - C) *
            f *
            sinAlpha *
            (sigma +
                C *
                sinSigma *
                (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

    if (0 === iterLimit) {
        return NaN; // formula failed to converge
    }

    var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b),
        A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
        B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
        deltaSigma =
            B *
            sinSigma *
            (cos2SigmaM +
                (B / 4) *
                (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                    (B / 6) *
                    cos2SigmaM *
                    (-3 + 4 * sinSigma * sinSigma) *
                    (-3 + 4 * cos2SigmaM * cos2SigmaM))),
        s = b * A * (sigma - deltaSigma);
    return parseInt(s); // round to 1mm precision
};

const toRad = (value: number) => {
    return (value * Math.PI) / 180;
};
