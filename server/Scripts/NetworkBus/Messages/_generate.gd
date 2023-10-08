"""
This script looks at all the message types and constructs:

In Godot:
	 - factory functions
	 - serialization and deserialization functions

In Typescript:
	- interface definitions
	- serialization and deserialization functions
"""
extends SceneTree


const DIRECTORY = "res://Scripts/NetworkBus/Messages/"



func collect_topics():
	"""
	Generates a dictionary of all the topics and their properties.
	Topics are discovered by looking at all the files in the Messages directory.
	 """
	var dir = DirAccess.open(DIRECTORY)
	var files = dir.get_files()
	var topics = {}
	
	for file in files:
		if file.begins_with("_"):
			continue
		
		var filepath = DIRECTORY + file
		var loaded_script = load(filepath)
		var obj: RefCounted = loaded_script.new()
		
		var topic_name = file.replace('.gd', '')
		
		if topics.has(topic_name):
			push_error("Duplicate Topic Detected")
			
		
		var _ignore_defaults = func(prop):
			return ['RefCounted', 'script', file].find(prop['name']) == -1
		

		
		topics[topic_name] = {
			'obj': obj,
			'filepath': filepath,
			'topic': topic_name,
			'vars': obj.get_property_list().filter(_ignore_defaults)
		}
	return topics
	

func save_gdscript(topics):
	var output = """class_name Payload
# WARNING: AutoGenerated File. Do Not Modify
# Instead modify the files inside server/Scripts/NetworkBus/Messages
	
"""
	# Load all the types
	for topic in topics:
		var data = topics[topic]
		output += "const %s = preload('%s')\n" % [data["topic"], data["filepath"]]

	# Create Enum
	output += '\nenum Topic {'
	for topic in topics:
		var data = topics[topic]
		output += '\n	' + data['topic'].to_upper() + ','
	output += '\n}\n'

	# Mapping Dictionaries
	output += '\nconst TOPIC_TO_STRING = {'
	for topic in topics:
		var data = topics[topic]
		output += '\n	Topic.' + data['topic'].to_upper() + ': "' + data['topic'] + '",'
	output += '\n}\n'
	
	# Mapping The other way
	output += '\nconst STRING_TO_TOPIC = {'
	for topic in topics:
		var data = topics[topic]
		output += '\n	"' + data['topic'] + '": ' + 'Topic.' + data['topic'].to_upper() + ','
	output += '\n}\n'

	# Create constructors for each topic
	for topic in topics:
		var data = topics[topic]
		output += "
static func create_%s(%s) -> %s:
	var message = %s.new()
%s
	return message\n" % [
		data['topic'].to_lower(),
		vars_to_args(data['vars']),
		data['topic'],
		data['topic'],
		vars_to_fill('message', data['vars'])
	]
	
	# Mapping Dictionaries
	output += '\nconst TOPIC_TO_TYPE = {'
	for topic in topics:
		var data = topics[topic]
		output += '\n	Topic.' + data['topic'].to_upper() + ': ' + data['topic'] + ','
	output += '\n}\n'
	
	var f = FileAccess.open("res://Scripts/NetworkBus/Payload.gd", FileAccess.WRITE)
	f.store_string(output)
	f.close()


func save_typescript(topics):
	var typescript_output = """
// Autogenerated File. Do not edit
// Instead modify the files inside server/Scripts/NetworkBus/Messages
"""
	for topic in topics:
		var data = topics[topic]
		typescript_output += """
export interface %sMessage {
	topic: '%s';
	payload: {
%s
	};
}
""" % [
		data['topic'],
		data['topic'],
		vars_to_typescript_def(data['vars'])
	]
	
	# Union Type
	typescript_output += '\nexport type Message = '
	var topic_types = PackedStringArray([])
	for topic in topics:
		var data = topics[topic]
		topic_types.append(data['topic'] + 'Message')
	typescript_output += ' | '.join(topic_types)
	typescript_output += '\n'
	
	

	
	var f2 = FileAccess.open("../landship/src/models/MessageTypes.ts", FileAccess.WRITE)
	f2.store_string(typescript_output)
	f2.close()


func create_documentation(topics):
	var output_dir = "../documentation/src/networkbus/messages/"
	var summary = """
# Message Types
"""

	for topic in topics:
		var data = topics[topic]
		var f_raw := FileAccess.open(data["filepath"], FileAccess.READ)

		summary += """
# %s
```
%s
```
""" % [
			data['topic'],
			f_raw.get_as_text()
		]
	
	
	var f2 = FileAccess.open(output_dir + "topics.md", FileAccess.WRITE)
	f2.store_string(summary)



func _init():
	var topics = collect_topics()
	save_gdscript(topics)
	save_typescript(topics)
	create_documentation(topics)
	
	quit()



const TYPE_INT_TO_GODOT_TYPE = {
	TYPE_NIL: "null",
	TYPE_BOOL: "bool",
	TYPE_INT: "int",
	TYPE_FLOAT: "float",
	TYPE_STRING: "String",
	TYPE_VECTOR2: "Vector2",
	TYPE_VECTOR2I: "Vector2i",
	TYPE_RECT2: "Rect2",
	TYPE_RECT2I: "Rect2i",
	TYPE_VECTOR3: "Vector3",
	TYPE_VECTOR3I: "Vector3i",
	TYPE_TRANSFORM2D: "Transform2D",
	TYPE_VECTOR4: "Vector4",
	TYPE_VECTOR4I: "Vector4i",
	TYPE_PLANE: "Plane",
	TYPE_QUATERNION: "Quaternion",
	TYPE_AABB: "AABB",
	TYPE_BASIS: "Basis",
	TYPE_TRANSFORM3D: "Transform3D",
	TYPE_PROJECTION: "Projection",
	TYPE_COLOR: "Color",
	TYPE_STRING_NAME: "StringName",
	TYPE_NODE_PATH: "NodePath",
	TYPE_RID: "RID",
	TYPE_OBJECT: "Object",
	TYPE_CALLABLE: "Callable",
	TYPE_SIGNAL: "Signal",
	TYPE_DICTIONARY: "Dictionary",
	TYPE_ARRAY: "Array",
	TYPE_PACKED_BYTE_ARRAY: "PackedByteArray",
	TYPE_PACKED_INT32_ARRAY: "PackedInt32Array",
	TYPE_PACKED_INT64_ARRAY: "PackedInt64Array",
	TYPE_PACKED_FLOAT32_ARRAY: "PackedFloat32Array",
	TYPE_PACKED_FLOAT64_ARRAY: "PackedFloat64Array",
	TYPE_PACKED_STRING_ARRAY: "PackedStringArray",
	TYPE_PACKED_VECTOR2_ARRAY: "PackedVector2Array",
	TYPE_PACKED_VECTOR3_ARRAY: "PackedVector3Array",
	TYPE_PACKED_COLOR_ARRAY: "PackedColorArray",
}



const TYPE_INT_TO_TYPESCRIPT_TYPE = {
	TYPE_NIL: "null",
	TYPE_BOOL: "boolean",
	TYPE_INT: "number",
	TYPE_FLOAT: "number",
	TYPE_STRING: "string",
	TYPE_VECTOR2: "Vector2",
	TYPE_VECTOR2I: "Vector2i",
	TYPE_RECT2: "Rect2",
	TYPE_RECT2I: "Rect2i",
	TYPE_VECTOR3: "Vector3",
	TYPE_VECTOR3I: "Vector3i",
	TYPE_TRANSFORM2D: "Transform2D",
	TYPE_VECTOR4: "Vector4",
	TYPE_VECTOR4I: "Vector4i",
	TYPE_PLANE: "Plane",
	TYPE_QUATERNION: "Quaternion",
	TYPE_AABB: "AABB",
	TYPE_BASIS: "Basis",
	TYPE_TRANSFORM3D: "Transform3D",
	TYPE_PROJECTION: "Projection",
	TYPE_COLOR: "Color",
	TYPE_STRING_NAME: "StringName",
	TYPE_NODE_PATH: "NodePath",
	TYPE_RID: "RID",
	TYPE_OBJECT: "Object",
	TYPE_CALLABLE: "Callable",
	TYPE_SIGNAL: "Signal",
	TYPE_DICTIONARY: "Dictionary",
	TYPE_ARRAY: "Array",
	TYPE_PACKED_BYTE_ARRAY: "PackedByteArray",
	TYPE_PACKED_INT32_ARRAY: "PackedInt32Array",
	TYPE_PACKED_INT64_ARRAY: "PackedInt64Array",
	TYPE_PACKED_FLOAT32_ARRAY: "PackedFloat32Array",
	TYPE_PACKED_FLOAT64_ARRAY: "PackedFloat64Array",
	TYPE_PACKED_STRING_ARRAY: "PackedStringArray",
	TYPE_PACKED_VECTOR2_ARRAY: "PackedVector2Array",
	TYPE_PACKED_VECTOR3_ARRAY: "PackedVector3Array",
	TYPE_PACKED_COLOR_ARRAY: "PackedColorArray",
}

func vars_to_args(vars):
	var vars2 = PackedStringArray([])
	for v in vars:
		vars2.append(v['name'] + ': ' +  TYPE_INT_TO_GODOT_TYPE[v['type']])
	return ', '.join(vars2)
	
func vars_to_typescript_def(vars):
	var vars2 = PackedStringArray([])
	for v in vars:
		vars2.append('\t\t' + v['name'] + ': ' +  TYPE_INT_TO_TYPESCRIPT_TYPE[v['type']])
	return ';\n'.join(vars2)

func vars_to_fill(cla, vars):
	var vars2 = PackedStringArray([])
	for v in vars:
		vars2.append('	' + cla + '.' + v['name'] + ' = ' + v['name'])
	return '\n'.join(vars2)
