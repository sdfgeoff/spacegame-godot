// NOTE: Shader automatically converted from Godot Engine 4.0.2.stable's CanvasItemMaterial.

shader_type canvas_item;
render_mode blend_mix;

uniform vec4 ship_color : source_color = vec4(1, 0, 0, 1);
uniform float ship_engine;


vec4 neon(float sdf, vec4 color, float glow_width) {
	float ramp = clamp(1.0 - sdf / glow_width, 0.0, 1.0);
	vec4 outp = vec4(0.0);
	ramp = ramp * ramp;
	outp += pow(color, vec4(4.0)) * ramp;
	ramp = ramp * ramp;
	outp += color * ramp;
	ramp = ramp * ramp;
	outp += vec4(1.0) * ramp;
	return outp;
}


void fragment() {
	vec4 color = vec4(0.0);
	vec4 raw_sprite = texture(TEXTURE, UV);
	color = neon(1.0 - raw_sprite.r, ship_color, 1.0);

	vec4 engine_color = ship_engine * ship_color;
	color += neon(1.0 - raw_sprite.b, engine_color, 1.0) * ship_engine;

	COLOR = color;
}