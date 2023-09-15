class_name Log

var logger_name: String
func _init(n: String):
	logger_name = n + '_'
	
func display(level: String, event: String, data: Dictionary = {}):
	print(level, ' ', event, ' ', JSON.stringify(data))
	
func info(event: String, data: Dictionary):
	event = logger_name + event
	display("INFO", event, data)
	
func warn(event: String, data: Dictionary):
	event = logger_name + event
	display("WARN", event, data)
	push_warning(event)
	
func error(event: String, data: Dictionary):
	event = logger_name + event
	display("ERRO", event, data)
	push_error(event)
