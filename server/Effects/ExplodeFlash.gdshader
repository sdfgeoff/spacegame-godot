
shader_type spatial;


void fragment() {
	float alpha = dot(NORMAL, VIEW);
	alpha = alpha * alpha;
	alpha = alpha * alpha;
	ALBEDO = vec3(1.0);
	EMISSION = vec3(10.0);
	ALPHA = alpha;
}
