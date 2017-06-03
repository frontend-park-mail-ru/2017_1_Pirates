precision highp float;
uniform float time;

varying vec2 vUV;


vec2 fade(vec2 t)
{
	return t*t*t*(t*(t*6.0-15.0)+10.0);
}


vec4 permute(vec4 x)
{
	return mod(((x*34.0)+1.0)*x, 289.0);
}


float cnoise(vec2 P)
{
//  Classic Perlin 2D Noise
//  by Stefan Gustavson
//
	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
	Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
	vec4 ix = Pi.xzxz;
	vec4 iy = Pi.yyww;
	vec4 fx = Pf.xzxz;
	vec4 fy = Pf.yyww;
	vec4 i = permute(permute(ix) + iy);
	vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
	vec4 gy = abs(gx) - 0.5;
	vec4 tx = floor(gx + 0.5);
	gx = gx - tx;
	vec2 g00 = vec2(gx.x,gy.x);
	vec2 g10 = vec2(gx.y,gy.y);
	vec2 g01 = vec2(gx.z,gy.z);
	vec2 g11 = vec2(gx.w,gy.w);
	vec4 norm = 1.79284291400159 - 0.85373472095314 *
		vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
	g00 *= norm.x;
	g01 *= norm.y;
	g10 *= norm.z;
	g11 *= norm.w;
	float n00 = dot(g00, vec2(fx.x, fy.x));
	float n10 = dot(g10, vec2(fx.y, fy.y));
	float n01 = dot(g01, vec2(fx.z, fy.z));
	float n11 = dot(g11, vec2(fx.w, fy.w));
	vec2 fade_xy = fade(Pf.xy);
	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
	return 2.3 * n_xy;
}


vec3 correct(vec3 src) {
	src = src + vec3(29.0 / 255.0, 0.0, 38.0 / 255.0);
	return src;
}


float cubic_bezier(float x, vec4 p)
{
	float xx = x * x;
    float nx = 1.0 - x;
	float nxnx = nx * nx;
	return nxnx*nx*p[0] + 3.0*nxnx*x*p[1] + 3.0*nx*xx*p[2] + xx*x*p[3];
}


void main(void)
{
	float scale = 4.0; //0.005;
	float t = time + 100.0;

	vec2 coord = vUV;

	float star_scale = 1000.0;

	float first = 0.5 * sin(time * 0.1);
	float second = 0.5 * cos(time * 0.1);
	float flicker = 0.9 + 0.1 * sin(time * 100.0);
	float flicker2 = 0.9 + 0.1 * sin(time * 50.0);

	float val1 = cnoise(vec2(
		coord.x * scale,
		coord.y * scale + t * 0.2
	));

	float val2 = cnoise(vec2(
		coord.x * scale,
		coord.y * scale - t * 0.2
	));

	float stars1 = cnoise(vec2(
		coord.x * star_scale * 0.3,
		coord.y * star_scale * 0.3
	)) * 0.65;

	stars1 = 0.1 - cubic_bezier(stars1, vec4(1.0, 1.34, 0.76, -0.35));
	if (stars1 < 0.5) stars1 = 0.0;

	float stars2 = cnoise(vec2(
		coord.x * star_scale * 0.3 + 10000.0,
		coord.y * star_scale * 0.3 + 10000.0
	)) * 0.65;

	stars2 = 0.1 - cubic_bezier(stars2, vec4(1.0, 1.34, 0.76, -0.35));
	if (stars2 < 0.5) stars2 = 0.0;
	stars2 *= 0.5;

	vec3 color1 = vec3(124.0 / 255.0, 49.0  / 255.0, 86.0  / 255.0);
	vec3 color2 = vec3(25.0  / 255.0, 72.0  / 255.0, 108.0 / 255.0);
	vec3 color3 = vec3(160.0 / 255.0, 187.0 / 255.0, 208.0 / 255.0);

	vec3 color = correct(vec3(
		first * val1 * color1.r + second * val2 * color2.r + flicker * stars1 * color3.r + flicker * stars2 * color3.r,
		first * val1 * color1.g + second * val2 * color2.g + flicker * stars1 * color3.g + flicker * stars2 * color3.g,
		first * val1 * color1.b + second * val2 * color2.b + flicker * stars1 * color3.b + flicker * stars2 * color3.b
	));

	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}
