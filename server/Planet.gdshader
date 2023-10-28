shader_type spatial;


uniform float SEED = 2.0;
uniform int NUM_NOISE_OCTAVES = 6;
uniform int DISTORTS = 1;
uniform float DISTORT_STRENGTH = 0.7;
uniform float SCALE = 3.0;
uniform float CLOUD_SCALE = 2.0;
uniform float ATMOSPHERE_HEIGHT = 0.02;

uniform vec4 ATMOSPHERE_COLOR: source_color = vec4(0.54, 0.84, 0.89, 0.2);

varying vec3 localPosition;

float remap(float n, float mi, float ma, float nmi, float nma) {
	return (n - mi) / (ma-mi) * (nma - nmi) + nmi;
}

void vertex() {
	localPosition = NORMAL;
}

void light() {
	float d = dot(LIGHT, NORMAL);
	float wrap = (d + 1.0) / 2.0;

	vec3 atmosphere_transmission = remap(wrap, 0.5 - ATMOSPHERE_HEIGHT * 3.0, 1.0, 0.0, 1.0) * (1.0 - ATMOSPHERE_COLOR.rgb);
	vec3 atmosphere_scattered = remap(wrap, 0.5 - ATMOSPHERE_HEIGHT, 1.0, 0.0, 1.0) * (ATMOSPHERE_COLOR.rgb);
	vec3 atmosphere = (atmosphere_scattered + atmosphere_transmission) * 0.5;
	float direct = clamp(remap(wrap, 0.5, 1.0, 0.0, 1.0), 0., 1.);
	
	vec3 base = LIGHT_COLOR / PI * ATTENUATION;
	
	
	// Surface
	DIFFUSE_LIGHT += mix(
		atmosphere * base,
		direct * base,
		pow(1.0 - ATMOSPHERE_COLOR.a, 0.5)
	);
}


vec4 hash43(vec3 p3)
{
	vec4 p4 = vec4(p3, SEED);
	p4 = fract(p4  * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}


vec4 noise3(vec3 x) {
	const vec3 step = vec3(110, 241, 171);
	vec3 i = floor(x);
	vec3 f = fract(x);
	
	vec3 u = f * f * (3.0 - 2.0 * f); // Trilinear
	return mix(
		mix(
			mix( hash43(i + vec3(0, 0, 0)), hash43(i + vec3(1, 0, 0)), u.x),
			mix( hash43(i + vec3(0, 1, 0)), hash43(i + vec3(1, 1, 0)), u.x),
		u.y),
		mix(
			mix( hash43(i + vec3(0, 0, 1)), hash43(i + vec3(1, 0, 1)), u.x),
			mix( hash43(i + vec3(0, 1, 1)), hash43(i + vec3(1, 1, 1)), u.x),
		u.y),
	u.z
	);
}


vec4 fbm(vec3 x) {
	vec4 v = vec4(0.0);
	x *= SCALE;
	for (int i = 1; i <= NUM_NOISE_OCTAVES; i += 1) {
		vec4 n = noise3(x);
		v = mix(v, n * n, 1.0 / float(i * i));
		x = x * PI + 2.0;
	}
	return v;
}


vec4 sample_pallette(sampler2D tex, float percent)
{
    return pow(texture(tex, vec2(percent)), vec4(2.2));
}




uniform sampler2D land_pallette : repeat_disable;
uniform sampler2D cloud_pallette : repeat_disable;


void fragment() {
	// Place fragment code here.
	vec4 noise = vec4(0);
	vec4 land = vec4(0);
	for (int i=0; i<=DISTORTS; i+=1){
		noise = fbm(localPosition + noise.xyz * DISTORT_STRENGTH);
		vec4 sample = sample_pallette(land_pallette, (noise.y + float(i)) / float(DISTORTS + 1));
		land = mix(
			land,
			sample,
			vec4(pow(noise.x, float(i)))
		);
	}
	land = mix(land, sample_pallette(land_pallette, noise.x), noise.z);
	vec4 clouds = sample_pallette(cloud_pallette, fbm(3.0 + localPosition * CLOUD_SCALE + noise.x).x);
	
	float atmosphere = dot(NORMAL, VIEW);

	ALBEDO = mix(land.rgb, clouds.rgb, clouds.a);
	ALBEDO = mix(ATMOSPHERE_COLOR.rgb, ALBEDO, pow(atmosphere, ATMOSPHERE_COLOR.a));
	ROUGHNESS = 0.9;
	METALLIC = 0.0;
}
