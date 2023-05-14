import React from "react";

// This class was copied from: https://gist.github.com/thiloplanz/6abf04f957197e9e3912
class MersenneTwister {

    /* Period parameters */
    private N = 624;
    private M = 397;
    private MATRIX_A = 0x9908b0df;   /* constant vector a */
    private UPPER_MASK = 0x80000000; /* most significant w-r bits */
    private LOWER_MASK = 0x7fffffff; /* least significant r bits */

    private mt = new Array(this.N); /* the array for the state vector */
    private mti = this.N + 1;  /* mti==N+1 means mt[N] is not initialized */

    constructor(seed?: number) {
        if (seed == undefined) {
            seed = new Date().getTime();
        }
        this.init_genrand(seed);
    }

    /* slight change for C++, 2004/2/26 */
    init_by_array(init_key: number[], key_length: number) {
        var i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
            if (j >= key_length) j = 0;
        }
        for (k = this.N - 1; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */

    /* generates a random number on [0,0xffffffff]-interval */
    genrand_int32() {
        var y;
        var mag01 = [0x0, this.MATRIX_A];
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti == this.N + 1)   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */

            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    /* generates a random number on [0,0x7fffffff]-interval */
    genrand_int31() {
        return (this.genrand_int32() >>> 1);
    }

    /* generates a random number on [0,1]-real-interval */
    genrand_real1() {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    }

    /* generates a random number on [0,1)-real-interval */
    random() {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on (0,1)-real-interval */
    genrand_real3() {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on [0,1) with 53-bit resolution*/
    genrand_res53() {
        var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }

    /* initializes mt[N] with a seed */
    private init_genrand(s: number) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    /* These real versions are due to Isaku Wada, 2002/01/09 added */
}

// Most of the code from here to end is copied from: https://gist.github.com/aalmada/623b71962125ccd6a1ba9dad549a77d3
type RGB = {
    r: number;
    g: number;
    b: number;
};

type HSL = {
    h: number;
    s: number;
    l: number;
};

type Shape = {
    tx: number;
    ty: number;
    rot: number;
    fill: HSL;
};

const shapeCount = 4;


// TODO customize this to be ne
const colorPallete: HSL[] = [
    {h: 271, s: 97, l: 71}, //purple?
    {h: 309, s: 74, l: 55}, //fushia? pink?
    {h: 90, s: 100, l: 50}, //crt video input green
    {h: 233, s: 99, l: 50}, //knock off pokemon blue
    {h: 50, s: 100, l: 50}, //yellow
    {h: 24, s: 100, l: 50}, //orange
    {h: 327, s: 100, l: 54}, //neon pink
    {h: 359, s: 89, l: 53}, //neon red

    // {h: 182, s: 98.6, l: 27.6}, // teal
    // {h: 28, s: 100.0, l: 49.4}, // bright orange
    // {h: 189, s: 93.7, l: 18.8}, // dark teal
    // {h: 15, s: 99.2, l: 48.6}, // orangered
    // {h: 341, s: 97.4, l: 54.3}, // magenta
    // {h: 341, s: 81.7, l: 42.9}, // raspberry
    // {h: 48, s: 100.0, l: 47.6}, // goldenrod
    // {h: 204, s: 89.5, l: 51.6}, // lightning blue
    // {h: 219, s: 75.9, l: 51.2}, // sail blue
    // {h: 39, s: 98.4, l: 47.6}, // gold
];

const genShape = (
    remainingColors: HSL[],
    index: number,
    total: number,
    generator: MersenneTwister
): Shape => {
    const firstRot = generator.random();
    const angle = Math.PI * 2 * firstRot;
    const velocity = (1 / total) * (generator.random() + index);

    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    // Third random is a shape rotation on top of all of that.
    const secondRot = generator.random();
    const rot = firstRot * 360 + secondRot * 180;

    const fill = genColor(remainingColors, generator);
    return {tx, ty, rot, fill};
};

const genColor = (colors: HSL[], generator: MersenneTwister): HSL => {
    // const _rand = generator.random(); // eslint-disable-line
    const idx = Math.floor(colors.length * generator.random());
    return colors.splice(idx, 1)[0];
};

const wobble = 30; // degrees
const hueShift = (colors: HSL[], generator: MersenneTwister): HSL[] => {
    const amount = generator.random() * wobble - wobble / 2;
    return colors.map(color => colorRotate(color, amount));
};

const colorRotate = ({h, s, l}: HSL, degrees: number): HSL => {
    h = (h + degrees) % 360;
    h = h < 0 ? 360 + h : h;
    return {h, s, l};
};

const HSLToRGB = ({h, s, l}: HSL): RGB => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
};

const RGBtoHex = ({r, g, b}: RGB) => {
    const toHex = (value: number) => value.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export type JazziconProps = Omit<React.SVGProps<SVGSVGElement>, "viewBox"> & {
    seed?: number | undefined;
};

const Jazzicon = ({seed, ...props}: JazziconProps) => {

    const generator = new MersenneTwister(seed);
    const remainingColors = hueShift(colorPallete, generator);

    const background = genColor(remainingColors, generator);

    const shapes: Shape[] = [];
    for (let index = 0; index < shapeCount - 1; index++) {
        shapes.push(
            genShape(remainingColors, index, shapeCount - 1, generator)
        );
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" {...props}>
            <mask id="mask" maskUnits="userSpaceOnUse">
                <circle cx=".5" cy=".5" r=".5" fill="white"/>
            </mask>
            <g mask="url(#mask)">
                <rect
                    key={0}
                    width="1"
                    height="1"
                    fill={RGBtoHex(HSLToRGB(background))}
                />
                {shapes.map(({tx, ty, rot, fill}, index) => (
                    <rect
                        key={index + 1}
                        width="1"
                        height="1"
                        transform-origin=".5 .5"
                        transform={`translate(${tx} ${ty}) rotate(${rot.toFixed(
                            1
                        )})`}
                        fill={RGBtoHex(HSLToRGB(fill))}
                    />
                ))}
            </g>
        </svg>
    );
};

export default Jazzicon;