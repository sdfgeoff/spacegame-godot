generate_message_types:
	cd server; godot --headless --script res://Scripts/NetworkBus/Messages/_generate.gd

generate_webserver:
	cd landship && npm run build;
	cd landship/dist && zip ../../server/web_bundle.zip * **/*


build:  # generate_message_types generate_webserver
	mkdir -p bin
	cd server; godot --headless --export-release "Linux/X11" ../bin/linux
