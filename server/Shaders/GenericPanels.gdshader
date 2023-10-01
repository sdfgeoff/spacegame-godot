shader_type spatial;

instance uniform vec4 primary: source_color = vec4(0.4, 0.2, 0.0, 1.0);
instance uniform float bias = 0.0;
instance uniform vec3 primary_scale = vec3(1);

varying vec3 vPosition;

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}


vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}



float chebyshev(vec3 coords) {
    vec3 absd = abs(coords);
    return max(max(absd.x, absd.y), absd.z);
}


/// Returns the distance to the cell point
vec4 voroni(vec3 position) {
    vec4 min_dist = vec4(100.0, 0.0, 0.0, 0.0);

    for (float i=-1.0; i<=1.0; i+=1.0) {
        for (float j=-1.0; j<=1.0; j+=1.0) {
            for (float k=-1.0; k<=1.0; k+=1.0) {
                
                vec3 this_cell_id = floor(position) + 0.5 + vec3(i, j, k);
                vec3 this_cell_offset = hash33(this_cell_id);
                vec3 this_cell_point = this_cell_id + this_cell_offset;
                vec3 offset_vec = position - this_cell_point;
                float dist_to_this_cell_point = chebyshev(offset_vec);
                if (dist_to_this_cell_point < min_dist.x) {
                    min_dist = vec4(
                        dist_to_this_cell_point,
                        this_cell_offset
                    );
                }
            }
        }
    }
    return min_dist;
}



float bricks(vec2 uv, float mortar_size, float width, float height) {
  float rownum = floor(uv.y / height);
  float offset = width * 0.5 * float(int(rownum) % 2);
  float bricknum = floor((uv.x + offset) / width);

  float x = (uv.x + offset) - width * bricknum;
  float y = uv.y - height * rownum;

  float min_dist = min(min(x, y), min(width - x, height - y));
  if (min_dist >= mortar_size) {
    return hash12(vec2(rownum, bricknum)) * 0.9 + 0.1;
  }
  else {
    return 0.0;
  }
}



vec3 sampleTex(
        vec3 pos,
        
        vec3 tile_size,
        vec3 primary_size,
        
        vec3 tile1_color,
        vec3 tile2_color,
        vec3 primary_color,
        vec3 grooves_color
) {
    
	vec4 data = voroni(pos * primary_size);
    float primary_panels = clamp(mix(-20.0, 20.0, data.x + bias), -1.0, 1.0);
    
    float joiners = abs(primary_panels - 0.5);    
    if (primary_panels < 0.0) {
        return primary_color;
    }
    if (joiners < 0.2) {
        return grooves_color;
    }
    
    float texramp = bricks(pos.xy, 0.0, (0.5 + data.y) * tile_size.x, (0.5 + data.y) * tile_size.y);
    
    return mix(
            grooves_color,
            mix(tile1_color, tile2_color, texramp),
            step(0.1, texramp)
        );
}


void vertex() {
	vPosition = VERTEX;
}


void fragment() {
    // Normalized pixel coordinates (from 0 to 1)
	
	vec3 coords = vPosition;
	//coords.xy = UV;
	//coords.z = 0.0;
	coords.x = abs(coords.x);
	coords *= 0.5;
	
	vec3 col = vec3(0.0);

    col += sampleTex(
        coords, 
        vec3(1.0),
        primary_scale,
        vec3(0.1, 0.1, 0.1),
        vec3(0.4, 0.4, 0.4),
        primary.rgb,
        vec3(0.0, 0.0, 0.0)
    );
    
	METALLIC = 0.9;
	ROUGHNESS = col.g;
    ALBEDO = col;
}